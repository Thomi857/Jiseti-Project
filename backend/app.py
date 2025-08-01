from dotenv import load_dotenv
load_dotenv()

from flask import Flask
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

CORS(
    app,
    resources={r"/api/*": {"origins": [
        "http://localhost:5173",
        "https://jiseti-corp.netlify.app"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"]
)



# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api')
app.register_blueprint(reports_bp, url_prefix='/api')

# Main run block
if __name__ == '__main__':
    if init_db():
        logging.info("✅ Database initialized successfully.")
        for rule in app.url_map.iter_rules():
            print(f"{rule.methods} -> {rule}")
        app.run(debug=True, port=5000)
    else:
        logging.error("❌ Failed to initialize the database.")
