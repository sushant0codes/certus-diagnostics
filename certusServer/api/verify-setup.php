<?php
// Verify database setup
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/config/environment.php';
require_once __DIR__ . '/config/database.php';

$response = [
    'environment' => ENVIRONMENT,
    'database_config' => [
        'host' => DB_HOST,
        'name' => DB_NAME,
        'user' => DB_USER,
        'pass_set' => !empty(DB_PASS)
    ],
    'connection' => null,
    'tables' => []
];

try {
    // Test database connection
    $database = new Database();
    $pdo = $database->getConnection();
    
    if ($pdo === null) {
        $response['connection'] = 'FAILED';
        $response['error'] = 'Database connection returned null';
    } else {
        $response['connection'] = 'SUCCESS';
        
        // Check what tables exist
        $stmt = $pdo->query("SHOW TABLES");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tableName = $row[0];
            $response['tables'][] = $tableName;
            
            // Get row count for each table
            try {
                $countStmt = $pdo->query("SELECT COUNT(*) FROM `$tableName`");
                $count = $countStmt->fetchColumn();
                $response['table_counts'][$tableName] = $count;
            } catch (Exception $e) {
                $response['table_counts'][$tableName] = 'Error: ' . $e->getMessage();
            }
        }
        
        // Check if patients table exists and has correct structure
        if (in_array('patients', $response['tables'])) {
            $stmt = $pdo->query("DESCRIBE patients");
            $columns = $stmt->fetchAll(PDO::FETCH_COLUMN);
            $response['patients_columns'] = $columns;
        }
    }
    
    $response['success'] = true;
    
} catch (Exception $e) {
    $response['success'] = false;
    $response['error'] = $e->getMessage();
    $response['trace'] = $e->getTraceAsString();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
