from database import init_db
import sys

if __name__ == '__main__':
    if init_db():
        print("Database initialized successfully.")
    else:
        print("Failed to initialize database.")
        sys.exit(1)
