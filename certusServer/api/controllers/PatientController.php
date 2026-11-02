<?php
// Patient controller class
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Patient.php';

class PatientController
{
    private $database;
    private $db;
    private $patient;

    public function __construct()
    {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        
        // Check if database connection was successful
        if ($this->db === null) {
            throw new Exception('Database connection failed');
        }
        
        $this->patient = new Patient($this->db);
    }

    // Handle GET requests
    public function handleGet()
    {
        if (isset($_GET['id'])) {
            return $this->getPatientById($_GET['id']);
        } elseif (isset($_GET['search'])) {
            return $this->searchPatients($_GET['search']);
        } elseif (isset($_GET['stats'])) {
            return $this->getDashboardStats();
        } else {
            return $this->getAllPatients();
        }
    }

    // Get dashboard statistics
    public function getDashboardStats()
    {
        $stats = $this->patient->getDashboardStats();

        return array(
            "success" => true,
            "message" => "Dashboard statistics retrieved successfully",
            "data" => $stats
        );
    }

    // Get all patients
    private function getAllPatients()
    {
        $stmt = $this->patient->getAllPatients();
        $patients = array();
        //for row in stmt, append row to patients
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $patients[] = array(
                "patient_id" => $row['patient_id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "phone" => $row['phone'],
                "dob" => $row['dob'],
                "gender" => $row['gender'],
                "created_at" => $row['created_at']
            );
        }

        return array(
            "success" => true,
            "message" => "Patients retrieved successfully",
            "data" => $patients,
            "count" => count($patients)
        );
    }

    // Get patient by ID
    private function getPatientById($id)
    {
        if ($this->patient->getPatientById($id)) {
            return array(
                "success" => true,
                "message" => "Patient found",
                "data" => array(
                    "patient_id" => $this->patient->patient_id,
                    "name" => $this->patient->name,
                    "email" => $this->patient->email,
                    "phone" => $this->patient->phone,
                    "dob" => $this->patient->dob,
                    "gender" => $this->patient->gender,
                    "created_at" => $this->patient->created_at
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Patient not found"
            );
        }
    }

    // Search patients
    private function searchPatients($searchTerm)
    {
        $stmt = $this->patient->searchPatients($searchTerm);
        $patients = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $patients[] = array(
                "patient_id" => $row['patient_id'],
                "name" => $row['name'],
                "email" => $row['email'],
                "phone" => $row['phone'],
                "dob" => $row['dob'],
                "gender" => $row['gender'],
                "created_at" => $row['created_at']
            );
        }

        return array(
            "success" => true,
            "message" => "Search completed",
            "data" => $patients,
            "count" => count($patients),
            "search_term" => $searchTerm
        );
    }

    // Handle POST requests
    public function handlePost($data)
    {
        // Validate required fields
        if (empty($data->name) || empty($data->phone)) {
            return array(
                "success" => false,
                "message" => "Name and phone are required"
            );
        }

        // Validate email if provided
        if (!empty($data->email) && !$this->patient->isValidEmail($data->email)) {
            return array(
                "success" => false,
                "message" => "Invalid email format"
            );
        }

        // Check if email already exists
        if (!empty($data->email) && $this->patient->emailExists($data->email)) {
            return array(
                "success" => false,
                "message" => "Email already exists"
            );
        }

        // Set patient properties
        $this->patient->name = $data->name;
        $this->patient->email = $data->email ?? null;
        $this->patient->phone = $data->phone;
        $this->patient->dob = $data->dob ?? null;
        $this->patient->gender = $data->gender ?? null;

        if ($this->patient->createPatient()) {
            return array(
                "success" => true,
                "message" => "Patient created successfully",
                "data" => array(
                    "patient_id" => $this->patient->patient_id,
                    "name" => $this->patient->name,
                    "email" => $this->patient->email,
                    "phone" => $this->patient->phone,
                    "dob" => $this->patient->dob,
                    "gender" => $this->patient->gender
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to create patient"
            );
        }
    }

    // Handle PATCH requests
    public function handlePatch($data)
    {
        // Validate required fields
        if (empty($data->patient_id) || empty($data->name) || empty($data->phone)) {
            return array(
                "success" => false,
                "message" => "Patient ID, name, and phone are required"
            );
        }

        // Validate email if provided
        if (!empty($data->email) && !$this->patient->isValidEmail($data->email)) {
            return array(
                "success" => false,
                "message" => "Invalid email format"
            );
        }

        // Check if email already exists (exclude current patient)
        if (!empty($data->email) && $this->patient->emailExists($data->email, $data->patient_id)) {
            return array(
                "success" => false,
                "message" => "Email already exists"
            );
        }

        // Set patient properties
        $this->patient->patient_id = $data->patient_id;
        $this->patient->name = $data->name;
        $this->patient->email = $data->email ?? null;
        $this->patient->phone = $data->phone;
        $this->patient->dob = $data->dob ?? null;
        $this->patient->gender = $data->gender ?? null;

        if ($this->patient->updatePatient()) {
            return array(
                "success" => true,
                "message" => "Patient updated successfully",
                "data" => array(
                    "patient_id" => $this->patient->patient_id,
                    "name" => $this->patient->name,
                    "email" => $this->patient->email,
                    "phone" => $this->patient->phone,
                    "dob" => $this->patient->dob,
                    "gender" => $this->patient->gender
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to update patient"
            );
        }
    }

    // Handle DELETE requests
    public function handleDelete($data)
    {
        if (empty($data->patient_id)) {
            return array(
                "success" => false,
                "message" => "Patient ID is required"
            );
        }

        $this->patient->patient_id = $data->patient_id;

        if ($this->patient->deletePatient()) {
            return array(
                "success" => true,
                "message" => "Patient deleted successfully"
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to delete patient"
            );
        }
    }
}
?>