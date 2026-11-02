<?php
// RESTful API endpoint for reports management

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

require_once __DIR__ . '/config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();
    
    if (!$conn) {
        throw new Exception("Database connection failed");
    }

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
                $emailSent = false;
                $emailServicePath = __DIR__ . '/services/PatientEmailService.php';
                
                if (file_exists($emailServicePath)) {
                    try {
                        require_once $emailServicePath;
                        $emailService = new PatientEmailService();
                        $emailSent = $emailService->sendTestRegistrationNotification(
                            $patient['email'],
                            $patient['name'],
                            $data->test_name,
                            $data->price,
                            $reportId
                        );
                    } catch (Exception $emailError) {
                        // Email failed but test was created successfully
                        error_log("Email error: " . $emailError->getMessage());
                        $emailSent = false;
                    }
                }

                $response = array(
                    "success" => true,
                    "message" => "Test registered successfully" . ($emailSent ? " and notification email sent" : ""),
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

        case 'PATCH':
            // Update report
            $data = json_decode(file_get_contents("php://input"));

            if (!$data || !isset($data->report_id)) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid data. Report ID is required."
                );
                http_response_code(400);
                break;
            }

            $updateFields = [];
            $params = [];

            if (isset($data->test_name)) {
                $updateFields[] = "test_name = ?";
                $params[] = $data->test_name;
            }

            if (isset($data->price)) {
                $updateFields[] = "price = ?";
                $params[] = $data->price;
            }

            if (isset($data->status)) {
                $updateFields[] = "status = ?";
                $params[] = $data->status;
            }

            if (empty($updateFields)) {
                $response = array(
                    "success" => false,
                    "message" => "No fields to update"
                );
                http_response_code(400);
                break;
            }

            $params[] = $data->report_id;
            $query = "UPDATE reports SET " . implode(", ", $updateFields) . " WHERE report_id = ?";

            $stmt = $conn->prepare($query);
            $result = $stmt->execute($params);

            if ($result) {
                $response = array(
                    "success" => true,
                    "message" => "Test updated successfully",
                    "data" => array(
                        "report_id" => $data->report_id
                    )
                );
                http_response_code(200);
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Unable to update test"
                );
                http_response_code(400);
            }
            break;

        case 'DELETE':
            // Delete report
            $data = json_decode(file_get_contents("php://input"));

            if (!$data || !isset($data->report_id)) {
                $response = array(
                    "success" => false,
                    "message" => "Invalid data. Report ID is required."
                );
                http_response_code(400);
                break;
            }

            $query = "DELETE FROM reports WHERE report_id = ?";
            $stmt = $conn->prepare($query);
            $result = $stmt->execute([$data->report_id]);

            if ($result) {
                $response = array(
                    "success" => true,
                    "message" => "Test deleted successfully"
                );
                http_response_code(200);
            } else {
                $response = array(
                    "success" => false,
                    "message" => "Unable to delete test"
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
        "message" => "Server error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    );
    http_response_code(500);
} catch (Error $e) {
    $response = array(
        "success" => false,
        "message" => "Fatal error: " . $e->getMessage(),
        "file" => $e->getFile(),
        "line" => $e->getLine()
    );
    http_response_code(500);
}

// Clear any buffered output and send JSON response
ob_end_clean();
echo json_encode($response);
exit;
