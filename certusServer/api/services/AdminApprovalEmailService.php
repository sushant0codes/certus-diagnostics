<?php
// Admin approval email service
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
            $this->mail->Username = '';
            $this->mail->Password = '';
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mail->Port = 587;

            // Default sender
            $this->mail->setFrom('', '');

        } catch (Exception $e) {
            error_log("Mail configuration error: " . $e->getMessage());
        }
    }

    public function sendAdminApprovalRequest($requestData, $approvalToken)
    {
        try {
            // Recipients
            $this->mail->addAddress('', '');

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = 'New Admin Access Request - Certus Diagnostics';

            $approvalUrl = "http://localhost/certusServer/api/admin-approval.php?token=" . urlencode($approvalToken) . "&action=approve";
            $rejectUrl = "http://localhost/certusServer/api/admin-approval.php?token=" . urlencode($approvalToken) . "&action=reject";

            $htmlBody = $this->getApprovalEmailTemplate($requestData, $approvalUrl, $rejectUrl);
            $this->mail->Body = $htmlBody;
            $this->mail->AltBody = "New admin access request from {$requestData['name']} ({$requestData['email']}). Approve: {$approvalUrl}";

            $result = $this->mail->send();

            // Clear recipients for next use
            $this->mail->clearAddresses();

            return $result;

        } catch (Exception $e) {
            error_log("Admin approval email sending failed: " . $e->getMessage());
            return false;
        }
    }

    private function getApprovalEmailTemplate($requestData, $approvalUrl, $rejectUrl)
    {
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
                    margin: 0 auto; 
                    padding: 20px; 
                    background-color: #ffffff;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .header { 
                    background: linear-gradient(135deg, #f59e0b, #d97706); 
                    color: white; 
                    padding: 30px; 
                    text-align: center; 
                    border-radius: 10px 10px 0 0; 
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .header h1 { 
                    margin: 0; 
                    font-size: 28px; 
                    font-weight: 600;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                }
                .header p { 
                    margin: 10px 0 0 0; 
                    opacity: 0.95; 
                    font-size: 16px;
                }
                .content { 
                    background: #ffffff; 
                    padding: 30px; 
                    border-radius: 0 0 10px 10px; 
                }
                .alert-box { 
                    background: linear-gradient(135deg, #fef3c7, #fde68a); 
                    border: 2px solid #f59e0b; 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .user-details { 
                    background: #f8fafc; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 8px; 
                    padding: 20px; 
                    margin: 20px 0; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .detail-row { 
                    display: flex; 
                    justify-content: space-between; 
                    padding: 10px 0; 
                    border-bottom: 1px solid #f1f5f9; 
                }
                .detail-row:last-child { 
                    border-bottom: none; 
                }
                .detail-label { 
                    font-weight: 600; 
                    color: #64748b; 
                }
                .detail-value { 
                    color: #1e293b; 
                    font-weight: 500;
                }
                .action-buttons { 
                    display: flex; 
                    gap: 15px; 
                    margin: 30px 0; 
                }
                .btn { 
                    flex: 1; 
                    display: inline-block; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    font-size: 16px; 
                    text-align: center; 
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                    transition: all 0.3s ease;
                }
                .btn-approve { 
                    background: linear-gradient(135deg, #16a34a, #15803d); 
                    color: white !important; 
                }
                .btn-reject { 
                    background: linear-gradient(135deg, #dc2626, #b91c1c); 
                    color: white !important; 
                }
                .profile-pic {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: block;
                    border: 3px solid #e2e8f0;
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    color: #6b7280; 
                    font-size: 12px; 
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                .warning-box {
                    background: linear-gradient(135deg, #fee2e2, #fecaca);
                    border: 2px solid #dc2626;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>🔐 Admin Access Request</h1>
                    <p>Certus Diagnostics Admin Panel</p>
                </div>
                <div class='content'>
                    <div class='alert-box'>
                        <h3 style='color: #d97706; margin: 0 0 10px 0;'>⚠️ Action Required</h3>
                        <p style='margin: 0; color: #92400e;'>Someone has requested admin access to the Certus Diagnostics system.</p>
                    </div>
                    
                    " . ($requestData['profile_pic'] ? "<img src='" . htmlspecialchars($requestData['profile_pic']) . "' alt='Profile' class='profile-pic'>" : "") . "
                    
                    <div class='user-details'>
                        <h3 style='color: #1e40af; margin: 0 0 15px 0;'>Requester Details</h3>
                        <div class='detail-row'>
                            <span class='detail-label'>Name:</span>
                            <span class='detail-value'>" . htmlspecialchars($requestData['name']) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Email:</span>
                            <span class='detail-value'>" . htmlspecialchars($requestData['email']) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Google ID:</span>
                            <span class='detail-value'>" . htmlspecialchars($requestData['google_id']) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Request Time:</span>
                            <span class='detail-value'>" . date('d-m-Y H:i:s') . "</span>
                        </div>
                    </div>
                    
                    <h3 style='color: #374151; margin: 20px 0 10px 0;'>Choose an Action:</h3>
                    
                    <div class='action-buttons'>
                        <a href='" . $approvalUrl . "' class='btn btn-approve'>
                            ✅ Approve Access
                        </a>
                        <a href='" . $rejectUrl . "' class='btn btn-reject'>
                            ❌ Reject Request
                        </a>
                    </div>
                    
                    <div class='warning-box'>
                        <strong style='color: #991b1b;'>⏰ This request will expire in 24 hours</strong>
                        <p style='margin: 5px 0 0 0; color: #7f1d1d; font-size: 14px;'>
                            If no action is taken, the request will be automatically rejected.
                        </p>
                    </div>
                    
                    <p style='color: #6b7280; font-size: 14px; margin-top: 20px;'>
                        If you did not expect this request or don't recognize the person, click the <strong>Reject Request</strong> button immediately.
                    </p>
                </div>
                <div class='footer'>
                    <p><strong>© 2025 Certus Diagnostics Laboratory. All rights reserved.</strong></p>
                    <p>This is an automated security notification.</p>
                    <p><strong>For security concerns, contact: diagnosticscertus@gmail.com</strong></p>
                </div>
            </div>
        </body>
        </html>";
    }
}
