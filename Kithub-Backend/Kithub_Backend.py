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

# === DB Config for Wi-Fi ===
# Replace '192.168.x.x' with your actual computer's IP address on your Wi-Fi network
db_config = {
    'host': os.getenv('DB_HOST', 'localhost'),  # <--- update this IP
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'Cooldude12090'),
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
            'comments': comments,
            'likes': likes,
            'image': f'/image/{post_id}'  
        })
    return jsonify(posts)

@app.route('/api/posts', methods=['POST'])
def create_post():
    caption = request.form.get('title')
    body = request.form.get('body')
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
        'comments': post_comments,
        'likes': post_likes,
        'image': f'/image/{post_id}'
    }), 201

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

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=7777)
