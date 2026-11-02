<?php
require_once '../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    // Check patients table structure
    $query = "SHOW COLUMNS FROM patients";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'patients_columns' => $columns,
        'debug' => 'Patients table structure'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug' => 'Exception occurred'
    ]);
}
?>