<?php
// Google OAuth endpoint for admin authentication

// Start output buffering to prevent any HTML errors
ob_start();

// Disable error display to prevent HTML in JSON responses
ini_set('display_errors', 0);
error_reporting(0);

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

// Clear any output that might have been generated
ob_end_clean();
ob_start();

header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/models/AdminUser.php';

// Handle GET requests for approval/rejection links
if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (!isset($_GET['action']) || !isset($_GET['token'])) {
        echo "Invalid request";
        exit;
    }

    $action = $_GET['action'];
    $token = $_GET['token'];

    try {
        $database = new Database();
        $db = $database->getConnection();
        $adminUser = new AdminUser($db);

        if ($action === 'approve') {
            $result = $adminUser->approveRequest($token);
            if ($result) {
                echo "
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Admin Approved</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #16a34a, #15803d); }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        h1 { color: #16a34a; margin-bottom: 20px; }
                        p { color: #4b5563; line-height: 1.6; }
                        .icon { font-size: 64px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='icon'>✅</div>
                        <h1>Admin Access Approved!</h1>
                        <p>The admin request has been successfully approved. The user can now log in to the Certus Diagnostics Admin Panel.</p>
                    </div>
                </body>
                </html>";
            } else {
                echo "
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Approval Failed</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #dc2626, #b91c1c); }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        h1 { color: #dc2626; margin-bottom: 20px; }
                        p { color: #4b5563; line-height: 1.6; }
                        .icon { font-size: 64px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='icon'>❌</div>
                        <h1>Approval Failed</h1>
                        <p>The approval link may have expired or the request has already been processed.</p>
                    </div>
                </body>
                </html>";
            }
        } elseif ($action === 'reject') {
            $result = $adminUser->rejectRequest($token);
            if ($result) {
                echo "
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Admin Rejected</title>
                    <style>
                        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: linear-gradient(135deg, #dc2626, #b91c1c); }
                        .container { background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }
                        h1 { color: #dc2626; margin-bottom: 20px; }
                        p { color: #4b5563; line-height: 1.6; }
                        .icon { font-size: 64px; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='icon'>🚫</div>
                        <h1>Admin Access Rejected</h1>
                        <p>The admin request has been rejected. The user will not be able to access the admin panel.</p>
                    </div>
                </body>
                </html>";
            } else {
                echo "Failed to reject request. The link may have expired.";
            }
        } else {
            echo "Invalid action";
        }
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage();
    }
    exit;
}

// Only allow POST requests for login
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(array(
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ));
    exit;
}

require_once __DIR__ . '/controllers/AdminController.php';

try {
    // Get POST data
    $postData = json_decode(file_get_contents("php://input"), true);

    if (!$postData) {
        ob_end_clean();
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

    // Clear output buffer and send clean JSON
    ob_end_clean();
    echo json_encode($response);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ));
}
exit;