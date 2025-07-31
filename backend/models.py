# from psycopg.rows import dict_row  # Keep this for reference, but connection handles it
# from database import get_db_connection
# import logging

# # Configure logging if not already done globally
# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# def _convert_report(report):
#     """Ensure latitude and longitude are returned as floats"""
#     if not report:
#         return None
#     try:
#         report['latitude'] = float(report['latitude'])
#         report['longitude'] = float(report['longitude'])
#     except (KeyError, ValueError, TypeError):
#         logging.warning("Latitude/longitude conversion failed for report.")
#     return report

# class User:
#     @staticmethod
#     def find_by_username(username):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 cur.execute("SELECT * FROM users WHERE username = %s", (username,))
#                 return cur.fetchone()
#         except Exception as e:
#             logging.error(f"Error finding user: {e}")
#             return None
#         finally:
#             conn.close()

#     @staticmethod
#     def find_by_id(user_id):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
#                 return cur.fetchone()
#         except Exception as e:
#             logging.error(f"Error finding user by ID: {e}")
#             return None
#         finally:
#             conn.close()

#     @staticmethod
#     def create(username, email, password_hash):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor() as cur:  # Regular cursor for INSERT
#                 cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
#                 if cur.fetchone():
#                     return None  # User already exists
#                 cur.execute(
#                     "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
#                     (username, email, password_hash)
#                 )
#                 user_id = cur.fetchone()[0]  # Tuple with single id
#                 conn.commit()
#                 return user_id
#         except Exception as e:
#             logging.error(f"Error creating user: {e}")
#             if conn:
#                 conn.rollback()
#             return None
#         finally:
#             conn.close()

