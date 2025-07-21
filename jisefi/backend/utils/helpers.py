# This file contains general utility functions, such as validators and token handling.

def validate_email(email):
    """Validate the format of an email address."""
    import re
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

def generate_token(data, secret, expiration=3600):
    """Generate a token using the provided data and secret."""
    import jwt
    from datetime import datetime, timedelta

    payload = {
        'data': data,
        'exp': datetime.utcnow() + timedelta(seconds=expiration)
    }
    return jwt.encode(payload, secret, algorithm='HS256')

def decode_token(token, secret):
    """Decode a token and return the data."""
    import jwt

    try:
        payload = jwt.decode(token, secret, algorithms=['HS256'])
        return payload['data']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def hash_password(password):
    """Hash a password using a secure hashing algorithm."""
    from werkzeug.security import generate_password_hash
    return generate_password_hash(password)

def check_password(hashed_password, password):
    """Check a hashed password against a plain password."""
    from werkzeug.security import check_password_hash
    return check_password_hash(hashed_password, password)

def verify_token(token):
    # Placeholder logic for now
    return True
