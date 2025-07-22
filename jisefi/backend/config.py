# Configuration settings for the Flask application

import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your_default_secret_key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://postgres:12345@localhost:5432/jiseti_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
