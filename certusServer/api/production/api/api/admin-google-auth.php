<?php
// Google OAuth endpoint for admin authentication

// Handle CORS headers dynamically
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://certusdiagnostics.in',
    'https://www.certusdiagnostics.in',
    'https://admin.certusdiagnostics.in'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(array(
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ));
    exit;
}

require_once __DIR__ . '/../controllers/AdminController.php';

try {
    // Get POST data
    $postData = json_decode(file_get_contents("php://input"), true);

    if (!$postData) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "No request data provided"
        ));
        exit;
    }

    // Use AdminController to handle the authentication
    $controller = new AdminController();
    $response = $controller->handlePost($postData);

    if ($response['success']) {
        http_response_code(200);
    } else {
        http_response_code(400);
    }

    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>