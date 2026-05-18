from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.report_routes import reports_bp
import sys
import os

app = Flask(__name__, static_folder="../frontend/dist", template_folder="../frontend/dist")
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES
jwt = JWTManager(app)

allowed_origins = os.getenv('CORS_ALLOWED_ORIGINS')
if allowed_origins:
    parsed_origins = [origin.strip() for origin in allowed_origins.split(',') if origin.strip()]
    origins = '*' if parsed_origins == ['*'] else parsed_origins
else:
    origins = [
        "https://jiseti-project.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

CORS(app, resources={
    r"/api/*": {
        "origins": origins
    }
})

# Initialize DB at import time
if not init_db():
    print("Failed to initialize database. Exiting.")
    sys.exit(1)

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if not path or path.endswith('/'):
        return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, path)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')
