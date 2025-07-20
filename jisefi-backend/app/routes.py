import os
from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import User, Report, ReportType, ReportStatus
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

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
    subject = request.form.get('subject')  # Changed from 'title'
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

    if not all([subject, description, report_type, latitude is not None, longitude is not None]):
        return jsonify({'msg': 'Missing required fields or invalid coordinates'}), 400

    if not isinstance(subject, str) or not subject.strip():
        return jsonify({'msg': 'Subject must be a non-empty string'}), 422

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
        subject=subject,  # Changed from 'title'
        description=description,
        type=ReportType(report_type),
        latitude=latitude,
        longitude=longitude,
        media_url=media_url
    )
    db.session.add(report)
    db.session.commit()
    return jsonify({'msg': 'Report created successfully', 'report_id': report.id}), 201

@main.route('/reports', methods=['GET'])
@jwt_required()
def get_reports():
    user_id = get_jwt_identity()
    claims = get_jwt()
    user_role = claims.get('role')

    if user_role == 'admin':
        reports = Report.query.all()
    else:
        reports = Report.query.filter_by(user_id=user_id).all()

    result = [{
        'id': r.id,
        'subject': r.subject,  # Changed from 'title'
        'description': r.description,
        'type': r.type.value,
        'latitude': r.latitude,
        'longitude': r.longitude,
        'status': r.status.value,
        'created_at': r.created_at.isoformat(),
        'updated_at': r.updated_at.isoformat(),
        'media_url': r.media_url
    } for r in reports]
    return jsonify(result), 200

@main.route('/reports/<int:report_id>', methods=['PUT'])
@jwt_required()
def edit_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.get_or_404(report_id)

    if report.user_id != user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    if report.status != ReportStatus.draft:
        return jsonify({'msg': 'Cannot edit report unless status is Draft'}), 400

    data = request.get_json()
    report.subject = data.get('subject', report.subject)  # Changed from 'title'
    report.description = data.get('description', report.description)
    report.type = ReportType(data.get('type')) if data.get('type') else report.type
    report.latitude = data.get('latitude', report.latitude)
    report.longitude = data.get('longitude', report.longitude)
    db.session.commit()
    return jsonify({'msg': 'Report updated successfully'}), 200

@main.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.get_or_404(report_id)

    if report.user_id != user_id:
        return jsonify({'msg': 'Unauthorized'}), 403
    if report.status != ReportStatus.draft:
        return jsonify({'msg': 'Cannot delete report unless status is Draft'}), 400

    db.session.delete(report)
    db.session.commit()
    return jsonify({'msg': 'Report deleted successfully'}), 200

@main.route('/reports/<int:report_id>/status', methods=['PATCH'])
@jwt_required()
def update_report_status(report_id):
    claims = get_jwt()
    if claims.get('role') != 'admin':
        return jsonify({'msg': 'Only admins can update report status'}), 403
    report = Report.query.get_or_404(report_id)
    data = request.get_json()
    new_status = data.get('status')

    valid_statuses = [ReportStatus.under_investigation.value, ReportStatus.rejected.value, ReportStatus.resolved.value]
    if new_status not in valid_statuses:
        return jsonify({'msg': 'Invalid status'}), 400

    report.status = ReportStatus(new_status)
    db.session.commit()
    return jsonify({'msg': f'Report status updated to {new_status}'}), 200

@main.route('/test', methods=['POST'])
def test_route():
    data = request.get_json()
    return jsonify(data), 200