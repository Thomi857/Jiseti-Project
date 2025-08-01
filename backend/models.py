from database import get_db_connection
from psycopg2.extras import RealDictCursor
import logging

def _convert_report(report):
    """Ensure latitude and longitude are returned as floats"""
    if not report:
        return None
    try:
        report = dict(report)
        report['latitude'] = float(report['latitude'])
        report['longitude'] = float(report['longitude'])
    except (KeyError, ValueError, TypeError):
        logging.warning("Latitude/longitude conversion failed.")
    return report

class User:
    @staticmethod
    def find_by_username(username):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cur.fetchone()
            cur.close()
            conn.close()
            return user
        except Exception as e:
            logging.error(f"Error finding user: {e}")
            return None
    
    @staticmethod
    def find_by_id(user_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            cur.close()
            conn.close()
            return user
        except Exception as e:
            logging.error(f"Error finding user by ID: {e}")
            return None
    
    @staticmethod
    def create(username, email, password_hash, is_admin=False):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            logging.warning(f"[CREATE USER] username={username}, email={email}, hashed={password_hash}")
            
            cur = conn.cursor()
            cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
            if cur.fetchone():
                return None
            cur.execute(
                "INSERT INTO users (username, email, password_hash, is_admin) VALUES (%s, %s, %s, %s) RETURNING id",
                (username, email, password_hash, is_admin)
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            return user_id
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            return None


class Report:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        if not conn:
            return []
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('''
                SELECT r.*, u.username 
                FROM reports r 
                JOIN users u ON r.user_id = u.id 
                ORDER BY r.created_at DESC
            ''')
            reports = cur.fetchall()
            cur.close()
            conn.close()
            return [_convert_report(report) for report in reports]
        except Exception as e:
            logging.error(f"Error getting reports: {e}")
            return []
    
    @staticmethod
    def get_by_id(report_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
            report = cur.fetchone()
            cur.close()
            conn.close()
            return _convert_report(report)
        except Exception as e:
            logging.error(f"Error getting report: {e}")
            return None
    
    @staticmethod
    def create(title, description, record_type, latitude, longitude, user_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute('''
                INSERT INTO reports (title, description, record_type, latitude, longitude, user_id) 
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING *
            ''', (title, description, record_type, latitude, longitude, user_id))
            report = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            return _convert_report(report)
        except Exception as e:
            logging.error(f"Error creating report: {e}")
            return None
    
    @staticmethod
    def update(report_id, update_data):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            cur = conn.cursor(cursor_factory=RealDictCursor)
            update_fields = []
            params = []
            for field, value in update_data.items():
                if field in ['title', 'description', 'latitude', 'longitude', 'status']:
                    update_fields.append(f'{field} = %s')
                    params.append(value)
            if not update_fields:
                return None
            update_fields.append('updated_at = CURRENT_TIMESTAMP')
            params.append(report_id)
            cur.execute(f'''
                UPDATE reports from flask import Blueprint, request, jsonify
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
        # 👇 Add these 2 lines for debugging:
        logging.warning(f"Login attempt: username={username}, password={password}")
        
        user = User.find_by_username(username)
        logging.warning(f"User from DB: {user}")

        if user and check_password_hash(user['password_hash'], password):
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

                SET {', '.join(update_fields)}
                WHERE id = %s 
                RETURNING *
            ''', params)
            updated_report = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            return _convert_report(updated_report)
        except Exception as e:
            logging.error(f"Error updating report: {e}")
            return None
    
    @staticmethod
    def delete(report_id):
        conn = get_db_connection()
        if not conn:
            return False
        try:
            cur = conn.cursor()
            cur.execute("DELETE FROM reports WHERE id = %s", (report_id,))
            deleted = cur.rowcount > 0
            conn.commit()
            cur.close()
            conn.close()
            return deleted
        except Exception as e:
            logging.error(f"Error deleting report: {e}")
            return False
