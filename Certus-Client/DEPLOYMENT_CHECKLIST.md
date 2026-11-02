# Deployment Checklist ✅

## Completed Tasks

### 1. ✅ Environment Configuration
- Created `.env.development` with localhost URLs
- Created `.env.production` with production URLs (certusdiagnostics.in)
- Added environment variables to `.gitignore`

### 2. ✅ Centralized API Configuration
- Created `src/config/api.js` with environment-based API URLs
- `API_BASE_URL`: Base URL for all API endpoints
- `UPLOAD_BASE_URL`: Base URL for uploaded files (reports, test images)

### 3. ✅ Updated Client Files (24 files)
All hardcoded `http://localhost/certusServer/api` URLs have been replaced with `${API_BASE_URL}`:

**Authentication & User Management:**
- `src/pages/SignIn.jsx` - Google OAuth authentication
- `src/components/LoginModal.jsx` - First-visit modal
- `api/update-user-phone.php` - Phone number updates

**Reports:**
- `src/pages/YourReports.jsx` - Fetch & download reports
- Uses both `API_BASE_URL` and `UPLOAD_BASE_URL`

**Tests & Packages:**
- `src/components/TestsGrid.jsx` - Display tests and packages
- `src/pages/admin/ManageTests.jsx` - Admin CRUD operations (11 endpoints updated)
- Uses both `API_BASE_URL` and `UPLOAD_BASE_URL` for images

**Reviews:**
- `src/components/client/TestimonialsCarousel.jsx` - Google reviews display

### 4. ✅ Server Configuration Files
**Database Configuration:**
- `certusServer/config/database.php`
  - Auto-detects environment (localhost vs production)
  - Switches database credentials automatically
  - Update production credentials before deployment

**CORS Configuration:**
- `certusServer/config/cors.php`
  - Development: Allows all localhost origins
  - Production: Restricts to certusdiagnostics.in domains
  - Handles preflight OPTIONS requests

### 5. ✅ Updated PHP API Files (12 files)
All files now use centralized CORS configuration instead of hardcoded origins:

1. `api/google-auth.php` - Client Google OAuth
2. `api/admin-google-auth.php` - Admin Google OAuth
3. `api/reports.php` - Report management
4. `api/tests.php` - Test management
5. `api/packages.php` - Package management
6. `api/upload.php` - Test image uploads
7. `api/upload-report.php` - Report PDF uploads
8. `api/download-report.php` - Report downloads
9. `api/patients.php` - Patient management
10. `api/admin.php` - Admin authentication
11. `api/update-user-phone.php` - Phone updates
12. `api/google-reviews.php` - Reviews API
13. `api/notify-report-ready.php` - Email notifications

### 6. ✅ Production .htaccess File
- Created `public/.htaccess` for Hostinger deployment
- React Router support (redirects to index.html)
- Excludes API and uploads paths from rewriting
- Security headers (XSS protection, clickjacking prevention)
- Gzip compression for better performance
- Browser caching for static assets

## Pre-Deployment Checklist

### Before Building:
- [ ] Update Hostinger database credentials in `certusServer/config/database.php`
- [ ] Verify Google OAuth credentials for production domain
- [ ] Test locally with `.env.development` to ensure no breaking changes
- [ ] Check all images and assets are loading correctly

### Building the Client:
```powershell
cd d:\Certus-Diagnostics-main\Certus-Client
npm run build
```
This creates a `dist/` folder with production-ready files.

### Server Setup on Hostinger:
1. Upload `dist/` contents to `public_html/` (root directory)
2. Upload `certusServer/` folder to root (outside public_html)
3. Ensure `.htaccess` from `public/` is in `public_html/`
4. Create MySQL database and update credentials
5. Run SQL migrations (users, reports, tests, packages tables)
6. Create `public/uploads/` folder with write permissions (777)
7. Create `public/uploads/reports/` subfolder

### Post-Deployment Testing:
- [ ] Test Google OAuth login
- [ ] Test guest user access
- [ ] Upload a test report and verify download
- [ ] Check test images display correctly
- [ ] Verify admin panel functionality
- [ ] Test on mobile devices (responsive design)
- [ ] Check browser console for CORS errors

## Environment Variables

### Development (.env.development)
```
VITE_API_BASE_URL=http://localhost/certusServer/api
VITE_UPLOAD_BASE_URL=http://localhost/certusServer/public/uploads
```

### Production (.env.production)
```
VITE_API_BASE_URL=https://certusdiagnostics.in/api
VITE_UPLOAD_BASE_URL=https://certusdiagnostics.in/public/uploads
```

## File Structure on Hostinger

```
/home/username/
├── public_html/                    # React build output
│   ├── index.html
│   ├── .htaccess                   # React Router config
│   ├── assets/                     # JS, CSS, images
│   └── public/
│       └── uploads/                # User uploads (777 permissions)
│           ├── reports/            # PDF reports
│           └── tests/              # Test images
│
├── certusServer/                   # PHP backend
│   ├── api/                        # All API endpoints
│   ├── config/                     # Database & CORS config
│   ├── models/                     # Data models
│   ├── controllers/                # Business logic
│   └── vendor/                     # Composer dependencies
│
└── .env                            # Server environment vars (optional)
```

## Important Notes

1. **API Paths in Production:**
   - Client APIs: `https://certusdiagnostics.in/api/`
   - Uploaded files: `https://certusdiagnostics.in/public/uploads/`

2. **Database:**
   - Update production credentials in `config/database.php`
   - Host detection is automatic based on hostname

3. **CORS:**
   - Automatically restricts to production domain
   - No code changes needed between environments

4. **Security:**
   - Never commit `.env` files to Git
   - Keep database credentials secure
   - Use HTTPS in production

5. **Uploads Folder:**
   - Must have write permissions (chmod 777 or 755)
   - Create subdirectories: `reports/`, `tests/`

## Troubleshooting

### CORS Errors:
- Check `config/cors.php` has correct production domain
- Verify all API files include `require_once '../config/cors.php';`
- Check browser console for specific blocked origins

### 404 Errors on Routes:
- Verify `.htaccess` is in `public_html/`
- Check Apache `mod_rewrite` is enabled
- Ensure `RewriteBase /` is correct

### Database Connection Failed:
- Check credentials in `config/database.php`
- Verify database exists on Hostinger
- Confirm hostname (usually `localhost` on shared hosting)

### Images Not Loading:
- Check `public/uploads/` folder permissions
- Verify `VITE_UPLOAD_BASE_URL` is correct
- Ensure uploaded files weren't excluded from deployment

## Support

For issues or questions:
- Check `HOSTINGER_DEPLOYMENT_GUIDE.md` for detailed setup
- Review browser console for client-side errors
- Check PHP error logs on Hostinger for server errors
