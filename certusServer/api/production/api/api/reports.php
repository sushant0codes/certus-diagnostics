<?php
// RESTful API endpoint for reports management

// Handle CORS headers dynamically
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://certusdiagnostics.in',
    'https://www.certusdiagnostics.in',
    'https://admin.certusdiagnostics.in'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $request_method = $_SERVER["REQUEST_METHOD"];

    switch ($request_method) {
        case 'GET':
            // Get all reports with patient information
            $query = "SELECT r.*,
                             p.name as patient_name,
                             p.email as patient_email,
                             p.phone as patient_phone,
                             CASE 
                                 WHEN r.report_location IS NOT NULL AND r.report_location != '' THEN 'Completed'
                                 ELSE 'Pending'
                             END as status
                      FROM reports r 
                      JOIN patients p ON r.patient_id = p.patient_id 
                      ORDER BY r.test_date_time DESC";

            $stmt = $conn->prepare($query);
            $stmt->execute();
            $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = array(
                "success" => true,
                "message" => "Reports retrieved successfully",
                "data" => $reports,
                "count" => count($reports)
            );
            http_response_code(200);
            break;

        case 'POST':
            // Create new report
            $data = json_decode(file_get_contents("php://input"));

            if (!$data) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid JSON data"
                );
                http_response_code(400);
                break;
            }

            // First, get patient information for email notification
            $patientQuery = "SELECT name, email FROM patients WHERE patient_id = ?";
            $patientStmt = $conn->prepare($patientQuery);
            $patientStmt->execute([$data->patient_id]);
            $patient = $patientStmt->fetch(PDO::FETCH_ASSOC);

            if (!$patient) {
                $response = array(
                    "success" => false,
                    "message" => "Patient not found"
                );
                http_response_code(404);
                break;
            }

            $query = "INSERT INTO reports (patient_id, test_name, price, test_date_time) 
                      VALUES (?, ?, ?, ?)";

            $stmt = $conn->prepare($query);
            $result = $stmt->execute([
                $data->patient_id,
                $data->test_name,
                $data->price,
                $data->test_date_time ?? date('Y-m-d H:i:s')
            ]);

            if ($result) {
                $reportId = $conn->lastInsertId();

                // Send email notification to patient
                require_once __DIR__ . '/../services/PatientEmailService.php';
                $emailService = new PatientEmailService();

                $emailSent = $emailService->sendTestRegistrationNotification(
                    $patient['email'],
                    $patient['name'],
                    $data->test_name,
                    $data->price,
                    $reportId
                );

                $response = array(
                    "success" => true,
                    "message" => "Test registered successfully" . ($emailSent ? " and notification email sent" : " (email notification failed)"),
                    "data" => array(
                        "id" => $reportId,
                        "email_sent" => $emailSent
                    )
                );
                http_response_code(201);
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Unable to create report"
                );
                http_response_code(400);
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