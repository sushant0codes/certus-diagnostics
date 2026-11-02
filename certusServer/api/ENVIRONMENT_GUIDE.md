# 🔧 Environment Configuration Guide

## Quick Switch Between Development & Production

**To switch environments, edit ONE LINE in ONE FILE:**

📁 File: `api/config/environment.php`  
📝 Line 11: `define('ENVIRONMENT', 'development');`

```php
// For local development (XAMPP):
define('ENVIRONMENT', 'development');

// For production (Hostinger):
define('ENVIRONMENT', 'production');
```

That's it! All configurations will automatically switch.

---

## What Changes Automatically

### Development Mode (`'development'`)
- ✅ Database: `localhost` / `root` / no password / `certus_diagnostics`
- ✅ URLs: `http://localhost/certusServer`
- ✅ Uploads: `certusServer/public/uploads`
- ✅ CORS: Allows localhost:5173-5176
- ✅ Errors: Displayed on screen (for debugging)

### Production Mode (`'production'`)
- ✅ Database: Hostinger credentials (`u714791045_certus`)
- ✅ URLs: `https://certusdiagnostics.in`
- ✅ Uploads: `/home/u714791045/public_html/uploads`
- ✅ CORS: Restricted to certusdiagnostics.in domains
- ✅ Errors: Hidden from display, logged to file

---

## Configuration Files

### 1️⃣ `config/environment.php` (Main Config)
- **Purpose:** Central configuration for all environment-specific settings
- **Edit:** Only change line 11 to switch environments
- **Contains:** Database credentials, URLs, paths, CORS origins

### 2️⃣ `config/database.php` (Database Class)
- **Purpose:** Database connection handler
- **Edit:** No changes needed (reads from environment.php)
- **Auto-loads:** Credentials based on ENVIRONMENT setting

### 3️⃣ `config/cors.php` (CORS Headers)
- **Purpose:** Cross-Origin Resource Sharing configuration
- **Edit:** No changes needed (reads from environment.php)
- **Auto-loads:** Allowed origins based on ENVIRONMENT setting

---

## Usage in API Files

All your API files automatically use the correct environment:

```php
<?php
// Just include database config as usual
require_once __DIR__ . '/config/database.php';

$database = new Database();
$conn = $database->getConnection();
// Connection uses correct credentials automatically!
?>
```

For CORS, include at the top of API files:

```php
<?php
require_once __DIR__ . '/config/cors.php';
// CORS headers set automatically based on environment!
?>
```

---

## Available Constants

After including `environment.php`, you have access to:

### Database
- `DB_HOST` - Database hostname
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASS` - Database password

### URLs
- `BASE_URL` - Base website URL
- `API_URL` - API endpoint URL
- `UPLOAD_URL` - Public uploads URL

### Paths
- `UPLOAD_PATH` - Server file path for uploads

### Environment
- `ENVIRONMENT` - Current environment ('development' or 'production')

---

## Example: Using in Email Service

```php
<?php
require_once __DIR__ . '/config/environment.php';

class EmailService {
    public function sendEmail($to, $subject, $body) {
        // Use environment-specific URL in email
        $websiteLink = BASE_URL;
        
        // Email body
        $emailBody = "
            Visit our website: $websiteLink
            
            " . $body . "
        ";
        
        // Send email...
    }
}
?>
```

---

## Deployment Workflow

### For Local Development:
1. ✅ Set `ENVIRONMENT` to `'development'`
2. ✅ Work on your code
3. ✅ Test with XAMPP

### For Production Deployment:
1. ✅ Set `ENVIRONMENT` to `'production'`
2. ✅ Test locally with production settings
3. ✅ Upload to Hostinger
4. ✅ Verify everything works

### After Deployment:
1. ✅ Keep production setting on server
2. ✅ Switch back to development locally
3. ✅ Continue development

---

## File Structure

```
certusServer/
├── api/
│   ├── config/
│   │   ├── environment.php    ← EDIT THIS to switch environments
│   │   ├── database.php       ← Auto-uses environment.php
│   │   └── cors.php           ← Auto-uses environment.php
│   ├── google-auth.php
│   ├── reports.php
│   └── tests.php
│   └── ... (all other API files)
```

---

## Troubleshooting

### Issue: Database connection fails
**Solution:** Check credentials in `environment.php` for your selected environment

### Issue: CORS errors
**Solution:** Verify `$ALLOWED_ORIGINS` in `environment.php` includes your frontend URL

### Issue: File uploads fail
**Solution:** Check `UPLOAD_PATH` exists and has write permissions (755 or 777)

### Issue: Changes not taking effect
**Solution:** 
1. Clear browser cache (Ctrl+F5)
2. Restart Apache/XAMPP
3. Check you saved `environment.php` after editing

---

## Best Practices

✅ **DO:**
- Keep production credentials secure
- Test with production settings locally before deployment
- Use version control (git) but exclude `environment.php` or use placeholders

❌ **DON'T:**
- Commit real production credentials to git
- Leave `display_errors` on in production
- Forget to switch environment when deploying

---

## Quick Reference Card

| What | Development | Production |
|------|------------|------------|
| **Setting** | `'development'` | `'production'` |
| **Database** | certus_diagnostics | u714791045_certus |
| **DB User** | root | u714791045_Rehnoor |
| **Base URL** | localhost/certusServer | certusdiagnostics.in |
| **Errors** | Shown | Hidden (logged) |
| **CORS** | All localhost | Specific domains |

---

## Need Help?

If you encounter issues:
1. Check error logs (XAMPP: `xampp/apache/logs/error.log`)
2. Verify database credentials are correct
3. Ensure all files have proper permissions
4. Check PHP version compatibility (7.4+)

---

**Last Updated:** October 21, 2025  
**Version:** 1.0
