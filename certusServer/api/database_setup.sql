-- Certus Diagnostics Database Setup
-- Run this script to create the database and patients table

CREATE DATABASE IF NOT EXISTS certus_diagnostics;
USE certus_diagnostics;

-- Create patients table with your specified fields
CREATE TABLE IF NOT EXISTS patients (
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15) NOT NULL,
    dob DATE,
    gender ENUM('Male', 'Female', 'Other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data for testing
INSERT INTO patients (first_name, last_name, email, phone, dob, gender) VALUES
('John', 'Doe', 'john.doe@email.com', '+1234567890', '1990-05-15', 'Male'),
('Jane', 'Smith', 'jane.smith@email.com', '+1234567891', '1985-08-22', 'Female'),
('Michael', 'Johnson', 'michael.j@email.com', '+1234567892', '1992-12-10', 'Male'),
('Sarah', 'Williams', 'sarah.w@email.com', '+1234567893', '1988-03-08', 'Female'),
('David', 'Brown', 'david.brown@email.com', '+1234567894', '1995-07-25', 'Male');

-- Show the created table structure
DESCRIBE patients;