# class Report:
#     @staticmethod
#     def get_all():
#         conn = get_db_connection()
#         if not conn:
#             return []
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 cur.execute(
#                     """
#                     SELECT r.*, u.username
#                     FROM reports r
#                     JOIN users u ON r.user_id = u.id
#                     ORDER BY r.created_at DESC
#                     """
#                 )
#                 reports = cur.fetchall()
#                 return [_convert_report(report) for report in reports]
#         except Exception as e:
#             logging.error(f"Error getting reports: {e}")
#             return []
#         finally:
#             conn.close()

#     @staticmethod
#     def get_by_id(report_id):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 cur.execute("SELECT * FROM reports WHERE id = %s", (report_id,))
#                 return _convert_report(cur.fetchone())
#         except Exception as e:
#             logging.error(f"Error getting report: {e}")
#             return None
#         finally:
#             conn.close()

#     @staticmethod
#     def create(title, description, record_type, latitude, longitude, user_id):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 cur.execute(
#                     """
#                     INSERT INTO reports (title, description, record_type, latitude, longitude, user_id)
#                     VALUES (%s, %s, %s, %s, %s, %s)
#                     RETURNING *
#                     """,
#                     (title, description, record_type, latitude, longitude, user_id)
#                 )
#                 report = cur.fetchone()
#                 conn.commit()
#                 return _convert_report(report)
#         except Exception as e:
#             logging.error(f"Error creating report: {e}")
#             if conn:
#                 conn.rollback()
#             return None
#         finally:
#             conn.close()

#     @staticmethod
#     def update(report_id, update_data):
#         conn = get_db_connection()
#         if not conn:
#             return None
#         try:
#             with conn.cursor(row_factory=dict_row) as cur:
#                 update_fields = []
#                 params = []
#                 for field, value in update_data.items():
#                     if field in ['title', 'description', 'latitude', 'longitude', 'status']:
#                         update_fields.append(f"{field} = %s")
#                         params.append(value)
#                 if not update_fields:
#                     return None
#                 update_fields.append('updated_at = CURRENT_TIMESTAMP')
#                 params.append(report_id)
#                 cur.execute(
#                     f"""
#                     UPDATE reports
#                     SET {', '.join(update_fields)}
#                     WHERE id = %s
#                     RETURNING *
#                     """,
#                     params
#                 )
#                 updated_report = cur.fetchone()
#                 conn.commit()
#                 return _convert_report(updated_report)
#         except Exception as e:
#             logging.error(f"Error updating report: {e}")
#             if conn:
#                 conn.rollback()
#             return None
#         finally:
#             conn.close()

#     @staticmethod
#     def delete(report_id):
#         conn = get_db_connection()
#         if not conn:
#             return False
#         try:
#             with conn.cursor() as cur:
#                 cur.execute("DELETE FROM reports WHERE id = %s", (report_id,))
#                 deleted = cur.rowcount > 0
#                 conn.commit()
#                 return deleted
#         except Exception as e:
#             logging.error(f"Error deleting report: {e}")
#             if conn:
#                 conn.rollback()
#             return False
#         finally:
#             conn.close()
# models.py
from psycopg.rows import dict_row
from database import get_db_connection
import logging
import sys # Import sys for logging to stdout

# Configure logging if not already done globally
# Ensure this is configured once, ideally in app.py or a central config
# For debugging, setting it here explicitly:
logging.basicConfig(level=logging.INFO, stream=sys.stdout,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def _convert_report(report):
    """Ensure latitude and longitude are returned as floats"""
    if not report:
        return None
    try:
        report['latitude'] = float(report['latitude'])
        report['longitude'] = float(report['longitude'])
    except (KeyError, ValueError, TypeError):
        logging.warning("Latitude/longitude conversion failed for report.", exc_info=True) # Added exc_info
    return report

class User:
    @staticmethod
    def find_by_username(username):
        logging.info(f"User.find_by_username: Attempting to find user '{username}'")
        conn = get_db_connection()
        if not conn:
            logging.error("User.find_by_username: Failed to get database connection.")
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM users WHERE username = %s", (username,))
                user_data = cur.fetchone()
                if user_data:
                    logging.info(f"User.find_by_username: Found user '{username}'.")
                else:
                    logging.info(f"User.find_by_username: User '{username}' not found.")
                return user_data
        except Exception as e:
            logging.error(f"User.find_by_username: Error finding user '{username}': {e}", exc_info=True) # Added exc_info
            return None
        finally:
            if conn: # Ensure conn exists before closing
                conn.close()

    @staticmethod
    def find_by_id(user_id):
        logging.info(f"User.find_by_id: Attempting to find user by ID: {user_id}")
        conn = get_db_connection()
        if not conn:
            logging.error("User.find_by_id: Failed to get database connection.")
            return None
        try:
            with conn.cursor(row_factory=dict_row) as cur:
                cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
                user_data = cur.fetchone()
                if user_data:
                    logging.info(f"User.find_by_id: Found user with ID: {user_id}.")
                else:
                    logging.info(f"User.find_by_id: User with ID: {user_id} not found.")
                return user_data
        except Exception as e:
            logging.error(f"User.find_by_id: Error finding user by ID {user_id}: {e}", exc_info=True) # Added exc_info
            return None
        finally:
            if conn: # Ensure conn exists before closing
                conn.close()

    @staticmethod
    def create(username, email, password_hash):
        logging.info(f"User.create: Attempting to create user '{username}' with email '{email}'")
        conn = get_db_connection()
        if not conn:
            logging.error("User.create: Failed to get database connection.")
            return None
        try:
            with conn.cursor() as cur:  # Regular cursor for INSERT
                logging.info(f"User.create: Checking for existing user '{username}' or '{email}'.")
                cur.execute("SELECT id FROM users WHERE username = %s OR email = %s", (username, email))
                if cur.fetchone():
                    logging.warning(f"User.create: User with username '{username}' or email '{email}' already exists.")
                    return None  # User already exists
                
                logging.info(f"User.create: Inserting new user '{username}' into database.")
                cur.execute(
                    "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
                    (username, email, password_hash)
                )
                user_id_row = cur.fetchone() # Get the row containing the ID
                if user_id_row:
                    user_id = user_id_row[0]
                    conn.commit()
                    logging.info(f"User.create: Successfully created user '{username}' with ID: {user_id}")
                    return user_id
                else:
                    logging.error(f"User.create: INSERT statement did not return an ID for user '{username}'.")
                    conn.rollback() # Rollback if no ID was returned
                    return None
        except Exception as e:
            logging.error(f"User.create: An error occurred while creating user '{username}': {e}", exc_info=True) # Added exc_info
            if conn:
                conn.rollback() # Ensure rollback on error
            return None
        finally:
            if conn: # Ensure conn exists before closing
                conn.close()

class Report:
    # ... (rest of your Report class methods, add similar logging)
    # For example, in create:
    @staticmethod
    def create(title, description, record_type, latitude, longitude, user_id):
        logging.info(f"Report.create: Attempting to create report '{title}' for user {user_id}")
        conn = get_db_connection()
        if not conn:
            logging.error("Report.create: Failed to get database connection.")
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
                logging.info(f"Report.create: Successfully created report '{title}'.")
                return _convert_report(report)
        except Exception as e:
            logging.error(f"Report.create: Error creating report '{title}': {e}", exc_info=True) # Added exc_info
            if conn:
                conn.rollback()
            return None
        finally:
            if conn:
                conn.close()
