from flask import Blueprint, request, jsonify
from ..extensions import db
from ..models import User
from ..utils.helpers import generate_token, verify_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required.'}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'User already exists.'}), 400

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully.'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        token = generate_token(user.id)
        return jsonify({'token': token}), 200

    return jsonify({'message': 'Invalid username or password.'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Logic for logging out the user (e.g., invalidating the token) can be added here
    return jsonify({'message': 'User logged out successfully.'}), 200

@auth_bp.route('/verify', methods=['POST'])
def verify():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing.'}), 401

    user_id = verify_token(token)
    if user_id:
        return jsonify({'message': 'Token is valid.', 'user_id': user_id}), 200

    return jsonify({'message': 'Token is invalid.'}), 401