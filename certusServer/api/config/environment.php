<?php
/**
 * Environment Configuration for Certus Diagnostics
 * 
 * CHANGE THIS ONE LINE TO SWITCH BETWEEN DEVELOPMENT AND PRODUCTION:
 * Set to 'development' for local testing
 * Set to 'production' for live server
 */

// ⚙️ CHANGE THIS LINE TO SWITCH ENVIRONMENTS ⚙️
define('ENVIRONMENT', getenv('APP_ENV') ?: 'production'); // Set APP_ENV=development for local/Docker use

// Environment-based configuration
if (ENVIRONMENT === 'production') {
    // Production Configuration (Hostinger)
    
    define('BASE_URL', 'https://certusdiagnostics.in');
    define('API_URL', 'https://certusdiagnostics.in/api');
    
    // Automatically detect the correct upload path based on where the API is located
    // If API is at /public_html/api/, uploads go to /public_html/uploads/
    // This works whether api is inside or outside public_html
    $apiDir = dirname(__DIR__); // Gets the api directory
    $publicHtmlDir = dirname($apiDir); // Gets the parent directory (should be public_html)
    
    define('UPLOAD_PATH', $publicHtmlDir . '/uploads');
    define('UPLOAD_URL', 'https://certusdiagnostics.in/uploads');
    
    // Error handling for production
    ini_set('display_errors', 0);
    error_reporting(E_ALL);
    
} else {
    // Development Configuration (XAMPP)
    define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
    define('DB_NAME', getenv('DB_NAME') ?: 'certus_diagnostics');
    define('DB_USER', getenv('DB_USER') ?: 'root');
    define('DB_PASS', getenv('DB_PASS') ?: '');
    
    define('BASE_URL', 'http://localhost/certusServer');
    define('API_URL', 'http://localhost/certusServer/api');
    define('UPLOAD_PATH', dirname(__DIR__, 2) . '/public/uploads');
    define('UPLOAD_URL', 'http://localhost/certusServer/public/uploads');
    
    // Error handling for development
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

// CORS Configuration
$ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://certusdiagnostics.in',
    'https://www.certusdiagnostics.in',
    'https://admin.certusdiagnostics.in'
];

// Email Configuration (same for both)
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);

