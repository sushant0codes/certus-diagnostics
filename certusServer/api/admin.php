<?php
// RESTful API endpoint for admin authentication and management

// Handle CORS headers dynamically
// Disable error display to prevent HTML in JSON responses
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../controllers/AdminController.php';

try {
    $controller = new AdminController();
    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($request_method) {
        case 'GET':
            $response = $controller->handleGet();
            if ($response['success']) {
                http_response_code(200);
            } else {
                http_response_code(400);
            }
            break;

        case 'POST':
            // Get POST data
            $data = json_decode(file_get_contents("php://input"));

            if (!$data) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid JSON data"
                );
                http_response_code(400);
            } else {
                $response = $controller->handlePost($data);
                if ($response['success']) {
                    http_response_code(200);
                } else {
                    http_response_code(400);
                }
            }
            break;

        case 'PATCH':
            // Get PATCH data
            $data = json_decode(file_get_contents("php://input"));

            if (!$data) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid JSON data"
                );
                http_response_code(400);
            } else {
                $response = $controller->handlePatch($data);
                if ($response['success']) {
                    http_response_code(200);
                } else {
                    http_response_code(400);
                }
            }
            break;

        default:
            $response = array(
                "success" => false,
                "message" => "Method not allowed"
            );
            http_response_code(405);
            break;
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