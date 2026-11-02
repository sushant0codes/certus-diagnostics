<?php
// Enable CORS for all requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../controllers/GoogleReviewController.php';

try {
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
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>