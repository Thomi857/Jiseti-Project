from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from models import User
import logging

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if not all([username, email, password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    try:
        password_hash = generate_password_hash(password)
        user_id = User.create(username, email, password_hash)
        
        if not user_id:
            return jsonify({'error': 'Username or email already exists'}), 400
        
        # Create access token
        # FIX: Convert user_id to a string before creating the token
        access_token = create_access_token(identity=str(user_id))
        
        return jsonify({
            'access_token': access_token,
            'user': {'id': user_id, 'username': username, 'email': email, 'is_admin': False}
        }), 201
        
    except Exception as e:
        logging.error(f"Registration error: {e}")
        return jsonify({'error': 'Registration failed'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        user = User.find_by_username(username)
        
        if user and check_password_hash(user['password_hash'], password):
            # FIX: Convert user['id'] to a string before creating the token
            access_token = create_access_token(identity=str(user['id']))
            
            return jsonify({
                'access_token': access_token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'is_admin': user['is_admin']
                }
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
            
    except Exception as e:
        logging.error(f"Login error: {e}")
        return jsonify({'error': 'Login failed'}), 500