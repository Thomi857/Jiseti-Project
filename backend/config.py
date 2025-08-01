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
            'host': 'localhost',
            'database': 'jiseti',
            'user': 'postgres',
            'password': 'password',
            'port': 5432
        }
