import os
from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import User, Report, ReportType, ReportStatus
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

# Helper function
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

@main.route('/')
def index():
    return jsonify({'msg': 'Welcome to Jisefi API'})

@main.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'msg': 'Missing required fields'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'Email already registered'}), 409

    user = User(name=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({'msg': 'User registered successfully'}), 201

@main.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id, additional_claims={'role': user.role.value})
        return jsonify({'access_token': access_token}), 200
    return jsonify({'msg': 'Invalid credentials'}), 401

@main.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    title = request.form.get('title')
    description = request.form.get('description')
    report_type = request.form.get('type')
    latitude = request.form.get('lat')
    longitude = request.form.get('lng')
    media_file = request.files.get('media')
    user_id = get_jwt_identity()

    try:
        latitude = float(latitude) if latitude else None
        longitude = float(longitude) if longitude else None
    except (ValueError, TypeError):
        return jsonify({'msg': 'Invalid latitude or longitude format'}), 400

    if not all([title, description, report_type, latitude is not None, longitude is not None]):
        return jsonify({'msg': 'Missing required fields or invalid coordinates'}), 400

    if not isinstance(title, str) or not title.strip():
        return jsonify({'msg': 'Title must be a non-empty string'}), 422

    if report_type not in [e.value for e in ReportType]:
        return jsonify({'msg': 'Invalid report type'}), 400

    media_url = None
    if media_file:
        if allowed_file(media_file.filename):
            filename = secure_filename(media_file.filename)
            upload_folder = current_app.config['UPLOAD_FOLDER']
            os.makedirs(upload_folder, exist_ok=True)
            file_path = os.path.join(upload_folder, filename)
            media_file.save(file_path)
            media_url = f'/static/uploads/{filename}'
        else:
            return jsonify({'msg': 'File type not allowed'}), 400

    report = Report(
        user_id=user_id,
        title=title,
        description=description,
        type=ReportType(report_type),
        latitude=latitude,
        longitude=longitude,
        media_url=media_url
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'msg': 'Report created successfully', 'report_id': report.id}), 201

# ... keep rest of your routes similarly cleaned up
