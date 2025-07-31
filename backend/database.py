from psycopg import connect
import logging

def get_db_connection():
    """Establish connection to PostgreSQL database"""
    try:
        from config import Config
        return connect(Config.DATABASE_CONFIG, row_factory=dict_row)
    except Exception as e:
        logging.error(f"Database connection error: {e}")
        return None

def init_db():
    """Initialize tables and seed default admin user"""
    conn = get_db_connection()
    if not conn:
        return False

    try:
        with conn.cursor() as cur:
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(80) UNIQUE NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password_hash VARCHAR(255) NOT NULL,
                    is_admin BOOLEAN DEFAULT FALSE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cur.execute('''
                CREATE TABLE IF NOT EXISTS reports (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description TEXT NOT NULL,
                    record_type VARCHAR(20) NOT NULL CHECK (record_type IN ('red_flag', 'intervention')),
                    latitude DECIMAL(10, 8) NOT NULL,
                    longitude DECIMAL(11, 8) NOT NULL,
                    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_investigation', 'rejected', 'resolved')),
                    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            ''')
            cur.execute("SELECT id FROM users WHERE username = 'admin'")
            if not cur.fetchone():
                from werkzeug.security import generate_password_hash
                admin_password = generate_password_hash('admin123')
                cur.execute('''
                    INSERT INTO users (username, email, password_hash, is_admin)
                    VALUES (%s, %s, %s, %s)
                ''', ('admin', 'admin@jiseti.com', admin_password, True))
            conn.commit()
        return True
    except Exception as e:
        logging.error(f"Database initialization error: {e}")
        return False
    finally:
        conn.close()
