<?php
// Script to create admin table
require_once __DIR__ . '/../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $sql = "CREATE TABLE IF NOT EXISTS `admin` (
        `admin_id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(100) NOT NULL,
        `email` varchar(100) NOT NULL UNIQUE,
        `phone` varchar(15) DEFAULT NULL,
        `password` varchar(255) DEFAULT NULL,
        `google_id` varchar(100) DEFAULT NULL UNIQUE,
        `profile_picture` varchar(500) DEFAULT NULL,
        `last_login` timestamp NULL DEFAULT NULL,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`admin_id`),
        UNIQUE KEY `unique_email` (`email`),
        UNIQUE KEY `unique_google_id` (`google_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci";

    $conn->exec($sql);
    echo "Admin table created successfully\n";

    // Insert sample admin
    $insertSql = "INSERT IGNORE INTO `admin` (`name`, `email`, `phone`) VALUES 
                  ('Admin User', 'admin@certusdiagnostics.com', '+1234567890')";

    $conn->exec($insertSql);
    echo "Sample admin user inserted successfully\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>