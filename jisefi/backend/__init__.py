from flask import Flask
from .extensions import db, migrate
from .models import Record  # or whatever models you have

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object("backend.config.Config")  # note the full path

    db.init_app(app)
    migrate.init_app(app, db)

    # register blueprints

    from .routes.auth import bp as auth_bp
    from .routes.admin import bp as admin_bp
    from .routes.records import bp as records_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(records_bp)
    return app
