from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from .config import Config
from dotenv import load_dotenv
import os
from flask_cors import CORS 

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    # Load environment variables from .env file
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}) # <--- ADD THIS LINE FOR CORS
    # This will allow all routes (r"/*") to accept requests from http://localhost:5173

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes import main
    app.register_blueprint(main)

    with app.app_context():
        for rule in app.url_map.iter_rules():
            print(f"{rule} -> {rule.endpoint}")


    return app