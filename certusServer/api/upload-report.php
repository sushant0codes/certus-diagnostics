<?php
// Start output buffering to prevent any HTML errors
ob_start();

// Disable error display to prevent HTML in JSON responses
ini_set('display_errors', 0);
error_reporting(0);

require_once '../models/Report.php';
require_once __DIR__ . '/config/database.php';

// Clear any output that might have been generated
ob_end_clean();
ob_start();

// Set CORS headers - allow both ports
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Check if file was uploaded
    if (!isset($_FILES['report_file']) || $_FILES['report_file']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('No file uploaded or upload error occurred');
    }

    // Check if report_id is provided
    if (!isset($_POST['report_id']) || empty($_POST['report_id'])) {
        throw new Exception('Report ID is required');
    }

    $reportId = $_POST['report_id'];
    $uploadedFile = $_FILES['report_file'];

    // Validate file type (allow PDF, JPG, JPEG, PNG)
    $allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    $fileType = $uploadedFile['type'];

    if (!in_array($fileType, $allowedTypes)) {
        throw new Exception('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed');
    }

    // Validate file size (max 10MB)
    $maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if ($uploadedFile['size'] > $maxSize) {
        throw new Exception('File size too large. Maximum size is 10MB');
    }

    // Generate unique filename using current timestamp in milliseconds
    $timestamp = round(microtime(true) * 1000);
    $fileExtension = pathinfo($uploadedFile['name'], PATHINFO_EXTENSION);
    $newFileName = $timestamp . '_report.' . $fileExtension;

    // Define upload directory - use absolute path
    $uploadDir = __DIR__ . '/../public/uploads/reports/';

    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            throw new Exception('Failed to create upload directory: ' . $uploadDir);
        }
    }

    // Check if directory is writable
    if (!is_writable($uploadDir)) {
        throw new Exception('Upload directory is not writable: ' . $uploadDir);
    }

    $targetPath = $uploadDir . $newFileName;

    // Debug information
    error_log("Attempting to move file from: " . $uploadedFile['tmp_name'] . " to: " . $targetPath);

    // Move uploaded file to target directory
    if (!move_uploaded_file($uploadedFile['tmp_name'], $targetPath)) {
        $error = error_get_last();
        throw new Exception('Failed to move uploaded file. Error: ' . ($error['message'] ?? 'Unknown error') . '. Target: ' . $targetPath);
    }

    // Update database with report location
    $report = new Report();
    $updateData = [
        'report_location' => $newFileName
    ];

    $success = $report->updateReport($reportId, $updateData);

    if (!$success) {
        // If database update fails, remove the uploaded file
        unlink($targetPath);
        throw new Exception('Failed to update report in database');
    }

    // Get patient information for email notification
    $database = new Database();
    $conn = $database->getConnection();
    
    $query = "SELECT r.test_name, p.name, p.email 
              FROM reports r 
              JOIN patients p ON r.patient_id = p.patient_id 
              WHERE r.report_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$reportId]);
    $reportData = $stmt->fetch(PDO::FETCH_ASSOC);

    // Send email notification to patient
    $emailSent = false;
    if ($reportData && $reportData['email']) {
        $emailServicePath = __DIR__ . '/services/PatientEmailService.php';
        
        if (file_exists($emailServicePath)) {
            try {
                require_once $emailServicePath;
                $emailService = new PatientEmailService();
                $emailSent = $emailService->sendReportReadyNotification(
                    $reportData['email'],
                    $reportData['name'],
                    $reportData['test_name'],
                    $reportId
                );
            } catch (Exception $emailError) {
                // Email failed but report was uploaded successfully
                error_log("Email error: " . $emailError->getMessage());
                $emailSent = false;
            }
        }
    }

    // Clear output buffer and return success response
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Report uploaded successfully' . ($emailSent ? ' and patient notified' : ''),
        'filename' => $newFileName,
        'report_id' => $reportId,
        'email_sent' => $emailSent
    ]);

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
exit;