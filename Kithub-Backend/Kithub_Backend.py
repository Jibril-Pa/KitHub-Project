from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import pymysql
import os
from dotenv import load_dotenv  # <-- fixed import

pymysql.install_as_MySQLdb()
import MySQLdb

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Load DB config from .env or default
db_config = {
    'host': os.getenv('DB_HOST', '192.168.7.82'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', 'Cooldude12090'),
    'database': os.getenv('DB_NAME', 'Kithub'),
    'cursorclass': pymysql.cursors.Cursor
}

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/api/posts', methods=['GET'])
def get_posts():
    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute("SELECT post_id, user_id, post_caption, post_date, post_comments, post_likes, image_filename FROM post ORDER BY post_date DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()

    posts = []
    for post_id, user_id, caption, date, comments, likes, image_filename in rows:
        posts.append({
            'id': post_id,
            'userId': user_id,
            'text': caption,
            'createdAt': date.isoformat(),
            'comments': comments,
            'likes': likes,
            'image': f'/uploads/{image_filename}' if image_filename else None
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
    image_filename = None

    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        image_filename = filename

    conn = pymysql.connect(**db_config)
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO post (post_caption, post_date, user_id, post_comments, post_likes, image_filename) VALUES (%s, NOW(), %s, %s, %s, %s)",
        (caption, user_id, post_comments, post_likes, image_filename)
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
        'image': f'/uploads/{image_filename}' if image_filename else None
    }), 201


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


# ✅ SINGLE app runner — no duplicates
if __name__ == '__main__':
    app.run(debug=True, port=7777)  # 0.0.0.0 makes it accessible from other devices
