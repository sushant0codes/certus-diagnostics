<?php
// Handle CORS headers dynamically
require_once __DIR__ . '/config/environment.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/config/cors.php';


if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get report download
        $testId = isset($_GET['test_id']) ? $_GET['test_id'] : '';
        $patientEmail = isset($_GET['patient_email']) ? $_GET['patient_email'] : '';

        if (empty($testId) || empty($patientEmail)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Test ID and patient email are required"
            ]);
            exit();
        }

        // Connect to database
        $database = new Database();
        $db = $database->getConnection();

        // Verify patient owns this report
        $query = "SELECT r.report_location, r.test_name, p.email 
                  FROM reports r 
                  JOIN patients p ON r.patient_id = p.patient_id 
                  WHERE r.report_id = ? AND p.email = ?";
        $stmt = $db->prepare($query);
        $stmt->execute([$testId, $patientEmail]);
        $report = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$report) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Report not found or access denied"
            ]);
            exit();
        }

        if (empty($report['report_location'])) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Report file not available yet"
            ]);
            exit();
        }

        // Serve the file using environment configuration
        $filePath = UPLOAD_PATH . '/reports/' . $report['report_location'];

        if (!file_exists($filePath)) {
            http_response_code(404);
            echo json_encode([
                "success" => false,
                "message" => "Report file not found on server"
            ]);
            exit();
        }

        // Determine content type
        $fileExtension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $contentType = 'application/octet-stream';

        switch ($fileExtension) {
            case 'pdf':
                $contentType = 'application/pdf';
                break;
            case 'jpg':
            case 'jpeg':
                $contentType = 'image/jpeg';
                break;
            case 'png':
                $contentType = 'image/png';
                break;
        }

        // Set headers for file download
        header('Content-Type: ' . $contentType);
        header('Content-Disposition: attachment; filename="' . $report['test_name'] . '_Report_' . $testId . '.' . $fileExtension . '"');
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: must-revalidate');
        header('Pragma: public');

        // Output file
        readfile($filePath);
        exit();

    } else {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
}
?>