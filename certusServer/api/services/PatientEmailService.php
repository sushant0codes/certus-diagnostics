<?php
// Patient notification email service
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class PatientEmailService
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
            $this->mail->setFrom('youremail@gmail.com', 'Certus Diagnostics');

        } catch (Exception $e) {
            error_log("Mail configuration error: " . $e->getMessage());
        }
    }

    public function sendTestRegistrationNotification($patientEmail, $patientName, $testName, $cost, $testId)
    {
        try {
            // Recipients
            $this->mail->addAddress($patientEmail, $patientName);

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = 'Test Registration Confirmation - Certus Diagnostics';

            $htmlBody = $this->getTestRegistrationEmailTemplate($patientName, $testName, $cost, $testId);
            $this->mail->Body = $htmlBody;
            $this->mail->AltBody = "Dear $patientName, Your test '$testName' has been registered successfully. Cost: ₹$cost. Test ID: $testId. You will be notified when your report is ready.";

            $result = $this->mail->send();

            // Clear recipients for next use
            $this->mail->clearAddresses();

            return $result;

        } catch (Exception $e) {
            error_log("Test registration email sending failed: " . $e->getMessage());
            return false;
        }
    }

    private function getTestRegistrationEmailTemplate($patientName, $testName, $cost, $testId)
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Test Registration Confirmation</title>
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
                    background: linear-gradient(135deg, #2563eb, #1d4ed8); 
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
                .test-details { 
                    background: #f8fafc; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 8px; 
                    padding: 20px; 
                    margin: 20px 0; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .test-details h3 { 
                    color: #1e40af; 
                    margin: 0 0 15px 0; 
                    font-size: 18px; 
                    font-weight: 600;
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
                .cost-highlight { 
                    background: linear-gradient(135deg, #fef3c7, #fde68a); 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    border-left: 4px solid #f59e0b; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .cost-highlight .amount { 
                    font-size: 28px; 
                    font-weight: 700; 
                    color: #d97706; 
                }
                .notification-box { 
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0); 
                    border: 1px solid #22c55e; 
                    padding: 18px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .notification-box .icon { 
                    color: #16a34a; 
                    font-size: 20px; 
                    margin-right: 8px; 
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    color: #6b7280; 
                    font-size: 12px; 
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                .contact-info { 
                    background: linear-gradient(135deg, #f1f5f9, #e2e8f0); 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    border-left: 4px solid #3b82f6;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .contact-info h4 { 
                    color: #374151; 
                    margin: 0 0 10px 0; 
                    font-weight: 600;
                }
                .logo { 
                    width: 40px; 
                    height: 40px; 
                    background: #ffffff; 
                    border-radius: 50%; 
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin-bottom: 10px;
                    font-size: 20px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Test Registration Confirmed</h1>
                    <p>Certus Diagnostics Laboratory</p>
                </div>
                <div class='content'>
                    <h2 style='color: #1e293b; margin-bottom: 15px;'>Dear " . htmlspecialchars($patientName) . ",</h2>
                    <p style='font-size: 16px; color: #4b5563; margin-bottom: 20px;'>Thank you for choosing Certus Diagnostics. Your diagnostic test has been successfully registered in our system. We are committed to providing you with accurate and timely test results.</p>
                    
                    <div class='test-details'>
                        <h3>Test Details</h3>
                        <div class='detail-row'>
                            <span class='detail-label'>Test ID:</span>
                            <span class='detail-value'>#" . htmlspecialchars($testId) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Test Name:</span>
                            <span class='detail-value'>" . htmlspecialchars($testName) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Patient Name:</span>
                            <span class='detail-value'>" . htmlspecialchars($patientName) . "</span>
                        </div>
                        <div class='detail-row'>
                            <span class='detail-label'>Registration Date:</span>
                            <span class='detail-value'>" . date('d-m-Y H:i') . "</span>
                        </div>
                    </div>
                    
                    <div class='cost-highlight'>
                        <div style='display: flex; justify-content: space-between; align-items: center;'>
                            <span style='font-size: 16px; color: #92400e;'>Total Cost:</span>
                            <span class='amount'>Rs. " . number_format($cost) . "</span>
                        </div>
                    </div>
                    
                    <div class='notification-box'>
                        <div style='display: flex; align-items: center;'>
                            
                            <div>
                                <strong>Report Notification</strong><br>
                                <span style='color: #16a34a;'>You will be notified via email once your test report is ready for collection.</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class='contact-info'>
                        <h4>📞 Contact Information</h4>
                        <p style='margin: 5px 0; color: #6b7280;'>
                            <strong>Phone:</strong> +91-8198074000<br>
                            <strong>Email:</strong> diagnosticscertus@gmail.com<br>
                            <strong>Address:</strong> Certus Diagnostics Laboratory<br>
                            <strong>Website:</strong> www.certusdiagnostics.in
                        </p>
                    </div>
                    
                    <p style='margin-top: 30px; color: #6b7280;'>
                        For any queries regarding your test, please contact us with your Test ID <strong>#" . htmlspecialchars($testId) . "</strong>.
                    </p>
                    
                    <p style='color: #374151;'>
                        Thank you for trusting Certus Diagnostics with your healthcare needs.
                    </p>
                </div>
                <div class='footer'>
                    <p><strong>© 2025 Certus Diagnostics Laboratory. All rights reserved.</strong></p>
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>For support, contact us at <strong>diagnosticscertus@gmail.com</strong> or <strong>+91-8198074000</strong></p>
                </div>
            </div>
        </body>
        </html>";
    }

    public function sendReportReadyNotification($patientEmail, $patientName, $testName, $testId, $reportFilename)
    {
        try {
            // Recipients
            $this->mail->addAddress($patientEmail, $patientName);

            // Content
            $this->mail->isHTML(true);
            $this->mail->Subject = 'Test Report Ready - Certus Diagnostics';

            $htmlBody = $this->getReportReadyEmailTemplate($patientName, $testName, $testId, $reportFilename);
            $this->mail->Body = $htmlBody;
            $this->mail->AltBody = "Dear $patientName, Your test report for '$testName' (Test ID: $testId) is now ready for download. Visit: https://certusdiagnostics.in/uploads/reports/$reportFilename";

            $result = $this->mail->send();

            // Clear recipients for next use
            $this->mail->clearAddresses();

            return $result;

        } catch (Exception $e) {
            error_log("Report ready email sending failed: " . $e->getMessage());
            return false;
        }
    }

    private function getReportReadyEmailTemplate($patientName, $testName, $testId, $reportFilename)
    {
        $downloadUrl = "https://certusdiagnostics.in/uploads/reports/" . urlencode($reportFilename);

        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Test Report Ready</title>
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
                    background: linear-gradient(135deg, #16a34a, #15803d); 
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
                .ready-box { 
                    background: linear-gradient(135deg, #dcfce7, #bbf7d0); 
                    border: 1px solid #22c55e; 
                    padding: 25px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    text-align: center; 
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .footer { 
                    text-align: center; 
                    margin-top: 30px; 
                    color: #6b7280; 
                    font-size: 12px; 
                    padding-top: 20px;
                    border-top: 1px solid #e5e7eb;
                }
                .logo { 
                    width: 40px; 
                    height: 40px; 
                    background: #ffffff; 
                    border-radius: 50%; 
                    display: inline-flex; 
                    align-items: center; 
                    justify-content: center; 
                    margin-bottom: 10px;
                    font-size: 20px;
                }
                .contact-info { 
                    background: linear-gradient(135deg, #f1f5f9, #e2e8f0); 
                    padding: 20px; 
                    border-radius: 8px; 
                    margin: 20px 0; 
                    border-left: 4px solid #16a34a;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .download-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #16a34a, #15803d);
                    color: white !important;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    margin: 20px 0;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s ease;
                }
                .download-section {
                    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
                    border: 1px solid #3b82f6;
                    padding: 25px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Your Report is Ready!</h1>
                    <p>Certus Diagnostics Laboratory</p>
                </div>
                <div class='content'>
                    <h2 style='color: #1e293b; margin-bottom: 15px;'>Dear " . htmlspecialchars($patientName) . ",</h2>
                    <p style='font-size: 16px; color: #4b5563; margin-bottom: 20px;'>Great news! Your diagnostic test report is now ready for collection. Thank you for choosing Certus Diagnostics for your healthcare needs.</p>
                    
                    <div class='ready-box'>
                        <h3 style='color: #16a34a; margin: 0 0 10px 0;'>Report Details</h3>
                        <p><strong>Test:</strong> " . htmlspecialchars($testName) . "</p>
                        <p><strong>Test ID:</strong> #" . htmlspecialchars($testId) . "</p>
                        <p><strong>Ready Date:</strong> " . date('d-m-Y H:i') . "</p>
                    </div>
                    
                    <div class='download-section'>
                        <h3 style='color: #1e40af; margin: 0 0 15px 0;'> Download Your Report</h3>
                        <p style='margin: 10px 0; color: #4b5563;'>Your digital report is ready for download. Click the button below to access your test results securely.</p>
                        <a href='" . $downloadUrl . "' class='download-button' style='color: white !important;'>
                             Download Report
                        </a>
                        <p style='font-size: 12px; color: #6b7280; margin-top: 15px;'>
                            <em>This link is secure and personalized for your account only.</em>
                        </p>
                    </div>
                    
                    <p style='font-size: 16px; color: #4b5563; margin-top: 20px;'>You can also visit our laboratory to collect your physical report if needed.</p>
                    
                    <div class='contact-info'>
                        <h4>Contact Information</h4>
                        <p style='margin: 5px 0; color: #6b7280;'>
                            <strong>Phone:</strong> +91-8198074000<br>
                            <strong>Email:</strong> diagnosticscertus@gmail.com<br>
                            <strong>Address:</strong> Certus Diagnostics Laboratory<br>
                            <strong>Website:</strong> www.certusdiagnostics.in
                        </p>
                    </div>
                </div>
                <div class='footer'>
                    <p><strong>© 2025 Certus Diagnostics Laboratory. All rights reserved.</strong></p>
                    <p>This is an automated message. Please do not reply to this email.</p>
                    <p>For support, contact us at <strong>diagnosticscertus@gmail.com</strong> or <strong>+91-8198074000</strong></p>
                </div>
            </div>
        </body>
        </html>";
    }
}
?>