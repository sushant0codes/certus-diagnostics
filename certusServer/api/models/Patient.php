<?php
// Patient model class
class Patient
{
    private $connection;
    private $table_name = "patients";

    // Patient properties
    public $patient_id;
    public $name;
    public $email;
    public $phone;
    public $dob;
    public $gender;
    public $created_at;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    // Get all patients
    public function getAllPatients()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Get dashboard statistics
    public function getDashboardStats()
    {
        $stats = array();

        // Get total patients count
        $query = "SELECT COUNT(*) as total_patients FROM " . $this->table_name;
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['total_patients'] = $result['total_patients'];

        // Get patients registered today
        $query = "SELECT COUNT(*) as tests_today FROM " . $this->table_name . " WHERE DATE(created_at) = CURDATE()";
        $stmt = $this->connection->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['tests_today'] = $result['tests_today'];

        // Mock data for pending home collections (you can implement this table later)
        $stats['pending_home_collections'] = 8; // This would come from a home_collections table

        return $stats;
    }

    // Get patient by ID
    public function getPatientById($id = null)
    {
        // Use provided parameter or fall back to object property
        $patientId = $id !== null ? $id : $this->patient_id;

        $query = "SELECT * FROM " . $this->table_name . " WHERE patient_id = ? LIMIT 0,1";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $patientId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Set object properties from database row
            $this->patient_id = $row['patient_id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->dob = $row['dob'];
            $this->gender = $row['gender'];
            $this->created_at = $row['created_at'];
            return true;
        }

        return false;
    }

    // Search patients
    public function searchPatients($searchTerm)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE name LIKE ? OR email LIKE ? OR phone LIKE ? OR patient_id LIKE ?
                  ORDER BY created_at DESC";

        $searchParam = "%{$searchTerm}%";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $searchParam);
        $stmt->bindParam(2, $searchParam);
        $stmt->bindParam(3, $searchParam);
        $stmt->bindParam(4, $searchParam);
        $stmt->execute();

        return $stmt;
    }

    // Create patient
    public function createPatient()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, email=:email, 
                      phone=:phone, dob=:dob, gender=:gender";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->dob = htmlspecialchars(strip_tags($this->dob));
        $this->gender = htmlspecialchars(strip_tags($this->gender));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":dob", $this->dob);
        $stmt->bindParam(":gender", $this->gender);

        if ($stmt->execute()) {
            $this->patient_id = $this->connection->lastInsertId();
            return true;
        }

        return false;
    }

    // Update patient
    public function updatePatient()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, email=:email, 
                      phone=:phone, dob=:dob, gender=:gender
                  WHERE patient_id=:patient_id";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->dob = htmlspecialchars(strip_tags($this->dob));
        $this->gender = htmlspecialchars(strip_tags($this->gender));
        $this->patient_id = htmlspecialchars(strip_tags($this->patient_id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":dob", $this->dob);
        $stmt->bindParam(":gender", $this->gender);
        $stmt->bindParam(":patient_id", $this->patient_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete patient
    public function deletePatient()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE patient_id = ?";

        $stmt = $this->connection->prepare($query);

        $this->patient_id = htmlspecialchars(strip_tags($this->patient_id));

        $stmt->bindParam(1, $this->patient_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Validate email format
    public function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }

    // Check if email exists (for updates - exclude current patient)
    public function emailExists($email, $excludeId = null)
    {
        $query = "SELECT patient_id FROM " . $this->table_name . " WHERE email = ?";

        if ($excludeId) {
            $query .= " AND patient_id != ?";
        }

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $email);

        if ($excludeId) {
            $stmt->bindParam(2, $excludeId);
        }

        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            return true;
        }

        return false;
    }
}
?>