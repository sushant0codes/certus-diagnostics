# 🎯 FINAL DEPLOYMENT CHECKLIST

## ✅ Configuration Updates Completed

### Database Configuration
- [x] Updated database.php with Hostinger credentials
- [x] Database host set to localhost (correct for Hostinger)
- [x] Database imported to Hostinger MySQL

### CORS Configuration
- [x] Updated patients.php with production domains
- [x] Updated reports.php with production domains
- [x] Updated admin-google-auth.php with production domains
- [x] Updated tests.php with production domains
- [x] Updated packages.php with production domains
- [x] Updated download-report.php with production domains

### Email Service
- [x] Updated email download URLs to production domain
- [x] Email service configured for Gmail SMTP

### Frontend Configuration
- [x] Created API config files for both projects
- [x] Created environment files (.env, .env.production)
- [x] Created build/deployment script

---

## 🚀 IMMEDIATE NEXT STEPS

### 1. Update Google OAuth Settings
**CRITICAL: Do this BEFORE deploying!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to APIs & Services → Credentials
4. Find your OAuth 2.0 Client ID
5. Add these to **Authorized JavaScript origins**:
   - `https://certusdiagnostics.in`
   - `https://www.certusdiagnostics.in`
   - `https://admin.certusdiagnostics.in`
6. Add these to **Authorized redirect URIs**:
   - `https://admin.certusdiagnostics.in/`
   - `https://certusdiagnostics.in/`

### 2. Build Applications for Production

```bash
# Run the deployment script
cd /Applications/XAMPP/xamppfiles/htdocs/certusServer
chmod +x deploy.sh
./deploy.sh
```

This will:
- Build both frontend applications
- Create production packages
- Generate zip files for upload

### 3. Upload to Hostinger

**File Structure on Hostinger:**
```
public_html/
├── index.html, assets/ (client app files)
├── admin/
│   └── index.html, assets/ (admin app files)
└── api/
    ├── *.php (all API files)
    ├── config/
    ├── controllers/
    ├── models/
    ├── services/
    ├── uploads/
    └── vendor/
```

**Upload Process:**
1. Upload `certus-client.zip` → Extract to `public_html/`
2. Upload `certus-admin.zip` → Extract to `public_html/admin/`
3. Upload `certus-api.zip` → Extract to `public_html/api/`

### 4. Set File Permissions

In Hostinger File Manager or via SSH:
```bash
chmod 755 public_html/api/
chmod 644 public_html/api/*.php
chmod 755 public_html/api/uploads/
chmod 755 public_html/api/uploads/reports/
chmod 755 public_html/api/vendor/
```

### 5. SSL Configuration

1. In Hostinger hPanel → SSL/TLS
2. Enable SSL for both domains:
   - `certusdiagnostics.in`
   - `admin.certusdiagnostics.in`
3. Force HTTPS redirect

---

## 🧪 TESTING CHECKLIST

### Database Connection Test
1. Create test file: `public_html/api/test-connection.php`
```php
<?php
require_once 'config/database.php';
$db = new Database();
$conn = $db->getConnection();
echo $conn ? "✅ Database connected!" : "❌ Database connection failed!";
?>
```

### API Endpoints Test
- [ ] `https://certusdiagnostics.in/api/patients.php`
- [ ] `https://certusdiagnostics.in/api/reports.php`
- [ ] `https://certusdiagnostics.in/api/tests.php`
- [ ] `https://certusdiagnostics.in/api/admin-google-auth.php`

### Frontend Applications Test
- [ ] Client: `https://certusdiagnostics.in`
- [ ] Admin: `https://admin.certusdiagnostics.in`

### Google OAuth Test
- [ ] Admin login works with production domain
- [ ] New admin creation process works
- [ ] OTP email verification works

### Email Service Test
- [ ] Test registration emails sent successfully
- [ ] Report ready emails sent successfully
- [ ] Download links work in emails

---

## 🔧 PRODUCTION ENVIRONMENT VARIABLES

### Update these in your .env.production files:

**Admin Project:**
```env
VITE_API_BASE_URL=https://certusdiagnostics.in/api
VITE_UPLOAD_BASE_URL=https://certusdiagnostics.in/public/uploads
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
```

**Client Project:**
```env
VITE_API_BASE_URL=https://certusdiagnostics.in/api
VITE_UPLOAD_BASE_URL=https://certusdiagnostics.in/public/uploads
VITE_GOOGLE_CLIENT_ID=your-production-google-client-id
```

---

## 🆘 TROUBLESHOOTING

### CORS Issues
- Check that all API files include production domains
- Verify origin headers in browser dev tools

### Database Connection Issues
- Verify credentials in database.php
- Check Hostinger database user permissions

### File Upload Issues
- Check directory permissions (755)
- Verify upload paths exist

### Google OAuth Issues
- Verify authorized origins include HTTPS domains
- Clear browser cache after changes

---

## 📞 FINAL VALIDATION

After deployment, test these workflows:
1. **Patient Registration** → Database entry → Email notification
2. **Report Upload** → File storage → Email notification with download link
3. **Admin Authentication** → Google OAuth → OTP verification
4. **Report Download** → Secure file access via email link

---

**🎉 You're ready to deploy! All configurations have been updated for production use.**

**Need help?** Review the detailed `HOSTINGER_DEPLOYMENT_GUIDE.md` for step-by-step instructions.
