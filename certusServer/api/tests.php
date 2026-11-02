<?php
// RESTful API endpoint for test management

// Disable error display to prevent HTML in JSON responses
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

header("Content-Type: application/json");

require_once __DIR__ . '/controllers/TestController.php';

// Initialize controller
$controller = new TestController();

// Get request method
$request_method = $_SERVER["REQUEST_METHOD"];

try {
    switch ($request_method) {
        case 'GET':
            $response = $controller->handleGet();
            http_response_code(200);
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
                    http_response_code(201);
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

        case 'DELETE':
            // Get DELETE data
            $data = json_decode(file_get_contents("php://input"));

            if (!$data) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid JSON data"
                );
                http_response_code(400);
            } else {
                $response = $controller->handleDelete($data);
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

} catch (Exception $e) {
    $response = array(
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    );
    http_response_code(500);
}

// Return JSON response
echo json_encode($response);
?>