# API Endpoints Documentation

## Authentication

### Register
- **Endpoint:** `POST /api/auth/register`
- **Description:** Registers a new user.
- **Request Body:**
  - `username`: string
  - `password`: string
  - `email`: string
- **Response:**
  - `201 Created`: User successfully registered.
  - `400 Bad Request`: Validation errors.

### Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticates a user and returns a token.
- **Request Body:**
  - `username`: string
  - `password`: string
- **Response:**
  - `200 OK`: Returns authentication token.
  - `401 Unauthorized`: Invalid credentials.

## Records

### Create Record
- **Endpoint:** `POST /api/records`
- **Description:** Creates a new record.
- **Request Body:**
  - `title`: string
  - `description`: string
  - `location`: object
    - `latitude`: number
    - `longitude`: number
- **Response:**
  - `201 Created`: Record successfully created.
  - `400 Bad Request`: Validation errors.

### Get Records
- **Endpoint:** `GET /api/records`
- **Description:** Retrieves a list of records.
- **Response:**
  - `200 OK`: Returns an array of records.

### Update Record
- **Endpoint:** `PUT /api/records/:id`
- **Description:** Updates an existing record.
- **Request Body:**
  - `title`: string (optional)
  - `description`: string (optional)
- **Response:**
  - `200 OK`: Record successfully updated.
  - `404 Not Found`: Record not found.

### Delete Record
- **Endpoint:** `DELETE /api/records/:id`
- **Description:** Deletes a record.
- **Response:**
  - `204 No Content`: Record successfully deleted.
  - `404 Not Found`: Record not found.

## Admin

### Get All Users
- **Endpoint:** `GET /api/admin/users`
- **Description:** Retrieves a list of all users.
- **Response:**
  - `200 OK`: Returns an array of users.

### Change Record Status
- **Endpoint:** `PATCH /api/admin/records/:id/status`
- **Description:** Changes the status of a record.
- **Request Body:**
  - `status`: string
- **Response:**
  - `200 OK`: Status successfully updated.
  - `404 Not Found`: Record not found.