<?php
// File upload endpoint for medical reports

// MUST be first - suppress all errors completely
error_reporting(0);
ini_set('display_errors', '0');
ini_set('display_startup_errors', '0');
ini_set('log_errors', '1');
ini_set('html_errors', '0');

// Start output buffering to catch any errors
ob_start();

// Include environment configuration
require_once __DIR__ . '/config/environment.php';

// Include CORS configuration
require_once __DIR__ . '/config/cors.php';

// Include database configuration
require_once __DIR__ . '/config/database.php';

// Clear any buffered output and start fresh
ob_end_clean();
ob_start();

header("Content-Type: application/json");

// Wrap everything in try-catch to prevent HTML errors
try {
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

    // Set upload directory for reports using environment configuration
    $uploadDir = UPLOAD_PATH . '/reports/';

    // Create reports directory if it doesn't exist  
    if (!file_exists($uploadDir)) {
        if (!@mkdir($uploadDir, 0777, true)) {
            throw new Exception('Failed to create upload directory');
        }
    }

    // Ensure directory is writable
    if (!is_writable($uploadDir)) {
        @chmod($uploadDir, 0777);
    }

    // Check if file was uploaded
    if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $errorMsg = 'No file uploaded';
        if (isset($_FILES['photo']['error'])) {
            switch ($_FILES['photo']['error']) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $errorMsg = 'File too large';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errorMsg = 'No file uploaded';
                    break;
                default:
                    $errorMsg = 'Upload error occurred (code: ' . $_FILES['photo']['error'] . ')';
            }
        }
        http_response_code(400);
        echo json_encode(array(
            'status' => 'error',
            'message' => $errorMsg
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
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception('Failed to move uploaded file. Target: ' . $targetPath . ' | Upload dir writable: ' . (is_writable($uploadDir) ? 'yes' : 'no') . ' | Dir exists: ' . (file_exists($uploadDir) ? 'yes' : 'no'));
    }

    // Verify file was actually saved
    if (!file_exists($targetPath)) {
        throw new Exception('File upload reported success but file does not exist at: ' . $targetPath);
    }

    // Connect to database
    $database = new Database();
    $db = $database->getConnection();
    
    if ($db === null) {
        // Remove uploaded file if database fails
        @unlink($targetPath);
        throw new Exception('Database connection failed');
    }

    // Update report in database with file location and updated_at
    $query = "UPDATE reports SET 
                report_location = :report_location, 
                updated_at = NOW() 
              WHERE report_id = :report_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':report_location', $filename);
    $stmt->bindParam(':report_id', $reportId);

    if (!$stmt->execute()) {
        // If database update fails, remove the uploaded file
        @unlink($targetPath);
        throw new Exception('Failed to update database record');
    }

    // Try to send email notification (don't fail if email fails)
    $emailSent = false;
    try {
        // Check if email service exists before loading
        $emailServicePath = __DIR__ . '/services/PatientEmailService.php';
        if (file_exists($emailServicePath)) {
            @require_once $emailServicePath;
            
            // Get patient information for notification
            $patientQuery = "SELECT p.name, p.email, r.test_name, r.report_location
                            FROM reports r 
                            JOIN patients p ON r.patient_id = p.patient_id 
                            WHERE r.report_id = ?";
            $patientStmt = $db->prepare($patientQuery);
            $patientStmt->execute([$reportId]);
            $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

            if ($patient && !empty($patient['email'])) {
                $emailService = new PatientEmailService();
                $emailSent = $emailService->sendReportReadyNotification(
                    $patient['email'],
                    $patient['name'],
                    $patient['test_name'],
                    $reportId,
                    $patient['report_location']
                );
            }
        }
    } catch (Exception $emailError) {
        // Log email error but don't fail the upload
        error_log("Email notification failed: " . $emailError->getMessage());
    }

    // Return success response
    http_response_code(200);
    
    // Clear any output buffer and send clean JSON
    ob_end_clean();
    echo json_encode(array(
        'status' => 'success',
        'message' => 'Report uploaded successfully' . ($emailSent ? ' and patient notified' : ''),
        'filename' => $filename,
        'report_id' => $reportId,
        'url' => UPLOAD_URL . '/reports/' . $filename,
        'email_sent' => $emailSent
    ));

} catch (Exception $e) {
    // Log the error
    error_log("Upload Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    // Clear any output buffer and send clean JSON
    ob_end_clean();
    http_response_code(500);
    echo json_encode(array(
        'status' => 'error',
        'message' => $e->getMessage(),
        'upload_dir' => UPLOAD_PATH . '/reports/',
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ));
}