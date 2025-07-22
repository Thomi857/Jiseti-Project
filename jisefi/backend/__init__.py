from flask import Flask
from .extensions import db, migrate
from .models import Record  # or whatever models you have

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    app.config.from_object("backend.config.Config")  # note the full path

    db.init_app(app)
    migrate.init_app(app, db)

    # register blueprints
    from .routes import auth, admin, records
    app.register_blueprint(auth.bp)
    app.register_blueprint(admin.bp)
    app.register_blueprint(records.bp)

    return app
