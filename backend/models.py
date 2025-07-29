from datetime import datetime
from database import db

# Enums for better DB validation (just like your CHECK constraints)
from sqlalchemy.dialects.postgresql import ENUM

record_type_enum = ENUM('red_flag', 'intervention', name='recordtype_enum', create_type=False)
status_enum = ENUM('draft', 'under_investigation', 'rejected', 'resolved', name='reportstatus_enum', create_type=False)


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    reports = db.relationship('Report', backref='user', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.isoformat()
        }

    @staticmethod
    def find_by_username(username):
        return User.query.filter_by(username=username).first()

    @staticmethod
    def find_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def create(username, email, password_hash):
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            return None

        new_user = User(
            username=username,
            email=email,
            password_hash=password_hash
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user.id


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    record_type = db.Column(record_type_enum, nullable=False)
    latitude = db.Column(db.Numeric(10, 8), nullable=False)
    longitude = db.Column(db.Numeric(11, 8), nullable=False)
    status = db.Column(status_enum, nullable=False, default='draft')
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'record_type': self.record_type,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'status': self.status,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

    @staticmethod
    def find_all_by_user(user_id):
        return Report.query.filter_by(user_id=user_id).all()

    @staticmethod
    def find_by_id(report_id):
        return Report.query.get(report_id)

    @staticmethod
    def create(data, user_id):
        report = Report(
            title=data['title'],
            description=data['description'],
            record_type=data['record_type'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            status='draft',
            user_id=user_id
        )
        db.session.add(report)
        db.session.commit()
        return report.id

    def update(self, data):
        for key in ['title', 'description', 'latitude', 'longitude', 'status']:
            if key in data:
                setattr(self, key, data[key])
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()
