from psycopg2 import connect
from psycopg2.extras import RealDictCursor
from config import Config
import logging

def get_db_connection():
    try:
        return connect(**Config.DATABASE_CONFIG)
    except Exception as e:
        logging.error(f"Database connection error: {e}")
        return None

def init_db():
    conn = get_db_connection()
    if not conn:
        logging.error("❌ Could not connect to the database.")
        return False
    try:
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                is_admin BOOLEAN DEFAULT FALSE
            );
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS reports (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                record_type VARCHAR(50) NOT NULL,
                latitude DECIMAL(9,6) NOT NULL,
                longitude DECIMAL(9,6) NOT NULL,
                status VARCHAR(50) DEFAULT 'draft',
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ''')
        conn.commit()
        cur.close()
        conn.close()
        logging.info("✅ Tables created or verified.")
        return True
    except Exception as e:
        logging.error(f"❌ Error initializing database: {e}")
        return False
