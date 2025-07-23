from functools import wraps
from flask import request, jsonify
from your_application.models import User  # Adjust the import based on your project structure

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 403
        # Add logic to verify the token and get the user
        user = User.verify_auth_token(token)  # Example method, adjust as necessary
        if not user:
            return jsonify({'message': 'Invalid token!'}), 403
        return f(user, *args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = kwargs.get('user')
        if not user.is_admin:  # Assuming User model has an is_admin attribute
            return jsonify({'message': 'Admin access required!'}), 403
        return f(*args, **kwargs)
    return decorated_function