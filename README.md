# JWT Authentication Service

A secure, production-ready authentication service built with Flask and JWT tokens. Features user registration, login, profile management, and role-based access control.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with refresh tokens
- **Password Security**: Bcrypt hashing with strength validation
- **Email Validation**: RFC-compliant email format validation
- **User Management**: Registration, login, profile updates
- **Role-Based Access**: Admin and user role separation
- **Account Security**: Active/inactive user states
- **Database Integration**: SQLAlchemy ORM with SQLite/PostgreSQL support
- **Error Handling**: Comprehensive validation and error responses

## 📋 Prerequisites

- Python 3.8+
- pip package manager
- SQLite (default) or PostgreSQL

## ⚡ Quick Start

### 1. Clone Repository
git clone https://github.com/yourusername/jwt-auth-service.git

cd jwt-auth-service

### 2. Environment Setup
Create virtual environment

python -m venv venv

Activate virtual environment

Windows:

venv\Scripts\activate

macOS/Linux:

source venv/bin/activate

Install dependencies

pip install -r requirements.txt

### 3. Configuration
Copy environment template

cp .env.example .env

Edit .env file with your settings

JWT_SECRET_KEY=your-super-secret-jwt-key-here

DATABASE_URL=sqlite:///auth.db

### 4. Database Setup
python -c "from app import app, db; app.app_context().push(); db.create_all()"

### 5. Run Application

Server runs on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

#### Register User
POST /auth/register

Content-Type: application/json

{

"email": "user@example.com",

"password": "SecurePass123",

"first_name": "John",

"last_name": "Doe"

}


**Response (201):**
{

"message": "User registered successfully",

"user": {

"id": 1,

"email": "user@example.com",

"first_name": "John",

"last_name": "Doe",

"is_active": true,

"created_at": "2024-01-15T10:30:00"

}


}
code

### Protected Routes

#### Get Profile

GET /auth/profile

Authorization: Bearer <your_jwt_token>
code

#### Update Profile

PUT /auth/profile

Authorization: Bearer <your_jwt_token>

Content-Type: application/json

{

"first_name": "Jane",

"last_name": "Smith"

}
code

#### Change Password

POST /auth/change-password

Authorization: Bearer <your_jwt_token>

Content-Type: application/json

{

"current_password": "SecurePass123",

"new_password": "NewSecurePass456"

}
code

## 🛡️ Security Features

### Password Requirements

- Minimum 8 characters

- At least one uppercase letter

- At least one lowercase letter

- At least one digit

- Bcrypt hashing with salt

### JWT Security

- 24-hour token expiration

- Secure secret key

- Token validation on protected routes

### Input Validation

- Email format validation

- Password strength checking

- SQL injection prevention

- XSS protection

## 🏗️ Project Structure

jwt-auth-service/

├── app.py # Main application file

├── models.py # Database models

├── auth.py # Authentication utilities

├── config.py # Configuration settings

├── requirements.txt # Python dependencies

├── .env.example # Environment template

├── .gitignore # Git ignore rules

└── README.md # Project documentation
