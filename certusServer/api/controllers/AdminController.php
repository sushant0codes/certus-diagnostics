<?php
// Admin controller class
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/AdminUser.php';
require_once __DIR__ . '/../services/AdminEmailService.php';

class AdminController
{
    private $database;
    private $db;
    private $adminModel;

    public function __construct()
    {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        $this->adminModel = new AdminUser($this->db);
    }

    // Handle GET requests
    public function handleGet()
    {
        if (isset($_GET['action'])) {
            switch ($_GET['action']) {
                case 'profile':
                    return $this->getAdminProfile($_GET['admin_id'] ?? null);
                default:
                    return array(
                        "success" => false,
                        "message" => "Invalid action"
                    );
            }
        } else {
            return array(
                "success" => false,
                "message" => "No action specified"
            );
        }
    }

    // Get admin profile
    private function getAdminProfile($adminId)
    {
        if (!$adminId) {
            return array(
                "success" => false,
                "message" => "Admin ID is required"
            );
        }

        $query = "SELECT admin_id, name, email, phone, profile_picture, last_login, created_at 
                  FROM admin WHERE admin_id = ?";

        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $adminId);
        $stmt->execute();

        $admin = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($admin) {
            return array(
                "success" => true,
                "message" => "Admin profile retrieved successfully",
                "data" => $admin
            );
        } else {
            return array(
                "success" => false,
                "message" => "Admin not found"
            );
        }
    }

    // Handle POST requests (Google Authentication with Email Approval)
    public function handlePost($data = null)
    {
        // Get request data
        $requestData = $data ?: json_decode(file_get_contents('php://input'), true);

        if (!$requestData) {
            return array(
                "success" => false,
                "message" => "No request data provided"
            );
        }

        // Only handle Google login action
        return $this->handleGoogleLogin($requestData);
    }

    private function handleGoogleLogin($requestData)
    {
        // Extract Google data from credential
        if (!isset($requestData['credential'])) {
            return array(
                "success" => false,
                "message" => "Google credential is required"
            );
        }

        // Decode JWT token to get Google user info
        $credential = $requestData['credential'];
        $tokenParts = explode('.', $credential);

        if (count($tokenParts) !== 3) {
            return array(
                "success" => false,
                "message" => "Invalid Google credential format"
            );
        }

        // Decode base64url encoded payload
        $payload = json_decode($this->base64UrlDecode($tokenParts[1]), true);

        if (!$payload || !isset($payload['email'])) {
            return array(
                "success" => false,
                "message" => "Failed to decode Google credential"
            );
        }

        $googleData = array(
            'google_id' => $payload['sub'] ?? '',
            'email' => $payload['email'] ?? '',
            'name' => $payload['name'] ?? '',
            'profile_pic' => $payload['picture'] ?? ''
        );

        // Check if admin exists by email or Google ID
        $existingAdmin = $this->adminModel->findByEmail($googleData['email']);
        
        if (!$existingAdmin && !empty($googleData['google_id'])) {
            $existingAdmin = $this->adminModel->findByGoogleId($googleData['google_id']);
        }

        if ($existingAdmin) {
            // Admin exists - login directly
            // Update last login and Google ID if not set
            $this->adminModel->updateLastLogin($existingAdmin['admin_id']);
            
            if (empty($existingAdmin['google_id']) && !empty($googleData['google_id'])) {
                $updateQuery = "UPDATE admins SET google_id = ?, profile_pic = ? WHERE admin_id = ?";
                $stmt = $this->db->prepare($updateQuery);
                $stmt->execute([
                    $googleData['google_id'], 
                    $googleData['profile_pic'] ?? $existingAdmin['profile_pic'],
                    $existingAdmin['admin_id']
                ]);
            }

            // Return success with admin data
            return array(
                "success" => true,
                "message" => "Login successful",
                "admin" => array(
                    "admin_id" => $existingAdmin['admin_id'],
                    "name" => $existingAdmin['name'],
                    "email" => $existingAdmin['email'],
                    "profile_pic" => $existingAdmin['profile_pic'] ?? $googleData['profile_pic'],
                    "google_id" => $existingAdmin['google_id']
                )
            );
        }

        // Admin doesn't exist - create approval request and send email
        $approvalToken = bin2hex(random_bytes(32));
        
        $requestCreated = $this->adminModel->createApprovalRequest($googleData, $approvalToken);
        
        if (!$requestCreated) {
            // Check if request already exists
            return array(
                "success" => false,
                "pending" => true,
                "message" => "Your admin access request is already pending approval. Please wait for confirmation from the administrator."
            );
        }

        // Send approval email to super admin (aulakhrehnoor@gmail.com)
        $emailService = new AdminEmailService();
        $emailSent = $emailService->sendApprovalRequest($googleData, $approvalToken);

        if ($emailSent) {
            return array(
                "success" => false,
                "pending" => true,
                "message" => "Admin access request sent for approval. The administrator will review your request and notify you via email."
            );
        } else {
            return array(
                "success" => false,
                "message" => "Failed to send approval request. Please try again later."
            );
        }
    }

    private function handleOTPVerification($requestData)
    {
        $email = $requestData['email'] ?? '';
        $otp = $requestData['otp'] ?? '';

        if (empty($email) || empty($otp)) {
            return array(
                "success" => false,
                "message" => "Email and OTP are required"
            );
        }

        require_once __DIR__ . '/../services/AdminEmailService.php';
        $otpManager = new AdminOTPManager($this->db);

        // Verify OTP and get Google data
        $googleData = $otpManager->verifyOTP($email, $otp);

        if ($googleData) {
            // OTP verified - create new admin account
            $this->admin->name = $googleData['name'];
            $this->admin->email = $googleData['email'];
            $this->admin->google_id = $googleData['google_id'];
            $this->admin->profile_picture = $googleData['picture'];
            $this->admin->phone = null; // Can be updated later

            if ($this->admin->createAdmin()) {
                $this->admin->updateLastLogin();

                return array(
                    "success" => true,
                    "message" => "Admin account created and login successful",
                    "action" => "created",
                    "is_new_admin" => true,
                    "admin" => array(
                        "admin_id" => $this->admin->admin_id,
                        "name" => $this->admin->name,
                        "email" => $this->admin->email,
                        "phone" => $this->admin->phone,
                        "picture" => $this->admin->profile_picture,
                        "google_id" => $this->admin->google_id
                    )
                );
            } else {
                return array(
                    "success" => false,
                    "message" => "Failed to create admin account"
                );
            }
        } else {
            return array(
                "success" => false,
                "message" => "Invalid or expired OTP"
            );
        }
    }

    // Handle PATCH requests (update admin profile)
    public function handlePatch($data)
    {
        // Validate required fields
        if (empty($data->admin_id)) {
            return array(
                "success" => false,
                "message" => "Admin ID is required"
            );
        }

        // Get existing admin
        $query = "SELECT * FROM admin WHERE admin_id = ?";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(1, $data->admin_id);
        $stmt->execute();

        if ($stmt->rowCount() === 0) {
            return array(
                "success" => false,
                "message" => "Admin not found"
            );
        }

        // Update admin properties
        $this->admin->admin_id = $data->admin_id;
        $this->admin->name = $data->name ?? $this->admin->name;
        $this->admin->email = $data->email ?? $this->admin->email;
        $this->admin->phone = $data->phone ?? $this->admin->phone;
        $this->admin->profile_picture = $data->profile_picture ?? $this->admin->profile_picture;

        if ($this->admin->updateAdmin()) {
            return array(
                "success" => true,
                "message" => "Admin profile updated successfully",
                "data" => array(
                    "admin_id" => $this->admin->admin_id,
                    "name" => $this->admin->name,
                    "email" => $this->admin->email,
                    "phone" => $this->admin->phone,
                    "profile_picture" => $this->admin->profile_picture
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Failed to update admin profile"
            );
        }
    }

    // Helper method to decode base64url (used by Google JWT)
    private function base64UrlDecode($data)
    {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $data .= str_repeat('=', $padlen);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
?>