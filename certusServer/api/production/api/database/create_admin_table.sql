-- Create admin table for admin panel authentication
CREATE TABLE IF NOT EXISTS `admin` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert a sample admin user (you can modify this)
INSERT INTO `admin` (`name`, `email`, `phone`, `google_id`, `profile_picture`) VALUES 
('Admin User', 'admin@certusdiagnostics.com', '+1234567890', NULL, NULL);
