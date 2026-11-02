-- =====================================================
-- CERTUS DIAGNOSTICS - COMPLETE DATABASE SETUP
-- For Hostinger Deployment
-- =====================================================

-- Create database (if you have permission, otherwise skip this line)
-- CREATE DATABASE IF NOT EXISTS certus_diagnostics;
-- USE certus_diagnostics;

-- =====================================================
-- 1. PATIENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `patients` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `patient_id` int(11) GENERATED ALWAYS AS (`id`) STORED,
    `first_name` varchar(50) NOT NULL,
    `last_name` varchar(50) NOT NULL,
    `name` varchar(100) GENERATED ALWAYS AS (CONCAT(`first_name`, ' ', `last_name`)) STORED,
    `email` varchar(100) UNIQUE,
    `phone` varchar(15) NOT NULL,
    `dob` date DEFAULT NULL,
    `gender` enum('Male','Female','Other') DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 2. TESTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `tests` (
    `test_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `price` decimal(10,2) NOT NULL,
    `photo` varchar(255) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 3. PACKAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `packages` (
    `package_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `price` decimal(10,2) NOT NULL,
    `photo` varchar(255) DEFAULT NULL,
    `description` text DEFAULT NULL,
    `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`package_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 4. REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `reports` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `patient_id` int(11) NOT NULL,
    `test_name` varchar(100) NOT NULL,
    `price` decimal(10,2) NOT NULL,
    `test_date_time` datetime NOT NULL,
    `report_location` varchar(255) DEFAULT NULL,
    `status` enum('Scheduled','In Progress','Completed','Cancelled') DEFAULT 'Scheduled',
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `fk_patient_id` (`patient_id`),
    CONSTRAINT `fk_patient_id` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 5. ADMIN TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS `admin` (
    `admin_id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL,
    `email` varchar(100) NOT NULL,
    `phone` varchar(15) DEFAULT NULL,
    `password` varchar(255) DEFAULT NULL,
    `google_id` varchar(100) DEFAULT NULL,
    `profile_picture` varchar(500) DEFAULT NULL,
    `last_login` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`admin_id`),
    UNIQUE KEY `unique_email` (`email`),
    UNIQUE KEY `unique_google_id` (`google_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- 6. ADMIN OTP TABLE (for 2-stage authentication)
-- =====================================================
CREATE TABLE IF NOT EXISTS `admin_otp` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(100) NOT NULL,
    `otp_code` varchar(6) NOT NULL,
    `expires_at` datetime NOT NULL,
    `is_used` tinyint(1) DEFAULT 0,
    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_email_otp` (`email`, `otp_code`),
    KEY `idx_expires_at` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample patients
INSERT INTO `patients` (`first_name`, `last_name`, `email`, `phone`, `dob`, `gender`) VALUES
('John', 'Doe', 'john.doe@email.com', '+1234567890', '1990-05-15', 'Male'),
('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', '1985-08-22', 'Female'),
('Michael', 'Johnson', 'michael.j@email.com', '+1234567892', '1992-12-10', 'Male'),
('Sarah', 'Williams', 'sarah.w@email.com', '+1234567893', '1988-03-08', 'Female'),
('David', 'Brown', 'david.brown@email.com', '+1234567894', '1995-07-25', 'Male');

-- Insert sample tests
INSERT INTO `tests` (`name`, `price`, `photo`, `description`) VALUES
('Complete Blood Count (CBC)', 299.00, '/1.jpeg', 'Comprehensive blood analysis including RBC, WBC, platelets'),
('Thyroid Function Test (TSH, T3, T4)', 450.00, '/2.jpeg', 'Complete thyroid hormone evaluation'),
('Lipid Profile', 350.00, '/3.jpeg', 'Cholesterol and triglyceride levels assessment'),
('Blood Sugar (Fasting)', 150.00, '/4.jpeg', 'Fasting glucose levels for diabetes screening'),
('Liver Function Test (LFT)', 400.00, '/5.jpeg', 'Comprehensive liver health assessment'),
('Kidney Function Test (KFT)', 380.00, '/6.jpeg', 'Complete kidney function evaluation'),
('Vitamin D3', 800.00, '/7.jpeg', 'Vitamin D deficiency assessment'),
('HbA1c (Diabetes)', 250.00, '/1.jpeg', 'Long-term blood sugar control indicator');

-- Insert sample packages
INSERT INTO `packages` (`name`, `price`, `photo`, `description`) VALUES
('Basic Health Checkup', 1200.00, '/package1.jpeg', 'Essential health screening package'),
('Comprehensive Health Package', 2500.00, '/package2.jpeg', 'Complete health assessment for all ages'),
('Diabetes Care Package', 600.00, '/package3.jpeg', 'Specialized diabetes monitoring package'),
('Heart Health Package', 1800.00, '/package4.jpeg', 'Cardiovascular health assessment'),
('Women Health Package', 1600.00, '/package5.jpeg', 'Specialized health package for women'),
('Senior Citizen Package', 2200.00, '/package6.jpeg', 'Comprehensive health package for seniors');

-- Insert a default admin user (update with your details)
INSERT INTO `admin` (`name`, `email`, `phone`) VALUES 
('Admin User', 'admin@certusdiagnostics.in', '+91-8198074000');

-- =====================================================
-- VERIFICATION QUERIES (Optional - for testing)
-- =====================================================

-- Show all tables
-- SHOW TABLES;

-- Verify table structures
-- DESCRIBE patients;
-- DESCRIBE tests;
-- DESCRIBE packages;
-- DESCRIBE reports;
-- DESCRIBE admin;
-- DESCRIBE admin_otp;

-- Check sample data
-- SELECT COUNT(*) as patient_count FROM patients;
-- SELECT COUNT(*) as test_count FROM tests;
-- SELECT COUNT(*) as package_count FROM packages;
-- SELECT COUNT(*) as admin_count FROM admin;

-- =====================================================
-- NOTES FOR HOSTINGER SETUP:
-- =====================================================
-- 1. Replace database credentials in config/database.php
-- 2. Update email configuration in PatientEmailService.php
-- 3. Update CORS origins for production domains
-- 4. Set up SSL certificates for HTTPS
-- 5. Configure proper file upload permissions
-- =====================================================
