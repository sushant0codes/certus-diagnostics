<?php
// Set all CORS headers first
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");         

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

header('Content-Type: application/json');

require_once 'config.php';

function verifyGoogleToken($credential)
{
    // In production, you should verify the Google JWT token
    // For now, we'll decode it directly (not secure for production)
    $parts = explode('.', $credential);
    if (count($parts) !== 3) {
        return false;
    }

    $payload = json_decode(base64_decode($parts[1]), true);
    return $payload;
}

function checkUserExists($email, $pdo)
{
    $stmt = $pdo->prepare("SELECT * FROM patients WHERE email = ?");
    $stmt->execute([$email]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function createNewUser($userData, $pdo)
{
    $stmt = $pdo->prepare("
        INSERT INTO patients (name, email, phone, password, dob, google_id, profile_picture, email_verified, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    ");

    // Set default values for missing fields
    $phone = $userData['phone'] ?? ''; // Use phone from user data if provided, otherwise empty
    $password = password_hash(uniqid(), PASSWORD_DEFAULT); // Random password for Google users
    $dob = null; // Will be updated when user provides it
    $email_verified = $userData['email_verified'] ? 1 : 0;

    $result = $stmt->execute([
        $userData['name'],
        $userData['email'],
        $phone,
        $password,
        $dob,
        $userData['google_id'],
        $userData['picture'] ?? '',
        $email_verified
    ]);

    if ($result) {
        return $pdo->lastInsertId();
    }
    return false;
}

function updateUserLogin($userId, $pdo)
{
    $stmt = $pdo->prepare("UPDATE patients SET last_login = NOW() WHERE patient_id = ?");
    return $stmt->execute([$userId]);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['action']) || $input['action'] !== 'google_login') {
        throw new Exception('Invalid action');
    }

    if (!isset($input['credential'])) {
        throw new Exception('Missing Google credential');
    }

    // Verify Google token
    $tokenData = verifyGoogleToken($input['credential']);
    if (!$tokenData) {
        throw new Exception('Invalid Google token');
    }

    // Extract user data
    $userData = [
        'email' => $tokenData['email'],
        'name' => $tokenData['name'] ?? '',
        'picture' => $tokenData['picture'] ?? '',
        'google_id' => $tokenData['sub'],
        'email_verified' => $tokenData['email_verified'] ?? false,
        'phone' => $input['user_data']['phone'] ?? '' // Get phone from frontend user data
    ];

    // Check if user already exists
    $existingUser = checkUserExists($userData['email'], $pdo);

    if ($existingUser) {
        // User exists - update last login and return user data
        updateUserLogin($existingUser['patient_id'], $pdo);

        // Remove sensitive data
        unset($existingUser['password']);

        echo json_encode([
            'success' => true,
            'is_new_user' => false,
            'message' => 'User logged in successfully',
            'user' => $existingUser
        ]);
    } else {
        // Create new user
        $newUserId = createNewUser($userData, $pdo);

        if ($newUserId) {
            // Fetch the newly created user
            $stmt = $pdo->prepare("SELECT * FROM patients WHERE patient_id = ?");
            $stmt->execute([$newUserId]);
            $newUser = $stmt->fetch(PDO::FETCH_ASSOC);

            // Remove sensitive data
            unset($newUser['password']);

            echo json_encode([
                'success' => true,
                'is_new_user' => true,
                'message' => 'User created and logged in successfully',
                'user' => $newUser
            ]);
        } else {
            throw new Exception('Failed to create new user');
        }
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>