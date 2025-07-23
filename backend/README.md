# Jiseti Backend

## Setup Instructions

1. **Install PostgreSQL**
   - Make sure PostgreSQL is running on your system
   - Create a database named `jiseti`

2. **Environment Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Configuration**
   - Update the database configuration in `app.py` with your PostgreSQL credentials
   - Default settings:
     - Host: localhost
     - Database: jiseti
     - User: postgres
     - Password: password
     - Port: 5432

4. **Run the Application**
   ```bash
   python app.py
   ```

The backend will start on `http://localhost:5000`

## Default Admin Account
- Username: admin
- Password: admin123

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report (authenticated)
- `PUT /api/reports/:id` - Update report (owner/admin)
- `DELETE /api/reports/:id` - Delete report (owner, draft only)

## Database Schema

### Users Table
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- is_admin (Boolean)
- created_at

### Reports Table
- id (Primary Key)
- title
- description
- record_type (red_flag/intervention)
- latitude
- longitude
- status (draft/under_investigation/rejected/resolved)
- user_id (Foreign Key)
- created_at
- updated_at