from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models import db, User

bp = Blueprint("auth", __name__)

# SIGNUP
@bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"error": "Username or email already exists."}), 409

    hashed_password = generate_password_hash(password)
    user = User(username=username, email=email, password_hash=hashed_password)

    db.session.add(user)
    db.session.commit()

    session["user_id"] = user.id
    return jsonify({"message": "Signup successful!", "user": {"id": user.id, "username": user.username}}), 201

# LOGIN
@bp.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

# inside your login function
    session["user_id"] = user.id
    session["is_admin"] = user.is_admin
    return jsonify({"message": "Login successful!", "user": {"id": user.id, "username": user.username}})

# LOGOUT
@bp.route("/logout", methods=["DELETE"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message": "Logged out successfully."}), 200

# CHECK SESSION
@bp.route("/check_session")
def check_session():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(user_id)
    return jsonify({"id": user.id, "username": user.username, "email": user.email})
