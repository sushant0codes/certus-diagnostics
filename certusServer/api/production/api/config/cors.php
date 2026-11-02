<?php
// Production CORS Configuration for Certus Diagnostics
// Include this file in all API endpoints

function setCORSHeaders()
{
    $allowedOrigins = [
        // Development origins
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://localhost:3001',
        'http://localhost:3002',
        // Production origins
        'https://certusdiagnostics.in',
        'https://www.certusdiagnostics.in',
        'https://admin.certusdiagnostics.in'
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    }

    header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>