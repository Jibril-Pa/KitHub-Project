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
    "user": "KithubAdmin",  # Replace with your actual MySQL username or use an env variable
    "password": "Cooldude12090",  # Replace with your actual MySQL password or use an env variable
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

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    first_name = data.get("firstName")
    last_name = data.get("lastName")

    # Basic validation (you can extend this)
    if not username or not password or not first_name or not last_name:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    # Check if the username already exists
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    existing_user = cursor.fetchone()
    
    if existing_user:
        cursor.close()
        conn.close()
        return jsonify({"success": False, "message": "Username already exists"}), 400

    # Insert the new user into the database
    cursor.execute(
        "INSERT INTO users (username, password, first_name, last_name) VALUES (%s, %s, %s, %s)",
        (username, password, first_name, last_name)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return jsonify({"success": True, "message": "User registered successfully"})

if __name__ == "__main__":
    print(db_config)
    app.run(port=5000, debug=True)
