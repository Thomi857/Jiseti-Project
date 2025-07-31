from dotenv import load_dotenv
load_dotenv()

from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.report_routes import reports_bp

# Create Flask app
app = Flask(__name__, static_folder="../frontend/dist", template_folder="../frontend/dist")

# Config
app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = Config.JWT_ACCESS_TOKEN_EXPIRES

# JWT & CORS setup
jwt = JWTManager(app)
CORS(app, resources={r"/api/*": {"origins": "https://jiseti-project.onrender.com"}})

# Initialize the database (always, even on Render)
init_db()

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')

# Serve React frontend for non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if not path or path.endswith('/'):
        return send_from_directory(app.static_folder, 'index.html')
    return send_from_directory(app.static_folder, path)

# Local run
if __name__ == '__main__':
    app.run(debug=True, port=5000)
