from flask import current_app, jsonify
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from your_application.extensions import mail

def send_email(subject, recipient, body):
    msg = Message(subject, recipients=[recipient])
    msg.body = body
    mail.send(msg)

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=3600):
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(token, salt=current_app.config['SECURITY_PASSWORD_SALT'], max_age=expiration)
    except Exception:
        return False
    return email

def notify_user(email, subject, message):
    token = generate_confirmation_token(email)
    confirmation_url = f"{current_app.config['FRONTEND_URL']}/confirm/{token}"
    body = f"{message}\n\nPlease confirm your email by clicking the following link: {confirmation_url}"
    send_email(subject, email, body)