# 🚀 Certus Diagnostics - Hostinger Deployment Guide

## 📋 Prerequisites
- Hostinger account with web hosting plan
- Domain: `certusdiagnostics.in` (main client)
- Subdomain: `admin.certusdiagnostics.in` (admin panel)
- Access to Hostinger control panel (hPanel)

---

## 🗄️ STEP 1: Database Setup on Hostinger

### 1.1 Create MySQL Database
1. **Login to Hostinger hPanel**
2. **Go to Databases → MySQL Databases**
3. **Create New Database:**
   - Database Name: `u123456789_certus` (Hostinger will add prefix)
   - Note down the exact database name
4. **Create Database User:**
   - Username: `u123456789_certus_admin`
   - Password: Create a strong password (save it securely)
5. **Assign User to Database** with ALL PRIVILEGES

### 1.2 Import Database Schema
1. **Go to Databases → phpMyAdmin**
2. **Select your database** (`u123456789_certus`)
3. **Click "Import" tab**
4. **Upload the file:** `hostinger_database_setup.sql` (created above)
5. **Click "Go" to execute**

### 1.3 Verify Database Setup
```sql
-- Check if all tables are created
SHOW TABLES;

-- Verify sample data
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM tests;
SELECT COUNT(*) FROM admin;
```

---

## 📁 STEP 2: File Upload Preparation

### 2.1 Prepare Backend Files
Create a production config file for Hostinger:

```php
<?php
// config/database_production.php
class Database
{
    private $host = "your-hostinger-mysql-host"; // Usually mysql.hostinger.com or similar
    private $database_name = "u123456789_certus"; // Your actual database name
    private $username = "u123456789_certus_admin"; // Your database username
    private $password = "your-strong-password"; // Your database password
    private $connection;

    public function getConnection()
    {
        $this->connection = null;
        try {
            $this->connection = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            throw $exception;
        }
        return $this->connection;
    }
}
?>
```

### 2.2 Update CORS Configuration
Update all API files to include your production domains:

```php
// Add to all API files
header('Access-Control-Allow-Origin: https://certusdiagnostics.in, https://admin.certusdiagnostics.in');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

---

## 🌐 STEP 3: Domain Configuration

### 3.1 Main Domain Setup (certusdiagnostics.in)
1. **In hPanel → Domains:**
   - Ensure `certusdiagnostics.in` points to `public_html/client`
2. **Create subdirectory:** `public_html/client`
3. **Upload client build files** to this directory

### 3.2 Subdomain Setup (admin.certusdiagnostics.in)
1. **Create Subdomain:**
   - Go to Domains → Subdomains
   - Create: `admin.certusdiagnostics.in`
   - Point to: `public_html/admin`
2. **Create subdirectory:** `public_html/admin`
3. **Upload admin build files** to this directory

### 3.3 API Backend Setup
1. **Create directory:** `public_html/api`
2. **Upload all backend PHP files** from `/certusServer/`

---

## 📤 STEP 4: File Upload Process

### 4.1 Upload Backend API
1. **Compress your certusServer folder**
2. **Upload to:** `public_html/api/`
3. **Extract files**
4. **Set proper permissions:**
   - Folders: 755
   - PHP files: 644
   - Upload directories: 755 (writable)

### 4.2 Build and Upload Client
```bash
# In your client project directory
cd "/Users/rehnooraulakh/Documents/Certus Diagnostics Client/certusdiagnostics"

# Update API endpoints to production
# Edit all API calls to use: https://certusdiagnostics.in/api/

# Build for production
npm run build

# Upload 'dist' folder contents to public_html/client/
```

### 4.3 Build and Upload Admin
```bash
# In your admin project directory
cd "/Users/rehnooraulakh/Documents/Certus Diagnostics Admin"

# Update API endpoints to production
# Edit all API calls to use: https://certusdiagnostics.in/api/

# Build for production
npm run build

# Upload 'dist' folder contents to public_html/admin/
```

---

## ⚙️ STEP 5: Configuration Updates

### 5.1 Update API URLs
**Client Project** - Update all fetch calls:
```javascript
// Change from:
const response = await fetch("http://localhost/certusServer/api/endpoint.php");

// Change to:
const response = await fetch("https://certusdiagnostics.in/api/endpoint.php");
```

**Admin Project** - Same updates for admin API calls.

### 5.2 Email Configuration
Update `PatientEmailService.php`:
```php
// Update SMTP settings for production
private $smtp_host = 'smtp.hostinger.com'; // or your email provider
private $smtp_username = 'noreply@certusdiagnostics.in';
private $smtp_password = 'your-email-password';
```

### 5.3 Google OAuth Configuration
Update Google OAuth settings:
- **Authorized Origins:** 
  - `https://certusdiagnostics.in`
  - `https://admin.certusdiagnostics.in`
- **Redirect URIs:**
  - `https://admin.certusdiagnostics.in/`

---

## 🔒 STEP 6: Security & SSL

### 6.1 SSL Certificate
1. **In hPanel → SSL/TLS:**
2. **Enable SSL** for both domains
3. **Force HTTPS redirect**

### 6.2 File Permissions
```bash
# Set proper permissions (via File Manager or SSH)
chmod 755 public_html/api/
chmod 644 public_html/api/*.php
chmod 755 public_html/api/uploads/
chmod 755 public_html/api/uploads/reports/
```

---

## 🧪 STEP 7: Testing

### 7.1 Test Database Connection
Create a test file: `public_html/api/test-db.php`
```php
<?php
require_once 'config/database_production.php';
$database = new Database();
$conn = $database->getConnection();
if ($conn) {
    echo "✅ Database connection successful!";
    $stmt = $conn->query("SELECT COUNT(*) as count FROM patients");
    $result = $stmt->fetch();
    echo "<br>Patients in database: " . $result['count'];
} else {
    echo "❌ Database connection failed!";
}
?>
```

### 7.2 Test API Endpoints
- Test: `https://certusdiagnostics.in/api/patients.php`
- Test: `https://certusdiagnostics.in/api/tests.php`
- Test admin authentication

### 7.3 Test Frontend Applications
- Client: `https://certusdiagnostics.in`
- Admin: `https://admin.certusdiagnostics.in`

---

## 📝 STEP 8: Final Checklist

- [ ] Database created and populated
- [ ] Backend API uploaded and configured
- [ ] Client application built and uploaded
- [ ] Admin application built and uploaded
- [ ] SSL certificates installed
- [ ] CORS headers updated for production
- [ ] Email service configured
- [ ] Google OAuth configured for production domains
- [ ] File upload directories have proper permissions
- [ ] All API endpoints tested
- [ ] Both applications accessible via domains

---

## 🆘 Common Issues & Solutions

### Database Connection Issues
- Check database credentials in config file
- Verify database host (usually `mysql.hostinger.com`)
- Ensure user has ALL PRIVILEGES

### CORS Issues
- Update CORS headers in all API files
- Include both production domains

### File Upload Issues
- Check directory permissions (755 for directories)
- Ensure upload path exists: `/uploads/reports/`

### Google OAuth Issues
- Update authorized origins in Google Console
- Clear browser cache after domain changes

---

## 📞 Support
If you encounter issues:
1. Check Hostinger error logs in hPanel
2. Use browser developer tools for frontend issues
3. Check PHP error logs for backend issues

---

**Ready to deploy? Start with Step 1! 🚀**
