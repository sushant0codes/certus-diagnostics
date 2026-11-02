<?php
// Simple CORS test endpoint
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['status' => 'options_ok']);
    exit();
}

echo json_encode([
    'status' => 'success',
    'message' => 'CORS test endpoint working',
    'method' => $_SERVER['REQUEST_METHOD']
]);
?>