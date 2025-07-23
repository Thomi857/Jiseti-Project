from dotenv import load_dotenv
load_dotenv()
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import logging

from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.report_routes import reports_bp

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES
jwt = JWTManager(app)
CORS(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')

if __name__ == '__main__':
    if init_db():
        app.run(debug=True, port=5000)
    else:
        print("Failed to initialize database")