# jisefi Project

## Overview
The jisefi project is a web application built using Flask for the backend and React for the frontend. It is designed to manage records and provide user authentication, along with an admin interface for managing the application.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **Flask Framework**: The backend is built using Flask, a lightweight WSGI web application framework.
- **Database**: SQLAlchemy is used for database interactions.
- **Directory Structure**:
  - `requirements.txt`: Lists the Python dependencies required for the backend.
  - `config.py`: Contains application configuration settings.
  - `app.py`: The main entry point for the Flask application.
  - `extensions.py`: Initializes Flask extensions.
  - `models.py`: Defines the database schema using SQLAlchemy models.
  - `routes/`: Contains route definitions for various functionalities.
  - `services/`: Contains business logic for notifications and geocoding.
  - `utils/`: Contains utility functions and decorators.
  - `migrations/`: Manages database migrations using Alembic.
  - `tests/`: Contains unit and integration tests for the backend.

### Frontend
- **React Framework**: The frontend is built using React, a JavaScript library for building user interfaces.
- **Directory Structure**:
  - `public/`: Contains static files like HTML, manifest, and favicon.
  - `src/`: Contains the main application code, including components, pages, and API interactions.
  - `assets/`: Contains images, videos, and styles.
  - `hooks/`: Contains custom React hooks for reusable logic.
  - `context/`: Manages global state using React Context API.
  - `utils/`: Contains utility functions and constants.
  - `config/`: Contains frontend-specific configurations.

## Setup Instructions
1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd jisefi
   ```

2. **Backend Setup**:
   - Navigate to the `backend` directory.
   - Create a virtual environment and activate it:
     ```
     python -m venv venv
     source venv/bin/activate  # On Windows use `venv\Scripts\activate`
     ```
   - Install the required dependencies:
     ```
     pip install -r requirements.txt
     ```

3. **Frontend Setup**:
   - Navigate to the `frontend` directory.
   - Install the Node.js dependencies:
     ```
     npm install
     ```

4. **Run the Application**:
   - Start the backend server:
     ```
     flask run
     ```
   - Start the frontend development server:
     ```
     npm start
     ```

## Usage
- Access the application in your web browser at `http://localhost:3000`.
- Use the provided API endpoints for backend interactions as documented in `docs/api_endpoints.md`.

## Documentation
- API Endpoints: `docs/api_endpoints.md`
- Database Schema: `docs/database_schema.md`

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.