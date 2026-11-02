<?php
require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Test basic query
    $query = "SELECT COUNT(*) as total FROM patients";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'totalPatients' => (int) $result['total'],
        'debug' => 'Basic query working'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => 'Exception occurred'
    ]);
}
?>