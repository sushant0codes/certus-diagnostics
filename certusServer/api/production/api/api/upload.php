<?php
// File upload endpoint for medical reports

// Include database configuration
require_once '../config/database.php';

// Handle CORS headers directly for upload endpoint
$allowed_origins = [
    'http://localhost:5173', // Client app
    'http://localhost:5174', // Admin panel
    'http://localhost:5175', // Admin panel
    'http://localhost:5176'  // Admin panel
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure we're handling POST requests only
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Method not allowed. Use POST.'
    ));
    exit;
}

// Check if report_id is provided
if (!isset($_POST['report_id']) || empty($_POST['report_id'])) {
    http_response_code(400);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Report ID is required'
    ));
    exit;
}

$reportId = $_POST['report_id'];

// Set upload directory for reports
$uploadDir = __DIR__ . '/../public/uploads/reports/';

// Create reports directory if it doesn't exist  
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Ensure directory is writable
chmod($uploadDir, 0777);

// Check if file was uploaded
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'No file uploaded or upload error occurred'
    ));
    exit;
}

$file = $_FILES['photo'];

// Validate file type
$allowedTypes = array('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'application/pdf');
$fileType = mime_content_type($file['tmp_name']);

if (!in_array($fileType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Invalid file type. Only JPEG, PNG, GIF, WebP images and PDF files are allowed.'
    ));
    exit;
}

// Validate file size (max 10MB for reports)
$maxSize = 10 * 1024 * 1024; // 10MB in bytes
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'File too large. Maximum size is 10MB.'
    ));
    exit;
}

// Generate unique filename using millisecond timestamp
$timestamp = round(microtime(true) * 1000); // Milliseconds
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = $timestamp . '.' . $extension;
$targetPath = $uploadDir . $filename;

// Move uploaded file to target directory
if (move_uploaded_file($file['tmp_name'], $targetPath)) {
    try {
        // Connect to database
        $database = new Database();
        $db = $database->getConnection();

        // Update report in database with file location and updated_at
        $query = "UPDATE reports SET 
                    report_location = :report_location, 
                    updated_at = NOW() 
                  WHERE report_id = :report_id";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':report_location', $filename);
        $stmt->bindParam(':report_id', $reportId);

        if ($stmt->execute()) {
            // Send "Report Ready" notification to patient
            require_once __DIR__ . '/../services/PatientEmailService.php';

            // Get patient information for notification
            $patientQuery = "SELECT p.name, p.email, r.test_name 
                            FROM reports r 
                            JOIN patients p ON r.patient_id = p.patient_id 
                            WHERE r.report_id = ?";
            $patientStmt = $db->prepare($patientQuery);
            $patientStmt->execute([$reportId]);
            $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

            $emailSent = false;
            if ($patient) {
                $emailService = new PatientEmailService();
                $emailSent = $emailService->sendReportReadyNotification(
                    $patient['email'],
                    $patient['name'],
                    $patient['test_name'],
                    $reportId
                );
            }

            // Return success response
            echo json_encode(array(
                'status' => 'success',
                'message' => 'Report uploaded successfully' . ($emailSent ? ' and patient notified' : ''),
                'filename' => $filename,
                'report_id' => $reportId,
                'url' => 'http://localhost/certusServer/public/uploads/reports/' . $filename,
                'email_sent' => $emailSent
            ));
        } else {
            // If database update fails, remove the uploaded file
            unlink($targetPath);
            http_response_code(500);
            echo json_encode(array(
                'status' => 'error',
                'message' => 'Failed to update database record'
            ));
        }
    } catch (Exception $e) {
        // If database error occurs, remove the uploaded file
        unlink($targetPath);
        http_response_code(500);
        echo json_encode(array(
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ));
    }
} else {
    http_response_code(500);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Failed to move uploaded file'
    ));
}
?>