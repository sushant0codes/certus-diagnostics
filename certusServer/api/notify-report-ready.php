<?php
// API endpoint for sending report ready notifications
// Handle CORS headers dynamically
$allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    http_response_code(405);
    echo json_encode(array(
        "success" => false,
        "message" => "Method not allowed. Use POST."
    ));
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../services/PatientEmailService.php';

try {
    // Get POST data
    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->report_id)) {
        http_response_code(400);
        echo json_encode(array(
            "success" => false,
            "message" => "Report ID is required"
        ));
        exit;
    }

    $database = new Database();
    $conn = $database->getConnection();

    // Get report and patient information
    $query = "SELECT r.report_id, r.test_name, p.name as patient_name, p.email as patient_email
              FROM reports r 
              JOIN patients p ON r.patient_id = p.patient_id 
              WHERE r.report_id = ?";

    $stmt = $conn->prepare($query);
    $stmt->execute([$data->report_id]);
    $report = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$report) {
        http_response_code(404);
        echo json_encode(array(
            "success" => false,
            "message" => "Report not found"
        ));
        exit;
    }

    // Send report ready notification
    $emailService = new PatientEmailService();
    $emailSent = $emailService->sendReportReadyNotification(
        $report['patient_email'],
        $report['patient_name'],
        $report['test_name'],
        $report['report_id']
    );

    if ($emailSent) {
        echo json_encode(array(
            "success" => true,
            "message" => "Report ready notification sent successfully",
            "data" => array(
                "report_id" => $report['report_id'],
                "patient_name" => $report['patient_name'],
                "email_sent" => true
            )
        ));
    } else {
        http_response_code(500);
        echo json_encode(array(
            "success" => false,
            "message" => "Failed to send notification email"
        ));
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ));
}
?>