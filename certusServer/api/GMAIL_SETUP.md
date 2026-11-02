s# Gmail SMTP Configuration for Admin OTP System

## Step 1: Enable Gmail App Password

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/
   - Click "Security" in the left sidebar

2. **Enable 2-Step Verification:**
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the setup process if not already enabled

3. **Generate App Password:**
   - Still in Security settings, click "App passwords"
   - Select "Mail" and "Other (custom name)"
   - Enter "Certus Diagnostics Admin" as the name
   - Copy the generated 16-character password

## Step 2: Update Email Configuration

Edit `/Applications/XAMPP/xamppfiles/htdocs/certusServer/services/AdminEmailService.php`:

Replace these lines:
```php
$this->mail->Username   = 'your-email@gmail.com'; // Your Gmail address
$this->mail->Password   = 'your-app-password';     // The 16-character app password
```

With your actual credentials:
```php
$this->mail->Username   = 'aulakhrehnoor@gmail.com';
$this->mail->Password   = 'YOUR_16_CHAR_APP_PASSWORD';
```

## Step 3: Test the Configuration

Run this test script to verify email sending works:

```bash
curl -X POST http://localhost/certusServer/api/admin-google-auth.php \
-H "Content-Type: application/json" \
-H "Origin: http://localhost:5176" \
-d '{
    "action": "google_login",
    "credential": "fake.test.token"
}'
```

## Security Notes

- ✅ The app password is ONLY for this application
- ✅ OTPs expire in 2 minutes
- ✅ OTPs are single-use only
- ✅ Failed attempts are logged
- ✅ Only aulakhrehnoor@gmail.com receives OTPs

## Current Authentication Flow

1. **User clicks "Sign in with Google"** → Google OAuth verification
2. **Stage 1 Complete:** Google account verified
3. **Stage 2 Check:** Does admin exist in database?
   - **YES:** Direct login ✅  
   - **NO:** Send OTP to aulakhrehnoor@gmail.com 📧
4. **OTP Verification:** Admin enters 6-digit code (2 min timeout)
5. **Success:** New admin account created + logged in ✅

## Files Modified

- ✅ `/services/AdminEmailService.php` - Email & OTP management
- ✅ `/controllers/AdminController.php` - 2-stage authentication
- ✅ `/pages/EnhancedLogin.jsx` - Frontend with OTP modal
- ✅ `App.jsx` - Updated to use enhanced login

## Next Steps

1. Configure Gmail credentials (above)
2. Test the OTP flow
3. Admin panel ready for secure use! 🔒
