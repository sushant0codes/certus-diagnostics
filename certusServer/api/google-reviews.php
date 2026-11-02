<?php
// CORS Configuration - Environment based
$allowed_origins = [
    'http://localhost:5173',
    'http://localhost:5174', 
    'https://certusdiagnostics.in',
    'https://www.certusdiagnostics.in'
];

$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Disable PHP error display to prevent HTML in JSON response
ini_set('display_errors', 0);
error_reporting(E_ALL);

try {
    require_once __DIR__ . '/controllers/GoogleReviewController.php';
    
    $controller = new GoogleReviewController();
    $response = array();

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $response = $controller->handleGet();
            break;

        default:
            $response = array(
                "success" => false,
                "message" => "Method not supported"
            );
            break;
    }

    http_response_code(200);
    echo json_encode($response);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Server error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ));
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Fatal error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    ));
}
?>