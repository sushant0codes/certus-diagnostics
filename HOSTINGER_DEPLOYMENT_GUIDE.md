# HOSTINGER DEPLOYMENT CHECKLIST FOR CERTUS DIAGNOSTICS

## 📋 PRE-DEPLOYMENT CHECKLIST

### 1. **Hostinger Setup**
- [x] Database created on Hostinger
- [ ] Update database credentials in production
- [ ] SSL certificate enabled (HTTPS)
- [ ] Domain configured (certusdiagnostics.in)
- [ ] PHP version set to 8.0 or higher
- [ ] Enable necessary PHP extensions (mysqli, pdo, json, curl)

### 2. **Environment Configuration**

#### **Certus-Client (.env.production)**
Update the following in `.env.production`:
```bash
VITE_API_BASE_URL=https://certusdiagnostics.in/api
VITE_UPLOAD_BASE_URL=https://certusdiagnostics.in/public/uploads
VITE_GOOGLE_CLIENT_ID=your-production-google-oauth-client-id
```

#### **Certus-Server (config/database.php)**
Update database credentials with Hostinger details:
```php
$host = "localhost"; // Or Hostinger's DB host
$dbname = "your_hostinger_db_name";
$username = "your_hostinger_db_user";
$password = "your_hostinger_db_password";
```

### 3. **Google OAuth Configuration**
- [ ] Add production domain to Google OAuth Authorized JavaScript origins:
  - `https://certusdiagnostics.in`
- [ ] Add to Authorized redirect URIs:
  - `https://certusdiagnostics.in`
  - `https://certusdiagnostics.in/sign-in`
- [ ] Update `VITE_GOOGLE_CLIENT_ID` in `.env.production`

### 4. **Code Changes Required**

#### **Create API Configuration File**
File: `Certus-Client/src/config/api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/certusServer/api';
const UPLOAD_BASE_URL = import.meta.env.VITE_UPLOAD_BASE_URL || 'http://localhost/certusServer/public/uploads';

export { API_BASE_URL, UPLOAD_BASE_URL };
```

#### **Update All API Calls**
Replace hardcoded `http://localhost/certusServer` with `API_BASE_URL` in:
- `src/pages/SignIn.jsx`
- `src/pages/YourReports.jsx`
- `src/components/LoginModal.jsx`
- `src/components/TestsGrid.jsx`
- `src/components/client/TestimonialsCarousel.jsx`
- `src/pages/admin/ManageTests.jsx`
- All other files with API calls

### 5. **Server-Side Changes**

#### **Add CORS Headers to All PHP API Files**
Add at the beginning of each PHP file in `certusServer/api/`:
```php
<?php
header("Access-Control-Allow-Origin: *"); // Or specific domain in production
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
```

#### **Update config.php for Production**
File: `certusServer/api/config.php`
```php
<?php
// Detect environment
$isProduction = $_SERVER['HTTP_HOST'] !== 'localhost';

if ($isProduction) {
    // Production database credentials (Hostinger)
    $host = "localhost";
    $dbname = "u123456789_certus"; // Your Hostinger DB name
    $username = "u123456789_certus"; // Your Hostinger DB user
    $password = "YourStrongPassword123"; // Your Hostinger DB password
} else {
    // Development credentials
    $host = "localhost";
    $dbname = "certus_diagnostics";
    $username = "root";
    $password = "";
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    http_response_code(500);
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}
?>
```

### 6. **File Structure on Hostinger**

```
public_html/
├── api/                    # All PHP API files from certusServer/api/
│   ├── config.php
│   ├── google-auth.php
│   ├── reports.php
│   ├── tests.php
│   └── ...
├── public/
│   └── uploads/           # Uploaded files (reports, images)
│       └── reports/
├── assets/                # Built React app assets
├── index.html            # Built React app entry point
└── .htaccess             # Apache configuration
```

### 7. **Build and Deploy Certus-Client**

```bash
# Navigate to Certus-Client directory
cd Certus-Diagnostics-main/Certus-Client

# Install dependencies
npm install

# Build for production
npm run build

# Upload dist/ folder contents to public_html/
```

### 8. **Upload Certus-Server**

Upload these folders to `public_html/`:
- `api/` folder
- `public/uploads/` folder
- `config/` folder
- `controllers/` folder
- `models/` folder

### 9. **Create .htaccess for React Router**

File: `public_html/.htaccess`
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Don't rewrite files or directories
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_URI} !^/api/
  
  # Rewrite everything else to index.html
  RewriteRule ^ index.html [L]
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### 10. **File Permissions on Hostinger**
Set correct permissions via File Manager or FTP:
- `public/uploads/` folder: 755 or 777 (writable)
- `public/uploads/reports/` folder: 755 or 777 (writable)
- PHP files: 644
- Directories: 755

### 11. **Testing Checklist**
- [ ] Test Google OAuth login
- [ ] Test report upload
- [ ] Test report download
- [ ] Test all API endpoints
- [ ] Test on mobile devices
- [ ] Verify HTTPS is working
- [ ] Check browser console for errors
- [ ] Test image uploads
- [ ] Verify database connections

### 12. **Important Security Notes**
- Use strong database passwords
- Never commit `.env` files to Git
- Enable HTTPS/SSL on Hostinger
- Restrict CORS to specific domain in production
- Use environment variables for sensitive data
- Regularly backup database

### 13. **Troubleshooting**
- **500 Error**: Check PHP error logs in Hostinger cPanel
- **CORS Issues**: Verify CORS headers in PHP files
- **Database Connection**: Verify credentials in config.php
- **File Upload Issues**: Check folder permissions (755/777)
- **Routing Issues**: Verify .htaccess is present

---

## 🚀 QUICK DEPLOYMENT STEPS

1. Update `.env.production` with your domain
2. Build React app: `npm run build`
3. Upload `dist/` contents to `public_html/`
4. Upload `certusServer/` files to `public_html/api/`
5. Update `config.php` with Hostinger DB credentials
6. Create `.htaccess` file
7. Set folder permissions
8. Test the site!

---

## 📞 Support
If you encounter issues, check Hostinger's PHP error logs in cPanel.
