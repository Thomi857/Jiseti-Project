# from dotenv import load_dotenv
# load_dotenv()

# from flask import Flask, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt
# from flask_cors import CORS
# from werkzeug.security import generate_password_hash, check_password_hash
# from datetime import datetime, timedelta
# import os
# from functools import wraps

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:12345@localhost:5432/jisetii_db')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
# app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# db = SQLAlchemy(app)
# jwt = JWTManager(app)
# CORS(app, origins=["http://localhost:5173"])

# # Models
# class User(db.Model):
#     __tablename__ = 'users'
    
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)
#     email = db.Column(db.String(120), unique=True, nullable=False)
#     password_hash = db.Column(db.String(128), nullable=False)
#     role = db.Column(db.String(20), default='user', nullable=False)  # 'user' or 'admin'
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
#     reports = db.relationship('Report', backref='owner', lazy=True, cascade='all, delete-orphan')
    
#     def set_password(self, password):
#         self.password_hash = generate_password_hash(password)
    
#     def check_password(self, password):
#         return check_password_hash(self.password_hash, password)
    
#     def to_dict(self):
#         return {
#             'id': self.id,
#             'username': self.username,
#             'email': self.email,
#             'role': self.role,
#             'created_at': self.created_at.isoformat()
#         }

# class Report(db.Model):
#     __tablename__ = 'reports'
    
#     id = db.Column(db.Integer, primary_key=True)
#     title = db.Column(db.String(200), nullable=False)
#     description = db.Column(db.Text, nullable=False)
#     report_type = db.Column(db.String(50), nullable=False)  # 'red_flag' or 'intervention'
#     latitude = db.Column(db.Float, nullable=False)
#     longitude = db.Column(db.Float, nullable=False)
#     status = db.Column(db.String(50), default='draft', nullable=False)  # 'draft', 'under_investigation', 'rejected', 'resolved'
#     created_at = db.Column(db.DateTime, default=datetime.utcnow)
#     updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
#     def to_dict(self):
#         return {
#             'id': self.id,
#             'title': self.title,
#             'description': self.description,
#             'report_type': self.report_type,
#             'latitude': self.latitude,
#             'longitude': self.longitude,
#             'status': self.status,
#             'created_at': self.created_at.isoformat(),
#             'updated_at': self.updated_at.isoformat(),
#             'user_id': self.user_id,
#             'owner_username': self.owner.username
#         }

# # Helper decorators
# def admin_required(f):
#     @wraps(f)
#     @jwt_required()
#     def decorated_function(*args, **kwargs):
#         current_user_id = get_jwt_identity()
#         user = User.query.get(current_user_id)
#         if not user or user.role != 'admin':
#             return jsonify({'error': 'Admin access required'}), 403
#         return f(*args, **kwargs)
#     return decorated_function

# # Authentication Routes
# @app.route('/api/auth/register', methods=['POST'])
# def register():
#     try:
#         data = request.get_json()
        
#         # Validation
#         if not data.get('username') or not data.get('email') or not data.get('password'):
#             return jsonify({'error': 'Username, email, and password are required'}), 400
        
#         # Check if user already exists
#         if User.query.filter_by(username=data['username']).first():
#             return jsonify({'error': 'Username already exists'}), 400
        
#         if User.query.filter_by(email=data['email']).first():
#             return jsonify({'error': 'Email already registered'}), 400
        
#         # Create new user
#         user = User(
#             username=data['username'],
#             email=data['email']
#         )
#         user.set_password(data['password'])
        
#         db.session.add(user)
#         db.session.commit()
        
#         # Create access token
#         access_token = create_access_token(identity=user.id)
        
#         return jsonify({
#             'message': 'User created successfully',
#             'access_token': access_token,
#             'user': user.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Registration failed'}), 500

# @app.route('/api/auth/login', methods=['POST'])
# def login():
#     try:
#         data = request.get_json()
        
#         if not data.get('username') or not data.get('password'):
#             return jsonify({'error': 'Username and password are required'}), 400
        
#         user = User.query.filter_by(username=data['username']).first()
        
#         if user and user.check_password(data['password']):
#             access_token = create_access_token(identity=user.id)
#             return jsonify({
#                 'access_token': access_token,
#                 'user': user.to_dict()
#             }), 200
#         else:
#             return jsonify({'error': 'Invalid credentials'}), 401
            
#     except Exception as e:
#         return jsonify({'error': 'Login failed'}), 500

# @app.route('/api/auth/me', methods=['GET'])
# @jwt_required()
# def get_current_user():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
#     if user:
#         return jsonify({'user': user.to_dict()}), 200
#     return jsonify({'error': 'User not found'}), 404

# # Report Routes
# @app.route('/api/reports', methods=['GET'])
# def get_reports():
#     try:
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)
#         report_type = request.args.get('type')
#         status = request.args.get('status')
        
#         query = Report.query
        
