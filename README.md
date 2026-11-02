# Certus Diagnostics

A comprehensive diagnostic center management system with separate admin panel, client application, and backend server.

## Project Structure

### 🏥 Certus-Admin
React-based admin panel for managing the diagnostic center operations.
- **Technology**: React + Vite
- **Port**: 5174
- **Features**: Admin dashboard, patient management, test management, settings

### 👥 Certus-Client
React-based client application for patients and general users.
- **Technology**: React + Vite + Tailwind CSS
- **Port**: 5173
- **Features**: Patient portal, test booking, results viewing

### 🖥️ Certus-Server
PHP backend server providing API endpoints and database management.
- **Technology**: PHP + MySQL
- **Port**: 8000 (or via XAMPP)
- **Features**: RESTful API, database operations, file uploads, email notifications

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PHP (v7.4 or higher)
- MySQL database
- XAMPP (recommended for local development)

### Installation

#### 1. Admin Panel
```bash
cd Certus-Admin
npm install
npm run dev
```

#### 2. Client Application
```bash
cd Certus-Client
npm install
npm run dev
```

#### 3. Backend Server
```bash
cd Certus-Server
# If using XAMPP, copy to htdocs folder
# Or run with PHP built-in server:
php -S localhost:8000
```

### Database Setup
1. Import the SQL files from `Certus-Server/database/` directory
2. Configure database connection in `Certus-Server/config/database.php`

## Features

- **Multi-user Authentication**: Separate login systems for admin and clients
- **Patient Management**: Complete patient records and history
- **Test Management**: Diagnostic test scheduling and results
- **Report Generation**: Automated report creation and delivery
- **Google OAuth Integration**: Secure authentication
- **Email Notifications**: Automated email system for reports
- **File Upload System**: Secure document and image handling

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: PHP, MySQL
- **Authentication**: JWT, Google OAuth
- **Email**: PHPMailer
- **File Storage**: Local file system

## License

Private project for Certus Diagnostics.
