<?php
// Simplified admin authentication for production deployment

// Handle CORS headers
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
    echo json_encode(array("success" => false, "message" => "Method not allowed. Use POST."));
    exit;
}

try {
    // Get POST data
    $postData = json_decode(file_get_contents("php://input"), true);

    if (!$postData) {
        http_response_code(400);
        echo json_encode(array("success" => false, "message" => "No request data provided"));
        exit;
    }

    // Database connection
    $host = getenv('DB_HOST') ?: "localhost";
    $database_name = getenv('DB_NAME') ?: ""; 
    $username = getenv('DB_USER') ?: "";
    $password = getenv('DB_PASS') ?: "";

    $pdo = new PDO("mysql:host=" . $host . ";dbname=" . $database_name, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Extract Google user data
    $googleData = null;
    
    if (isset($postData['credential'])) {
        // Decode JWT token
        $credential = $postData['credential'];
        $tokenParts = explode('.', $credential);
        
        if (count($tokenParts) === 3) {
            // Decode base64url encoded payload
            $payload = json_decode(base64_decode(strtr($tokenParts[1], '-_', '+/')), true);
            
            if ($payload) {
                $googleData = array(
                    'google_id' => $payload['sub'] ?? null,
                    'email' => $payload['email'] ?? null,
                    'name' => $payload['name'] ?? null,
                    'picture' => $payload['picture'] ?? null
                );
            }
        }
    } else if (isset($postData['admin_data'])) {
        $googleData = $postData['admin_data'];
    }

    if (!$googleData || empty($googleData['email']) || empty($googleData['name'])) {
        echo json_encode(array("success" => false, "message" => "Invalid Google authentication data"));
        exit;
    }

    // Check if admin exists
    $stmt = $pdo->prepare("SELECT * FROM admin WHERE email = ? LIMIT 1");
    $stmt->execute([$googleData['email']]);
    $admin = $stmt->fetch();

    if ($admin) {
        // Update last login
        $updateStmt = $pdo->prepare("UPDATE admin SET last_login = NOW() WHERE admin_id = ?");
        $updateStmt->execute([$admin['admin_id']]);

        echo json_encode(array(
            "success" => true,
            "message" => "Admin login successful",
            "action" => "login",
            "admin" => array(
                "admin_id" => $admin['admin_id'],
                "name" => $admin['name'],
                "email" => $admin['email'],
                "phone" => $admin['phone'],
                "picture" => $admin['profile_picture'],
                "google_id" => $admin['google_id']
            )
        ));
    } else {
        // For now, create admin directly (simplified - remove OTP for production testing)
        $insertStmt = $pdo->prepare("INSERT INTO admin (name, email, google_id, profile_picture) VALUES (?, ?, ?, ?)");
        
        if ($insertStmt->execute([
            $googleData['name'],
            $googleData['email'], 
            $googleData['google_id'],
            $googleData['picture']
        ])) {
            $adminId = $pdo->lastInsertId();
            
            echo json_encode(array(
                "success" => true,
                "message" => "Admin account created and login successful",
                "action" => "created",
                "is_new_admin" => true,
                "admin" => array(
                    "admin_id" => $adminId,
                    "name" => $googleData['name'],
                    "email" => $googleData['email'],
                    "phone" => null,
                    "picture" => $googleData['picture'],
                    "google_id" => $googleData['google_id']
                )
            ));
        } else {
            echo json_encode(array("success" => false, "message" => "Failed to create admin account"));
        }
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("success" => false, "message" => "Server error: " . $e->getMessage()));
}
?>
