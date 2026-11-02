<?php
// Main router for the Certus Diagnostics API
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string from URI
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove base path if exists
$base_path = '/certusServer';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Route the request
try {
    switch (true) {
        // Patient routes - match /api/patients with or without query parameters
        case (preg_match('/^\/api\/patients\/?/', $path)):
            require_once 'api/patients.php';
            break;

        // Test routes - match /api/tests with or without query parameters
        case (preg_match('/^\/api\/tests\/?/', $path)):
            require_once 'api/tests.php';
            break;

        // Package routes - match /api/packages with or without query parameters
        case (preg_match('/^\/api\/packages\/?/', $path)):
            require_once 'api/packages.php';
            break;

        // Upload route for file uploads
        case (preg_match('/^\/api\/upload\/?$/', $path)):
            require_once 'api/upload.php';
            break;

        // Health check route
        case (preg_match('/^\/api\/health\/?$/', $path)):
            $response = array(
                "success" => true,
                "message" => "Certus Diagnostics API is running",
                "timestamp" => date('Y-m-d H:i:s'),
                "version" => "1.0.0"
            );
            http_response_code(200);
            echo json_encode($response);
            break;

        // API documentation route
        case (preg_match('/^\/api\/?$/', $path)):
            $response = array(
                "success" => true,
                "message" => "Certus Diagnostics API",
                "version" => "1.0.0",
                "endpoints" => array(
                    "GET /api/health" => "Health check",
                    "GET /api/patients" => "Get all patients",
                    "GET /api/patients?id={id}" => "Get patient by ID",
                    "GET /api/patients?search={term}" => "Search patients",
                    "POST /api/patients" => "Create new patient",
                    "PATCH /api/patients" => "Update patient",
                    "DELETE /api/patients" => "Delete patient",
                    "GET /api/tests" => "Get all tests",
                    "GET /api/tests?id={id}" => "Get test by ID",
                    "GET /api/tests?search={term}" => "Search tests",
                    "POST /api/tests" => "Create new test",
                    "PATCH /api/tests" => "Update test",
                    "DELETE /api/tests" => "Delete test",
                    "GET /api/packages" => "Get all packages",
                    "GET /api/packages?id={id}" => "Get package by ID",
                    "GET /api/packages?search={term}" => "Search packages",
                    "POST /api/packages" => "Create new package",
                    "PATCH /api/packages" => "Update package",
                    "DELETE /api/packages" => "Delete package",
                    "POST /api/upload" => "Upload image file"
                ),
                "note" => "All endpoints support CORS for frontend at localhost:5173"
            );
            http_response_code(200);
            echo json_encode($response);
            break;

        // Default route - API not found
        default:
            $response = array(
                "success" => false,
                "message" => "API endpoint not found",
                "requested_path" => $path,
                "available_endpoints" => array(
                    "/api",
                    "/api/health",
                    "/api/patients",
                    "/api/tests",
                    "/api/packages",
                    "/api/upload"
                )
            );
            http_response_code(404);
            echo json_encode($response);
            break;
    }

} catch (Exception $e) {
    $response = array(
        "success" => false,
        "message" => "Router error: " . $e->getMessage()
    );
    http_response_code(500);
    echo json_encode($response);
}
?>