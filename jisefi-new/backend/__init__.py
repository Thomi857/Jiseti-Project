from flask import Flask
from .config import Config
from .extensions import db, migrate
from .routes import register_blueprints

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)

    register_blueprints(app)
    
    @app.route("/")
    def home():
        return {"message": "Jiseti backend is running 🎉"}

    return app