#         if report_type:
#             query = query.filter_by(report_type=report_type)
#         if status:
#             query = query.filter_by(status=status)
            
#         reports = query.order_by(Report.created_at.desc()).paginate(
#             page=page, per_page=per_page, error_out=False
#         )
        
#         return jsonify({
#             'reports': [report.to_dict() for report in reports.items],
#             'total': reports.total,
#             'pages': reports.pages,
#             'current_page': reports.page
#         }), 200
        
#     except Exception as e:
#         return jsonify({'error': 'Failed to fetch reports'}), 500

# @app.route('/api/reports/<int:report_id>', methods=['GET'])
# def get_report(report_id):
#     try:
#         report = Report.query.get_or_404(report_id)
#         return jsonify({'report': report.to_dict()}), 200
#     except Exception as e:
#         return jsonify({'error': 'Report not found'}), 404

# @app.route('/api/reports', methods=['POST'])
# @jwt_required()
# def create_report():
#     try:
#         current_user_id = get_jwt_identity()
#         data = request.get_json()
        
#         # Validation
#         required_fields = ['title', 'description', 'report_type', 'latitude', 'longitude']
#         for field in required_fields:
#             if not data.get(field):
#                 return jsonify({'error': f'{field} is required'}), 400
        
#         if data['report_type'] not in ['red_flag', 'intervention']:
#             return jsonify({'error': 'Invalid report type'}), 400
        
#         # Validate coordinates
#         try:
#             lat = float(data['latitude'])
#             lng = float(data['longitude'])
#             if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
#                 raise ValueError()
#         except ValueError:
#             return jsonify({'error': 'Invalid coordinates'}), 400
        
#         report = Report(
#             title=data['title'],
#             description=data['description'],
#             report_type=data['report_type'],
#             latitude=lat,
#             longitude=lng,
#             user_id=current_user_id
#         )
        
#         db.session.add(report)
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Report created successfully',
#             'report': report.to_dict()
#         }), 201
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to create report'}), 500

# @app.route('/api/reports/<int:report_id>', methods=['PUT'])
# @jwt_required()
# def update_report(report_id):
#     try:
#         current_user_id = get_jwt_identity()
#         report = Report.query.get_or_404(report_id)
        
#         # Check ownership and status
#         if report.user_id != current_user_id:
#             return jsonify({'error': 'Unauthorized'}), 403
        
#         if report.status != 'draft':
#             return jsonify({'error': 'Can only edit draft reports'}), 403
        
#         data = request.get_json()
        
#         # Update allowed fields
#         if 'title' in data:
#             report.title = data['title']
#         if 'description' in data:
#             report.description = data['description']
#         if 'report_type' in data and data['report_type'] in ['red_flag', 'intervention']:
#             report.report_type = data['report_type']
        
#         report.updated_at = datetime.utcnow()
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Report updated successfully',
#             'report': report.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to update report'}), 500

# @app.route('/api/reports/<int:report_id>/location', methods=['PUT'])
# @jwt_required()
# def update_report_location(report_id):
#     try:
#         current_user_id = get_jwt_identity()
#         report = Report.query.get_or_404(report_id)
        
#         # Check ownership and status
#         if report.user_id != current_user_id:
#             return jsonify({'error': 'Unauthorized'}), 403
        
#         if report.status != 'draft':
#             return jsonify({'error': 'Can only edit location of draft reports'}), 403
        
#         data = request.get_json()
        
#         # Validate coordinates
#         try:
#             lat = float(data['latitude'])
#             lng = float(data['longitude'])
#             if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
#                 raise ValueError()
#         except (ValueError, KeyError):
#             return jsonify({'error': 'Invalid coordinates'}), 400
        
#         report.latitude = lat
#         report.longitude = lng
#         report.updated_at = datetime.utcnow()
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Location updated successfully',
#             'report': report.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to update location'}), 500

# @app.route('/api/reports/<int:report_id>', methods=['DELETE'])
# @jwt_required()
# def delete_report(report_id):
#     try:
#         current_user_id = get_jwt_identity()
#         report = Report.query.get_or_404(report_id)
        
#         # Check ownership and status
#         if report.user_id != current_user_id:
#             return jsonify({'error': 'Unauthorized'}), 403
        
#         if report.status != 'draft':
#             return jsonify({'error': 'Can only delete draft reports'}), 403
        
#         db.session.delete(report)
#         db.session.commit()
        
#         return jsonify({'message': 'Report deleted successfully'}), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to delete report'}), 500

# @app.route('/api/reports/<int:report_id>/status', methods=['PUT'])
# @admin_required
# def update_report_status(report_id):
#     try:
#         report = Report.query.get_or_404(report_id)
#         data = request.get_json()
        
#         valid_statuses = ['draft', 'under_investigation', 'rejected', 'resolved']
#         new_status = data.get('status')
        
#         if new_status not in valid_statuses:
#             return jsonify({'error': 'Invalid status'}), 400
        
