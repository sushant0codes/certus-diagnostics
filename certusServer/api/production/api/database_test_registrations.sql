-- Test Registrations/Bookings Table
-- This table tracks when patients are registered for specific tests

USE certus_diagnostics;

-- Create test_registrations table to track patient test bookings
CREATE TABLE IF NOT EXISTS test_registrations (
    registration_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    test_id INT NOT NULL,
    test_name VARCHAR(100) NOT NULL,
    test_price DECIMAL(10,2) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'sample_collected', 'processing', 'completed', 'cancelled') DEFAULT 'registered',
    report_file VARCHAR(255) NULL,
    notes TEXT NULL,
    registered_by VARCHAR(100) DEFAULT 'admin',
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (test_id) REFERENCES tests(test_id) ON DELETE CASCADE,
    INDEX idx_patient_id (patient_id),
    INDEX idx_test_id (test_id),
    INDEX idx_status (status),
    INDEX idx_registration_date (registration_date)
);

-- Insert some sample test registrations for demonstration
INSERT INTO test_registrations (patient_id, test_id, test_name, test_price, status) VALUES
(1, 1, 'Complete Blood Count (CBC)', 299.00, 'completed'),
(1, 2, 'Thyroid Function Test (TSH, T3, T4)', 450.00, 'processing'),
(2, 3, 'Lipid Profile', 350.00, 'registered'),
(3, 1, 'Complete Blood Count (CBC)', 299.00, 'sample_collected'),
(4, 5, 'Liver Function Test (LFT)', 400.00, 'registered'),
(5, 4, 'Blood Sugar (Fasting)', 150.00, 'completed');

-- Show the created table
DESCRIBE test_registrations;
SELECT * FROM test_registrations;
