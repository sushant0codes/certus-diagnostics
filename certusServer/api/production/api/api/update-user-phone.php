<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Log the received data for debugging
error_log("Update phone API called with data: " . json_encode($input));

// Validate required fields
if (!isset($input['user_id']) || !isset($input['phone_number'])) {
    error_log("Missing required fields - user_id: " . (isset($input['user_id']) ? 'present' : 'missing') . ", phone_number: " . (isset($input['phone_number']) ? 'present' : 'missing'));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'User ID and phone number are required']);
    exit();
}

$user_id = $input['user_id'];
$phone_number = $input['phone_number'];

// Validate phone number format (10 digits)
if (!preg_match('/^[0-9]{10}$/', $phone_number)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Phone number must be exactly 10 digits']);
    exit();
}

try {
    // Database connection - use same config as other APIs
    require_once 'config.php';

    // Check if user exists
    $checkStmt = $pdo->prepare("SELECT patient_id, email, name FROM patients WHERE patient_id = ?");
    $checkStmt->execute([$user_id]);
    $user = $checkStmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit();
    }

    // Update user phone number
    $updateStmt = $pdo->prepare("UPDATE patients SET phone = ? WHERE patient_id = ?");
    $updateStmt->execute([$phone_number, $user_id]);

    if ($updateStmt->rowCount() > 0) {
        // Get updated user data
        $getUserStmt = $pdo->prepare("SELECT patient_id, email, name, phone, google_id, profile_picture, email_verified, created_at FROM patients WHERE patient_id = ?");
        $getUserStmt->execute([$user_id]);
        $updatedUser = $getUserStmt->fetch(PDO::FETCH_ASSOC);

        // Convert boolean fields
        $updatedUser['email_verified'] = (bool) $updatedUser['email_verified'];

        echo json_encode([
            'success' => true,
            'message' => 'Phone number updated successfully',
            'user' => $updatedUser
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update phone number']);
    }

} catch (PDOException $e) {
    error_log("Database error in update-user-phone.php: " . $e->getMessage());
    error_log("SQL State: " . $e->getCode());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database error occurred: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error in update-user-phone.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
}
?>