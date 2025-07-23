from .auth import bp as auth_bp
from .admin import bp as admin_bp
from .records import bp as records_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(records_bp, url_prefix="/records")
