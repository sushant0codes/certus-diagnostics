# Certus Diagnostics API Server

## Overview
This is the backend API server for the Certus Diagnostics patient management system. Built with PHP and MySQL, it provides RESTful endpoints for managing patient data.

## Features
- RESTful API architecture
- CORS support for frontend integration
- Patient CRUD operations
- Search functionality
- Input validation and sanitization
- Error handling and logging

## API Endpoints

### Base URL
```
http://localhost/Certus Diagnostics Server
```

### Endpoints

#### Health Check
- **GET** `/api/health`
- Returns API status and version information

#### Patient Management
- **GET** `/api/patients` - Get all patients
- **GET** `/api/patients?id={id}` - Get patient by ID
- **GET** `/api/patients?search={term}` - Search patients
- **POST** `/api/patients` - Create new patient
- **PUT** `/api/patients` - Update existing patient
- **DELETE** `/api/patients` - Delete patient

### Request/Response Format

#### Create Patient (POST)
```json
{
  "first_name": "John",
  "last_name": "Doe", 
  "email": "john.doe@email.com",
  "phone": "+1234567890",
  "dob": "1990-05-15",
  "gender": "Male"
}
```

#### Update Patient (PUT)
```json
{
  "patient_id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@email.com", 
  "phone": "+1234567890",
  "dob": "1990-05-15",
  "gender": "Male"
}
```

#### Delete Patient (DELETE)
```json
{
  "patient_id": 1
}
```

#### Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {...},
  "count": 10
}
```

## Database Setup

1. Import the database schema:
```sql
mysql -u root -p < database_setup.sql
```

2. Update database credentials in `config/database.php` if needed.

## File Structure

```
Certus Diagnostics Server/
├── api/
│   └── patients.php          # Patient API endpoint
├── config/
│   └── database.php          # Database configuration
├── controllers/
│   └── PatientController.php # Patient business logic
├── models/
│   └── Patient.php           # Patient data model
├── .htaccess                 # Apache rewrite rules
├── index.php                 # Main router
├── database_setup.sql        # Database schema
└── README.md                 # This file
```

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache web server
- XAMPP (recommended for local development)

## Installation

1. Place files in XAMPP htdocs directory
2. Start Apache and MySQL in XAMPP
3. Create database using `database_setup.sql`
4. Update database credentials if needed
5. Test API endpoints

## CORS Configuration

The API is configured to allow requests from:
- `http://localhost:5173` (Vite development server)

To allow additional origins, update the CORS headers in:
- `index.php`
- `api/patients.php`

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 405: Method Not Allowed
- 500: Internal Server Error

## Security Features

- Input sanitization
- SQL injection prevention using PDO
- CORS configuration
- Security headers
- Email validation
- Required field validation
