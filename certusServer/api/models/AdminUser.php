<?php
class AdminUser {
    private $conn;
    private $table = 'admins';
    private $approvalTable = 'admin_approval_requests';

    public function __construct($db = null) {
        if ($db) {
            $this->conn = $db;
        } else {
            require_once __DIR__ . '/../config/database.php';
            $database = new Database();
            $this->conn = $database->getConnection();
        }
    }

    // Find admin by email
    public function findByEmail($email) {
        $query = "SELECT * FROM " . $this->table . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Find admin by Google ID
    public function findByGoogleId($googleId) {
        $query = "SELECT * FROM " . $this->table . " WHERE google_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$googleId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create new admin
    public function create($data) {
        $query = "INSERT INTO " . $this->table . " 
                  (name, email, google_id, profile_pic, last_login) 
                  VALUES (?, ?, ?, ?, NOW())";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'],
            $data['email'],
            $data['google_id'] ?? null,
            $data['profile_pic'] ?? null
        ]);
    }

    // Update last login
    public function updateLastLogin($adminId) {
        $query = "UPDATE " . $this->table . " SET last_login = NOW() WHERE admin_id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$adminId]);
    }

    // Create approval request
    public function createApprovalRequest($data, $token) {
        // Check if request already exists and is pending
        $checkQuery = "SELECT * FROM " . $this->approvalTable . " 
                      WHERE email = ? AND status = 'pending' AND expires_at > NOW()";
        $checkStmt = $this->conn->prepare($checkQuery);
        $checkStmt->execute([$data['email']]);
        
        if ($checkStmt->fetch()) {
            return false; // Request already exists
        }

        // Create new request
        $query = "INSERT INTO " . $this->approvalTable . " 
                  (name, email, google_id, profile_pic, approval_token, expires_at) 
                  VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))";
        
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['name'],
            $data['email'],
            $data['google_id'],
            $data['profile_pic'] ?? null,
            $token
        ]);
    }

    // Get approval request by token
    public function getApprovalRequest($token) {
        $query = "SELECT * FROM " . $this->approvalTable . " 
                  WHERE approval_token = ? AND status = 'pending' AND expires_at > NOW() 
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$token]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Approve admin request
    public function approveRequest($token) {
        // Get request details
        $request = $this->getApprovalRequest($token);
        if (!$request) {
            return false;
        }

        // Create admin user
        $adminData = [
            'name' => $request['name'],
            'email' => $request['email'],
            'google_id' => $request['google_id'],
            'profile_pic' => $request['profile_pic']
        ];
        
        if (!$this->create($adminData)) {
            return false;
        }

        // Update request status
        $query = "UPDATE " . $this->approvalTable . " 
                  SET status = 'approved', approved_at = NOW() 
                  WHERE approval_token = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$token]);
    }

    // Reject admin request
    public function rejectRequest($token) {
        $query = "UPDATE " . $this->approvalTable . " 
                  SET status = 'rejected', approved_at = NOW() 
                  WHERE approval_token = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$token]);
    }
}
