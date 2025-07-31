from dotenv import load_dotenv
load_dotenv()

from flask import Flask, render_template, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import logging
from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.report_routes import reports_bp

app = Flask(__name__, static_folder="../frontend", template_folder="../frontend")
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Serve React frontend index.html
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and not path.endswith(".js") and not path.endswith(".css"):
        return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, path)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')

if __name__ == '__main__':
    if init_db():
        app.run(debug=True, port=5000)
    else:
        print("Failed to initialize database")
