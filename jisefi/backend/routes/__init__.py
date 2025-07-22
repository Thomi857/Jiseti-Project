from flask import Blueprint
from .admin import admin_bp
from .auth import auth_bp
from .records import records_bp

api_bp = Blueprint('api', __name__)

# Register blueprints to main blueprint
api_bp.register_blueprint(admin_bp, url_prefix='/admin')
api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(records_bp, url_prefix='/records')
def register_routes(app):
    from . import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

