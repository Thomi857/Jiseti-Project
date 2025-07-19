from . import db
from datetime import datetime
from sqlalchemy import Enum
import enum
from werkzeug.security import generate_password_hash, check_password_hash


class UserRole(enum.Enum):
    user = "user"
    admin = "admin"

class ReportType(enum.Enum):
    red_flag = "red-flag"
    intervention = "intervention"

class ReportStatus(enum.Enum):
    draft = "Draft"
    under_investigation = "Under Investigation"
    rejected = "Rejected"
    resolved = "Resolved"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.Enum(UserRole), default=UserRole.user, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship('Report', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Report(db.Model):
    __tablename__ = 'reports'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    type = db.Column(db.Enum(ReportType), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(ReportStatus), default=ReportStatus.draft, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    media_url = db.Column(db.String(255), nullable=True) # <--- ADDED THIS LINE FOR MEDIA URL
