from psycopg.rows import dict_row  # Keep this for reference, but connection handles it
from database import get_db_connection
import logging

# Configure logging if not already done globally
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def _convert_report(report):
    """Ensure latitude and longitude are returned as floats"""
    if not report:
        return None
    try:
        report['latitude'] = float(report['latitude'])
        report['longitude'] = float(report['longitude'])
    except (KeyError, ValueError, TypeError):
        logging.warning("Latitude/longitude conversion failed for report.")
    return report

class User:
    @staticmethod
    def find_by_username(username):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM users WHERE username = %s", (username,))
                return cur.fetchone()
        except Exception as e:
            logging.error(f"Error finding user: {e}")
            return None
        finally:
            conn.close()

    @staticmethod
    def find_by_id(user_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                return cur.fetchone()
        except Exception as e:
            logging.error(f"Error finding user by ID: {e}")
            return None
        finally:
            conn.close()

    @staticmethod
    def create(username, email, password_hash):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor() as cur:  # Regular cursor for INSERT
                cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
                if cur.fetchone():
                    return None  # User already exists
                cur.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
                    (username, email, password_hash)
                )
                user_id = cur.fetchone()[0]  # Tuple with single id
                conn.commit()
                return user_id
        except Exception as e:
            logging.error(f"Error creating user: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            conn.close()

class Report:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        if not conn:
            return []
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    SELECT r.*, u.username
                    FROM reports r
                    JOIN users u ON r.user_id = u.id
                    ORDER BY r.created_at DESC
                    """
                )
                reports = cur.fetchall()
                return [_convert_report(report) for report in reports]
        except Exception as e:
            logging.error(f"Error getting reports: {e}")
            return []
        finally:
            conn.close()

    @staticmethod
    def get_by_id(report_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
                return _convert_report(cur.fetchone())
        except Exception as e:
            logging.error(f"Error getting report: {e}")
            return None
        finally:
            conn.close()

    @staticmethod
    def create(title, description, record_type, latitude, longitude, user_id):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute(
                    """
                    INSERT INTO reports (title, description, record_type, latitude, longitude, user_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *
                    """,
                    (title, description, record_type, latitude, longitude, user_id)
                )
                report = cur.fetchone()
                conn.commit()
                return _convert_report(report)
        except Exception as e:
            logging.error(f"Error creating report: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            conn.close()

    @staticmethod
    def update(report_id, update_data):
        conn = get_db_connection()
        if not conn:
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                update_fields = []
                params = []
                for field, value in update_data.items():
                    if field in ['title', 'description', 'latitude', 'longitude', 'status']:
                        update_fields.append(f"{field} = %s")
                        params.append(value)
                if not update_fields:
                    return None
                update_fields.append('updated_at = CURRENT_TIMESTAMP')
                params.append(report_id)
                cur.execute(
                    f"""
                    UPDATE reports
                    SET {', '.join(update_fields)}
                    WHERE id = %s
                    RETURNING *
                    """,
                    params
                )
                updated_report = cur.fetchone()
                conn.commit()
                return _convert_report(updated_report)
        except Exception as e:
            logging.error(f"Error updating report: {e}")
            if conn:
                conn.rollback()
            return None
        finally:
            conn.close()

    @staticmethod
    def delete(report_id):
        conn = get_db_connection()
        if not conn:
            return False
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM reports WHERE id = %s", (report_id,))
                deleted = cur.rowcount > 0
                conn.commit()
                return deleted
        except Exception as e:
            logging.error(f"Error deleting report: {e}")
            if conn:
                conn.rollback()
            return False
        finally:
            conn.close()