#         report.status = new_status
#         report.updated_at = datetime.utcnow()
#         db.session.commit()
        
#         return jsonify({
#             'message': 'Status updated successfully',
#             'report': report.to_dict()
#         }), 200
        
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'error': 'Failed to update status'}), 500

# # Statistics endpoint for admin dashboard
# @app.route('/api/admin/stats', methods=['GET'])
# @admin_required
# def get_admin_stats():
#     try:
#         total_reports = Report.query.count()
#         red_flags = Report.query.filter_by(report_type='red_flag').count()
#         interventions = Report.query.filter_by(report_type='intervention').count()
        
#         status_counts = {}
#         for status in ['draft', 'under_investigation', 'rejected', 'resolved']:
#             status_counts[status] = Report.query.filter_by(status=status).count()
        
#         return jsonify({
#             'total_reports': total_reports,
#             'red_flags': red_flags,
#             'interventions': interventions,
#             'status_counts': status_counts
#         }), 200
        
#     except Exception as e:
#         return jsonify({'error': 'Failed to fetch statistics'}), 500

# # Initialize database
# with app.app_context():
#     db.create_all()
    
#     # Create admin user if it doesn't exist
#     admin = User.query.filter_by(username='admin').first()
#     if not admin:
#         admin = User(
#             username='admin',
#             email='admin@jiseti.com',
#             role='admin'
#         )
#         admin.set_password('admin123')  # Change this in production
#         db.session.add(admin)
#         db.session.commit()
#         print("Admin user created: admin/admin123")

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required,
    get_jwt_identity
)
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
from functools import wraps

app = Flask(__name__)

# Config
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:12345@localhost:5432/jisetii_db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
# CORS(app, origins=["http://localhost:5173"])
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# Models
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship('Report', backref='owner', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    report_type = db.Column(db.String(50), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='draft', nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'report_type': self.report_type,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id,
            'owner_username': self.owner.username
        }

# Helpers
def admin_required(f):
    @wraps(f)
    @jwt_required()
    def decorated(*args, **kwargs):
        current_user = User.query.get(get_jwt_identity())
        if not current_user or current_user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

# Routes
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the Jiseti API"}), 200

# Auth
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({'error': 'Missing fields'}), 400

    if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
        return jsonify({'error': 'User already exists'}), 409

    user = User(
        username=data['username'],
        email=data['email']
    )
    user.set_password(data['password'])
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not all(k in data for k in ('username', 'password')):
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(username=data['username']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=user.id)
    return jsonify({'token': token, 'user': user.to_dict()}), 200

# Reports
@app.route('/api/reports', methods=['GET'])
def get_all_reports():
    reports = Report.query.order_by(Report.created_at.desc()).all()
    return jsonify([r.to_dict() for r in reports]), 200

@app.route('/api/reports/<int:report_id>', methods=['GET'])
def get_single_report(report_id):
    report = Report.query.get_or_404(report_id)
    return jsonify(report.to_dict()), 200

@app.route('/api/reports', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    data = request.get_json()
    required = ('title', 'description', 'report_type', 'latitude', 'longitude')
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing fields'}), 400

    report = Report(
        title=data['title'],
        description=data['description'],
        report_type=data['report_type'],
        latitude=data['latitude'],
        longitude=data['longitude'],
        user_id=user_id
    )
    db.session.add(report)
    db.session.commit()
    return jsonify(report.to_dict()), 201

@app.route('/api/reports/<int:report_id>', methods=['PATCH'])
@jwt_required()
def update_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.get_or_404(report_id)

    if report.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if report.status != 'draft':
        return jsonify({'error': 'Only draft reports can be edited'}), 400

    data = request.get_json()
    for field in ('title', 'description', 'latitude', 'longitude'):
        if field in data:
            setattr(report, field, data[field])

    db.session.commit()
    return jsonify(report.to_dict()), 200

@app.route('/api/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    user_id = get_jwt_identity()
    report = Report.query.get_or_404(report_id)

    if report.user_id != user_id:
        return jsonify({'error': 'Unauthorized'}), 403
    if report.status != 'draft':
        return jsonify({'error': 'Only draft reports can be deleted'}), 400

    db.session.delete(report)
    db.session.commit()
    return jsonify({'message': 'Report deleted'}), 200

@app.route('/admin/reports/<int:report_id>/status', methods=['PATCH'])
@admin_required
def update_report_status(report_id):
    report = Report.query.get_or_404(report_id)
    data = request.get_json()
    if 'status' not in data:
        return jsonify({'error': 'Missing status'}), 400

    report.status = data['status']
    db.session.commit()
    return jsonify(report.to_dict()), 200

# Startup block
if __name__ == '__main__':
    with app.app_context():
        db.create_all()

        # Create default admin
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(
                username='admin',
                email='admin@jiseti.com',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("Admin user created: admin/admin123")

    app.run(debug=True, port=5000)
