<?php
// Email configuration and utilities for admin authentication
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class AdminEmailService
{
    private $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->configureMailer();
    }

    private function configureMailer()
    {
        try {
            // Server settings
            $this->mail->isSMTP();
            $this->mail->Host = 'smtp.gmail.com';
            $this->mail->SMTPAuth = true;
            $this->mail->Username = ''; // You'll need to configure this
            $this->mail->Password = '';     // You'll need to configure this
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mail->Port = 587;

            // Default sender
            $this->mail->setFrom('', '');

        } catch (Exception $e) {
            error_log("Mail configuration error: " . $e->getMessage());
        }
    }

    public function sendOTP($recipientEmail, $otp, $adminName = '')
    {
        try {
            // Recipients
            $this->mail->addAddress($recipientEmail);

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = 'Admin Access OTP - Certus Diagnostics';

            $htmlBody = $this->getOTPEmailTemplate($otp, $adminName);
            $this->mail->Body = $htmlBody;
            $this->mail->AltBody = "Your OTP for Certus Diagnostics Admin access is: $otp. This OTP will expire in 2 minutes.";

            $result = $this->mail->send();

            // Clear recipients for next use
            $this->mail->clearAddresses();

            return $result;

        } catch (Exception $e) {
            error_log("OTP Email sending failed: " . $e->getMessage());
            return false;
        }
    }

    public function sendApprovalRequest($requestData, $approvalToken)
    {
        try {
            // Recipients - send to super admin
            $this->mail->addAddress('aulakhrehnoor@gmail.com', 'Super Admin');

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = 'New Admin Access Request - Certus Diagnostics';

            $htmlBody = $this->getApprovalEmailTemplate($requestData, $approvalToken);
            $this->mail->Body = $htmlBody;
            $this->mail->AltBody = "New admin access request from {$requestData['name']} ({$requestData['email']})";

            $result = $this->mail->send();

            // Clear recipients for next use
            $this->mail->clearAddresses();

            return $result;

        } catch (Exception $e) {
            error_log("Approval request email sending failed: " . $e->getMessage());
            return false;
        }
    }

    private function getApprovalEmailTemplate($requestData, $approvalToken)
    {
        $approveUrl = "https://certusdiagnostics.in/api/admin-google-auth.php?action=approve&token=" . urlencode($approvalToken);
        $rejectUrl = "https://certusdiagnostics.in/api/admin-google-auth.php?action=reject&token=" . urlencode($approvalToken);
        
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Admin Access Request</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f4f4f4;
                }
                .container { 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }
                .header { 
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    color: white; 
                    padding: 30px; 
                    text-align: center;
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 24px; 
                }
                .content { 
                    padding: 30px;
                }
                .request-box {
                    background: #f9fafb;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }
                .request-detail {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }
                .request-detail:last-child {
                    border-bottom: none;
                }
                .label {
                    font-weight: 600;
                    color: #6b7280;
                }
                .value {
                    color: #1f2937;
                    font-weight: 500;
                }
                .profile-pic {
                    text-align: center;
                    margin: 20px 0;
                }
                .profile-pic img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    border: 3px solid #3b82f6;
                }
                .action-buttons {
                    display: flex;
                    gap: 15px;
                    margin: 30px 0;
                }
                .btn {
                    flex: 1;
                    padding: 15px 30px;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    display: inline-block;
                }
                .btn-approve {
                    background: linear-gradient(135deg, #16a34a, #15803d);
                    color: white !important;
                }
                .btn-reject {
                    background: linear-gradient(135deg, #dc2626, #b91c1c);
                    color: white !important;
                }
                .warning {
                    background: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                    border-radius: 4px;
                    margin: 20px 0;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #6b7280;
                    font-size: 12px;
                    border-top: 1px solid #e5e7eb;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔐 New Admin Access Request</h1>
                    <p>Certus Diagnostics Administration Panel</p>
                </div>
                <div class='content'>
                    <h2 style='color: #1f2937; margin-bottom: 15px;'>Request Details</h2>
                    
                    " . ($requestData['profile_pic'] ? "
                    <div class='profile-pic'>
                        <img src='" . htmlspecialchars($requestData['profile_pic']) . "' alt='Profile Picture'>
                    </div>
                    " : "") . "
                    
                    <div class='request-box'>
                        <div class='request-detail'>
                            <span class='label'>Name:</span>
                            <span class='value'>" . htmlspecialchars($requestData['name']) . "</span>
                        </div>
                        <div class='request-detail'>
                            <span class='label'>Email:</span>
                            <span class='value'>" . htmlspecialchars($requestData['email']) . "</span>
                        </div>
                        <div class='request-detail'>
                            <span class='label'>Google ID:</span>
                            <span class='value'>" . htmlspecialchars($requestData['google_id']) . "</span>
                        </div>
                        <div class='request-detail'>
                            <span class='label'>Request Time:</span>
                            <span class='value'>" . date('d M Y, h:i A') . "</span>
                        </div>
                    </div>
                    
                    <div class='warning'>
                        <strong>⚠️ Action Required:</strong><br>
                        Someone is trying to access the Certus Diagnostics Admin Panel. Please review the details above and approve or reject this request.
                    </div>
                    
                    <h3 style='color: #1f2937;'>Take Action:</h3>
                    <div class='action-buttons'>
                        <a href='$approveUrl' class='btn btn-approve'>✅ Approve Access</a>
                        <a href='$rejectUrl' class='btn btn-reject'>❌ Reject Request</a>
                    </div>
                    
                    <p style='color: #6b7280; font-size: 14px; margin-top: 20px;'>
                        <strong>Note:</strong> This approval link is valid for 24 hours. After approval, the user will be granted admin access to the Certus Diagnostics Admin Panel.
                    </p>
                </div>
                <div class='footer'>
                    <p><strong>© 2025 Certus Diagnostics. All rights reserved.</strong></p>
                    <p>This is an automated message from the Certus Diagnostics Admin System.</p>
                    <p>If you did not expect this request, please contact your system administrator.</p>
                </div>
            </div>
        </body>
        </html>";
    }

    private function getOTPEmailTemplate($otp, $adminName)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Admin Access OTP</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
                .otp-box { background: #3b82f6; color: white; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0; }
                .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 10px 0; }
                .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🛡️ Admin Access Request</h1>
                    <p>Certus Diagnostics Administration Panel</p>
                </div>
                <div class='content'>
                    <h2>New Admin Access Request</h2>
                    <p>Hello,</p>
                    <p>A new admin access request has been made for <strong>" . htmlspecialchars($adminName) . "</strong>.</p>
                    
                    <div class='otp-box'>
                        <p>Your verification code is:</p>
                        <div class='otp-code'>$otp</div>
                    </div>
                    
                    <div class='warning'>
                        <strong>⚠️ Important:</strong>
                        <ul>
                            <li>This OTP will expire in <strong>2 minutes</strong></li>
                            <li>Only use this code if you are expecting admin access</li>
                            <li>Never share this code with anyone</li>
                        </ul>
                    </div>
                    
                    <p>If you did not request admin access, please ignore this email or contact your system administrator.</p>
                </div>
                <div class='footer'>
                    <p>© 2024 Certus Diagnostics. All rights reserved.</p>
                    <p>This is an automated message. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>";
    }

    public function generateOTP($length = 6)
    {
        return str_pad(mt_rand(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    }
}

class AdminOTPManager
{
    private $db;

    public function __construct($database)
    {
        $this->db = $database;
        $this->createOTPTable();
    }

    private function createOTPTable()
    {
        $query = "CREATE TABLE IF NOT EXISTS admin_otp (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(10) NOT NULL,
            google_data TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            used BOOLEAN DEFAULT FALSE,
            INDEX idx_email (email),
            INDEX idx_otp (otp),
            INDEX idx_expires (expires_at)
        )";

        try {
            $this->db->exec($query);
        } catch (PDOException $e) {
            error_log("Failed to create admin_otp table: " . $e->getMessage());
        }
    }

    public function storeOTP($email, $otp, $googleData)
    {
        // Clean up expired OTPs first
        $this->cleanupExpiredOTPs();

        // Invalidate any existing OTPs for this email
        $this->invalidateExistingOTPs($email);

        // Use DATE_ADD with NOW() to ensure consistent timezone
        $query = "INSERT INTO admin_otp (email, otp, google_data, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 120 SECOND))";
        $stmt = $this->db->prepare($query);

        return $stmt->execute([$email, $otp, json_encode($googleData)]);
    }

    public function verifyOTP($email, $otp)
    {
        $query = "SELECT * FROM admin_otp 
                  WHERE email = ? AND otp = ? AND used = FALSE AND expires_at > NOW() 
                  ORDER BY created_at DESC LIMIT 1";

        $stmt = $this->db->prepare($query);
        $stmt->execute([$email, $otp]);
        $otpRecord = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($otpRecord) {
            // Mark OTP as used
            $updateQuery = "UPDATE admin_otp SET used = TRUE WHERE id = ?";
            $updateStmt = $this->db->prepare($updateQuery);
            $updateStmt->execute([$otpRecord['id']]);

            return json_decode($otpRecord['google_data'], true);
        }

        return false;
    }

    private function invalidateExistingOTPs($email)
    {
        $query = "UPDATE admin_otp SET used = TRUE WHERE email = ? AND used = FALSE";
        $stmt = $this->db->prepare($query);
        $stmt->execute([$email]);
    }

    private function cleanupExpiredOTPs()
    {
        $query = "DELETE FROM admin_otp WHERE expires_at < NOW() OR created_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)";
        $this->db->exec($query);
    }
}
?>