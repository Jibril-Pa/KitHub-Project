from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)
CORS(app)

# Replace with your actual DB credentials
db_config = {
    "host": "localhost",
    "user": "USERNAME_ENV",
    "password": "PASSWORD_ENV",
    "database": "KITHUB"
}

@app.route("/api/users", methods=["GET"])
def get_users():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(users)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if user:
        return jsonify({"success": True, "user": user})
    else:
        return jsonify({"success": False, "message": "Invalid credentials"}), 401

if __name__ == "__main__":
    app.run(port=5000, debug=True)