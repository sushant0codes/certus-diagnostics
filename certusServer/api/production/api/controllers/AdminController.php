<?php
// Admin controller class
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Admin.php';

class AdminController
{
    private $database;
    private $db;
    private $admin;

    public function __construct()
    {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        $this->admin = new Admin($this->db);
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

    // Handle POST requests (2-Stage Google Authentication)
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

        // Handle different actions
        $action = $requestData['action'] ?? 'google_login';

        switch ($action) {
            case 'google_login':
                return $this->handleGoogleLogin($requestData);
            case 'verify_otp':
                return $this->handleOTPVerification($requestData);
            default:
                return array(
                    "success" => false,
                    "message" => "Invalid action"
                );
        }
    }

    private function handleGoogleLogin($requestData)
    {
        // Extract Google data from credential or provided data
        if (isset($requestData['credential'])) {
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

            if (!$payload) {
                return array(
                    "success" => false,
                    "message" => "Failed to decode Google credential"
                );
            }

            $googleData = array(
                'google_id' => $payload['sub'] ?? null,
                'email' => $payload['email'] ?? null,
                'name' => $payload['name'] ?? null,
                'picture' => $payload['picture'] ?? null,
                'email_verified' => $payload['email_verified'] ?? true
            );
        } else {
            // Use provided admin_data
            $googleData = $requestData['admin_data'] ?? null;
        }

        if (!$googleData || empty($googleData['email']) || empty($googleData['name'])) {
            return array(
                "success" => false,
                "message" => "Invalid Google authentication data"
            );
        }

        // Stage 1: Verify Google account is valid (already done by frontend)

        // Stage 2: Check if admin exists in database
        if ($this->admin->getAdminByEmail($googleData['email'])) {
            // Admin exists - log them in
            $this->admin->updateLastLogin();

            return array(
                "success" => true,
                "message" => "Admin login successful",
                "action" => "login",
                "admin" => array(
                    "admin_id" => $this->admin->admin_id,
                    "name" => $this->admin->name,
                    "email" => $this->admin->email,
                    "phone" => $this->admin->phone,
                    "picture" => $this->admin->profile_picture,
                    "google_id" => $this->admin->google_id
                )
            );
        }

        // Admin doesn't exist - initiate OTP process
        require_once __DIR__ . '/../services/AdminEmailService.php';

        $emailService = new AdminEmailService();
        $otpManager = new AdminOTPManager($this->db);

        $otp = $emailService->generateOTP(6);

        // Store OTP with Google data for later verification
        if ($otpManager->storeOTP($googleData['email'], $otp, $googleData)) {
            // Send OTP to authorized email
            $authorizedEmail = 'aulakhrehnoor@gmail.com';

            if ($emailService->sendOTP($authorizedEmail, $otp, $googleData['name'])) {
                return array(
                    "success" => true,
                    "message" => "Admin account not found. OTP sent to authorized administrator.",
                    "action" => "otp_required",
                    "email_sent_to" => $authorizedEmail,
                    "expires_in" => 120 // seconds
                );
            } else {
                return array(
                    "success" => false,
                    "message" => "Failed to send OTP email. Please try again."
                );
            }
        } else {
            return array(
                "success" => false,
                "message" => "Failed to generate OTP. Please try again."
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