from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pymysql
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Allow PyMySQL to be used in place of MySQLdb
pymysql.install_as_MySQLdb()
import MySQLdb

# Flask app setup
app = Flask(__name__)
CORS(app)

# === DB Config ===
db_config = {
    'host': os.getenv('DB_HOST', 'kithub.ch00sss2423b.us-east-2.rds.amazonaws.com'),
    'user': os.getenv('DB_USER', 'admin'),
    'password': os.getenv('DB_PASSWORD', 'Cooldude12090_'),
    'database': os.getenv('DB_NAME', 'Kithub'),
    'cursorclass': pymysql.cursors.Cursor
}

# File upload folder
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# === GET /api/posts ===
@app.route('/api/posts', methods=['GET'])
def get_posts():
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("""
        SELECT post_id, user_id, post_caption, post_date, post_comments, post_likes 
        FROM post 
        ORDER BY post_date DESC
    """)
    rows = cur.fetchall()
    cur.close()
    conn.close()

    posts = []
    for post_id, user_id, caption, date, comments, likes in rows:
        posts.append({
            'id': post_id,
            'userId': user_id,
            'text': caption,
            'createdAt': date.isoformat(),
            'comments': [],  # Comments fetched separately
            'likes': likes,
            'image': f'/image/{post_id}'  
        })
    return jsonify(posts)

# === POST /api/posts ===
@app.route('/api/posts', methods=['POST'])
def create_post():
    caption = request.form.get('title')
    user_id = request.form.get('user_id', 1)
    post_comments = 0
    post_likes = 0

    image = request.files.get('image')
    image_blob = image.read() if image else None

    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO post (post_caption, post_date, user_id, post_comments, post_likes, post_image) VALUES (%s, NOW(), %s, %s, %s, %s)",
        (caption, user_id, post_comments, post_likes, image_blob)
    )
    conn.commit()
    post_id = cur.lastrowid
    cur.close()
    conn.close()

    return jsonify({
        'id': post_id,
        'userId': user_id,
        'text': caption,
        'createdAt': __import__('datetime').datetime.utcnow().isoformat(),
        'comments': [],
        'likes': post_likes,
        'image': f'/image/{post_id}'
    }), 201

# === DELETE /api/posts/<id> ===
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("DELETE FROM post WHERE post_id = %s", (post_id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'message': f'Post {post_id} deleted'}), 200

# === GET image ===
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

# === GET /api/comments/<post_id> ===
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

# === POST /api/comments ===
@app.route('/api/comments', methods=['POST'])
def add_comment():
    data = request.json
    post_id = data.get('postId')
    user_id = data.get('userId')
    comment_text = data.get('text')

    if not post_id or not comment_text or not user_id:
        return jsonify({'error': 'Missing postId, text, or userId'}), 400

    # Ensure data is of correct type
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
    except pymysql.err.IntegrityError as e:
        return jsonify({'error': 'Invalid foreign key: user or post does not exist'}), 400
    finally:
        cur.close()
        conn.close()

    return jsonify({
        'id': comment_id,
        'postId': post_id,
        'userId': user_id,
        'text': comment_text,
        'createdAt': __import__('datetime').datetime.utcnow().isoformat()
    }), 201


@app.route('/api/register', methods=['POST'])
def register_user():
    data = request.json
    user_name = data.get('user_name')
    user_password = data.get('user_password')

    if not user_name or not user_password:
        return jsonify({'success': False, 'message': 'Missing username or password'}), 400

    try:
        conn = pymysql.connect(**db_config)
        cur = conn.cursor()

        # Check if username already exists
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

    except Exception as e:
        print("Registration error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500


@app.route('/api/login', methods=['POST'])
def login_user():
    data = request.json
    user_name = data.get('user_name')
    user_password = data.get('user_password')

    if not user_name or not user_password:
        return jsonify({'success': False, 'message': 'Missing credentials'}), 400

    try:
        conn = pymysql.connect(**db_config)
        cur = conn.cursor()
        cur.execute(
            "SELECT user_id FROM user WHERE user_name = %s AND user_password = %s",
            (user_name, user_password)
        )
        user = cur.fetchone()
        cur.close()
        conn.close()

        if user:
            return jsonify({'success': True, 'userId': user[0]})
        else:
            return jsonify({'success': False, 'message': 'Invalid username or password'}), 401

    except Exception as e:
        print("Login error:", e)
        return jsonify({'success': False, 'message': 'Server error'}), 500


# === GET /uploads/<filename> ===
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# === Run App ===
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=7777)
