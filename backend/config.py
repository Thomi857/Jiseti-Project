import os
from datetime import timedelta

class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # Database configuration using DSN directly as a string
    DATABASE_CONFIG = os.getenv(
        'DATABASE_URI',
        f"postgresql://{os.getenv('DB_USER', 'postgres')}:{os.getenv('DB_PASSWORD', 'password')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'jiseti')}"
    )
