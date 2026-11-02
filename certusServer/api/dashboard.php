<?php
// Dashboard endpoint using DashboardController

// Disable error display to prevent HTML in JSON responses
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

header("Content-Type: application/json");

// Include the DashboardController
require_once __DIR__ . '/controllers/DashboardController.php';

// Create controller instance and handle request
$controller = new DashboardController();
$controller->handleRequest();