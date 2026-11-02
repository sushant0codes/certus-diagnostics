-- Simplified Tests and Packages Database Setup for Certus Diagnostics
-- Updated schema where package images contain all test details
-- No need for connector table since test details are in the package image

USE certus_diagnostics;


-- Create tests table (unchanged)
CREATE TABLE IF NOT EXISTS tests (
    test_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    photo VARCHAR(255),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create simplified packages table
-- The photo will contain all test details, so no need to track individual tests
CREATE TABLE IF NOT EXISTS packages (
    package_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    photo VARCHAR(255),
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample tests
INSERT INTO tests (name, price, photo) VALUES
('Complete Blood Count (CBC)', 299.00, '/1.jpeg'),
('Thyroid Function Test (TSH, T3, T4)', 450.00, '/2.jpeg'),
('Lipid Profile', 350.00, '/3.jpeg'),
('Blood Sugar (Fasting)', 150.00, '/4.jpeg'),
('Liver Function Test (LFT)', 400.00, '/5.jpeg'),
('Kidney Function Test (KFT)', 380.00, '/6.jpeg'),
('Vitamin D3', 800.00, '/7.jpeg'),
('HbA1c (Diabetes)', 250.00, '/1.jpeg');

-- Insert sample packages with images that contain test details
INSERT INTO packages (name, price, photo) VALUES
('Basic Health Checkup', 1200.00, '/package1.jpeg'),
('Comprehensive Health Package', 2500.00, '/package2.jpeg'),
('Diabetes Care Package', 600.00, '/package3.jpeg'),
('Heart Health Package', 1800.00, '/package4.jpeg'),
('Women Health Package', 1600.00, '/package5.jpeg'),
('Senior Citizen Package', 2200.00, '/package6.jpeg');

-- Show the created tables
DESCRIBE tests;
DESCRIBE packages;

-- Show sample data
SELECT 'TESTS:' as table_name;
SELECT * FROM tests;

SELECT 'PACKAGES:' as table_name;
SELECT * FROM packages;
