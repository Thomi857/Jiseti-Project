import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY') or 'your-secret-key-fallback' # Added fallback for development
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL') or 'sqlite:///site.db' # Added fallback
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY') or 'super-secret-jwt-key-fallback' # Added fallback
    JWT_ACCESS_TOKEN_EXPIRES = 3600 # 1 hour, common default

    # --- ADDED FOR FILE UPLOADS ---
    # Define the folder where uploaded files will be stored.
    # It creates a 'static/uploads' directory relative to the app's root.

    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'static', 'uploads')
    # Define the allowed file extensions for uploads. Customize as needed.
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov'}
    # --- END FILE UPLOAD CONFIG ---
