import os
from datetime import timedelta
from dotenv import load_dotenv
import urllib.parse as urlparse

load_dotenv()

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jiseti77')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    DATABASE_URL = os.getenv('DATABASE_URL')

    if DATABASE_URL:
        urlparse.uses_netloc.append("postgres")
        url = urlparse.urlparse(DATABASE_URL)

        DATABASE_CONFIG = {
            'host': url.hostname,
            'database': url.path.lstrip('/'),
            'user': url.username,
            'password': url.password,
            'port': url.port or 5432
        }
    else:
        DATABASE_CONFIG = {
            'host': os.getenv('DB_HOST', 'localhost'),
            'database': os.getenv('DB_NAME', 'jiseti'),
            'user': os.getenv('DB_USER', 'postgres'),
            'password': os.getenv('DB_PASSWORD', 'password'),
            'port': os.getenv('DB_PORT', '5432')
        }
