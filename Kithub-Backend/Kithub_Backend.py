from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pymysql
import boto3
import json
from botocore.exceptions import ClientError
from datetime import datetime
import os

pymysql.install_as_MySQLdb()
import MySQLdb

# === AWS Secrets Manager Setup ===
def get_db_secrets():
    secret_name = "kithub/db_credentials"
    region_name = "us-east-2"

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e

    secret = get_secret_value_response['SecretString']
    return json.loads(secret)

# Load secrets once at startup
db_secrets = get_db_secrets()

# === DB Config ===
db_config = {
    'host': db_secrets['DB_HOST'],
    'user': db_secrets['DB_USER'],
    'password': db_secrets['DB_PASSWORD'],
    'database': db_secrets['DB_NAME'],
    'cursorclass': pymysql.cursors.Cursor
}

# Flask app setup
app = Flask(__name__)
CORS(app)

# File upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/api/posts', methods=['GET'])
def get_posts():
    user_id = request.args.get('user_id', default=None, type=int)
    conn = pymysql.connect(**db_config)

    with conn.cursor() as cur:
        cur.execute("SELECT user_id, user_name FROM user")
        users = {int(uid): uname for uid, uname in cur.fetchall()}

        if user_id:
            cur.execute("""
                SELECT post_id, user_id, post_caption, post_date, post_comments, post_likes 
                FROM post 
                WHERE user_id = %s
                ORDER BY post_date DESC
            """, (user_id,))
        else:
            cur.execute("""
                SELECT post_id, user_id, post_caption, post_date, post_comments, post_likes 
                FROM post 
                ORDER BY post_date DESC
            """)
        posts_raw = cur.fetchall()

        cur.execute("""
            SELECT comment_id, post_id, user_id, comment_text, created_at
            FROM comments
        """)
        comments_raw = cur.fetchall()

    comments_by_post = {}
    for comment_id, post_id, commenter_id, text, created_at in comments_raw:
        comment = {
            'id': comment_id,
            'userName': users.get(int(commenter_id), "Unknown"),
            'text': text,
            'createdAt': created_at.isoformat()
        }
        comments_by_post.setdefault(post_id, []).append(comment)

    posts = []
    for post_id, author_id, caption, date, comments_count, likes in posts_raw:
        posts.append({
            'id': post_id,
            'userId': author_id,
            'userName': users.get(int(author_id), "Unknown"),
            'text': caption,
            'createdAt': date.isoformat(),
            'comments': comments_by_post.get(post_id, []),
            'likes': likes,
            'image': f'/image/{post_id}'
        })

    conn.close()
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    try:
        caption = request.form.get('title')
        user_id = request.form.get('user_id')

        if not user_id:
            return jsonify({'error': 'Missing user_id'}), 400

        user_id = int(user_id)

        conn = pymysql.connect(**db_config)
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM user WHERE user_id = %s", (user_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({'error': 'User ID does not exist'}), 400

        image = request.files.get('image')
        image_blob = image.read() if image else None

        cur.execute("""
            INSERT INTO post (post_caption, post_date, user_id, post_comments, post_likes, post_image)
            VALUES (%s, NOW(), %s, %s, %s, %s)
        """, (caption, user_id, 0, 0, image_blob))
        conn.commit()
        post_id = cur.lastrowid
        cur.close()
        conn.close()

        return jsonify({
            'id': post_id,
            'userId': user_id,
            'text': caption,
            'createdAt': datetime.utcnow().isoformat(),
            'comments': [],
            'likes': 0,
            'image': f'/image/{post_id}'
        }), 201

    except pymysql.err.IntegrityError:
        return jsonify({'error': 'Foreign key violation – user ID not valid'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("DELETE FROM post WHERE post_id = %s", (post_id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'message': f'Post {post_id} deleted'}), 200

@app.route('/image/<int:post_id>')
def get_image(post_id):
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT post_image FROM post WHERE post_id = %s", (post_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if result and result[0]:
        return app.response_class(result[0], mimetype='image/jpeg')
    else:
        return 'Image not found', 404

@app.route('/api/comments/<int:post_id>')
def get_comments(post_id):
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT comment_id, user_id, comment_text, created_at FROM comments WHERE post_id = %s", (post_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    comments = []
    for comment_id, user_id, text, created_at in rows:
        comments.append({
            'id': comment_id,
            'userId': user_id,
            'text': text,
            'createdAt': created_at.isoformat()
        })
    return jsonify(comments)

@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    post_id = data.get('postId')
    user_id = data.get('userId')
    comment_text = data.get('text')

    if not post_id or not comment_text or not user_id:
        return jsonify({'error': 'Missing postId, text, or userId'}), 400

    try:
        post_id = int(post_id)
        user_id = int(user_id)
    except ValueError:
        return jsonify({'error': 'Invalid postId or userId format'}), 400

    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO comments (post_id, user_id, comment_text, created_at) VALUES (%s, %s, %s, NOW())",
            (post_id, user_id, comment_text)
        )
        conn.commit()
        comment_id = cur.lastrowid
    except pymysql.err.IntegrityError:
        return jsonify({'error': 'Invalid foreign key: user or post does not exist'}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({
        'id': comment_id,
        'postId': post_id,
        'userId': user_id,
        'text': comment_text,
        'createdAt': datetime.utcnow().isoformat()
    }), 201

@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    user_name = data.get('user_name')
    user_password = data.get('user_password')

    if not user_name or not user_password:
        return jsonify({'success': False, 'message': 'Missing username or password'}), 400

    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT * FROM user WHERE user_name = %s", (user_name,))
    if cur.fetchone():
        return jsonify({'success': False, 'message': 'Username already exists'}), 400

    cur.execute(
        "INSERT INTO user (user_name, user_password, user_email, account_type, profile_picture) VALUES (%s, %s, '', 'user', NULL)",
        (user_name, user_password)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({'success': True}), 201

@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    user_name = data.get('user_name')
    user_password = data.get('user_password')

    if not user_name or not user_password:
        return jsonify({'success': False, 'message': 'Missing credentials'}), 400

    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute(
        "SELECT user_id, user_name FROM user WHERE user_name = %s AND user_password = %s",
        (user_name, user_password)
    )
    user = cur.fetchone()
    cur.close()
    conn.close()

    if user:
        return jsonify({
            'success': True,
            'userId': user[0],
            'username': user[1]
        })
    else:
        return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

@app.route('/api/user/<int:user_id>/profile-picture', methods=['POST'])
def upload_profile_picture(user_id):
    image = request.files.get('profile_picture')
    if not image:
        return jsonify({'error': 'No image uploaded'}), 400

    image_blob = image.read()
    conn = pymysql.connect(**db_config)
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT user_id FROM user WHERE user_id = %s", (user_id,))
            if not cur.fetchone():
                return jsonify({'error': 'User not found'}), 404
            cur.execute("UPDATE user SET profile_picture = %s WHERE user_id = %s", (image_blob, user_id))
        conn.commit()
    finally:
        conn.close()

    return jsonify({'message': 'Profile picture updated'}), 200

@app.route('/api/user/<int:user_id>/profile-picture', methods=['GET'])
def get_profile_picture(user_id):
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT profile_picture FROM user WHERE user_id = %s", (user_id,))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if result and result[0]:
        return app.response_class(result[0], mimetype='application/octet-stream')
    else:
        return 'No profile picture', 404

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=7777)