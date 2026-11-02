# 🚨 UPLOAD CHECKLIST - Fix 404 Error

## The Problem
The file `index-D1c7jCV_.js` is returning 404 because the `assets/` folder wasn't uploaded to Hostinger.

## ✅ What You Need to Upload to public_html/

### Required Structure on Hostinger:
```
public_html/
├── index.html                          ← Main HTML file
├── .htaccess                           ← IMPORTANT! Don't skip this
├── Logo.jpg                            ← Favicon
├── logo5.png                           ← Company logo
├── assets/                             ← CRITICAL! This folder is missing
│   ├── index-D1c7jCV_.js              ← Main JavaScript bundle
│   └── index-CyIPPMSz.css             ← Main CSS bundle
├── 1.jpeg, 2.jpeg, etc.               ← Other image files
├── aarogyam.jpg
├── agilus.png
└── (all other files from dist/)
```

## 📋 Upload Steps

### Step 1: Prepare Files
All files are ready in:
```
D:\Certus-Diagnostics-main\Certus-Client\dist\
```

### Step 2: Upload to Hostinger

**Option A: Using Hostinger File Manager**
1. Login to Hostinger cPanel
2. Go to **Files → File Manager**
3. Navigate to `public_html/`
4. **Delete old files** (keep database/api folders if separate)
5. Click **Upload** button
6. Select **ALL files and folders** from `dist/` including:
   - ✅ index.html
   - ✅ .htaccess (may be hidden - enable "Show Hidden Files")
   - ✅ assets/ folder (CRITICAL!)
   - ✅ All image files
7. Wait for upload to complete

**Option B: Using FTP (FileZilla/WinSCP)**
1. Connect to your Hostinger FTP
2. Navigate to `public_html/`
3. Delete old files (backup first!)
4. Drag and drop **entire contents** of `dist/` folder
5. Ensure `assets/` folder uploads successfully

### Step 3: Verify Upload

After uploading, check in Hostinger File Manager:
- [ ] `/public_html/index.html` exists
- [ ] `/public_html/.htaccess` exists
- [ ] `/public_html/assets/` folder exists
- [ ] `/public_html/assets/index-D1c7jCV_.js` exists (THIS FILE!)
- [ ] `/public_html/assets/index-CyIPPMSz.css` exists

### Step 4: Test the Site

1. Clear browser cache (Ctrl + F5)
2. Visit https://certusdiagnostics.in
3. Open browser console (F12)
4. Look for errors:
   - ✅ No 404 errors for assets
   - ✅ Site loads correctly
   - ✅ All functionality works

## 🐛 Still Getting 404?

### Check 1: File Permissions
- `index.html` should be `644`
- `.htaccess` should be `644`
- `assets/` folder should be `755`
- Files inside `assets/` should be `644`

### Check 2: .htaccess Uploaded
The `.htaccess` file is hidden by default. Make sure:
1. In File Manager, click **Settings** (gear icon)
2. Enable "Show Hidden Files"
3. Verify `.htaccess` is in `public_html/`

### Check 3: Server Rewrite
If assets still 404, try adding this to the TOP of `.htaccess`:
```apache
# Skip rewrite for existing files FIRST
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]
```

### Check 4: Clear Server Cache
Some hosts cache files:
1. In Hostinger cPanel
2. Look for "Cache Manager" or similar
3. Clear all cache

## 🔄 Alternative: Use Correct Upload Method

If using Hostinger's "Git Deployment" or similar:
- Make sure the deploy script includes the `dist/assets/` folder
- Check `.gitignore` doesn't exclude `dist/` folder

## 📞 Still Not Working?

If the 404 persists after uploading assets/ folder:

1. **Verify the exact file path:**
   - Try accessing directly: https://certusdiagnostics.in/assets/index-D1c7jCV_.js
   - Should download the JS file, not show 404

2. **Check Apache logs:**
   - In cPanel → Errors → Error Log
   - Look for any rewrite issues

3. **Test .htaccess syntax:**
   - Temporarily rename `.htaccess` to `.htaccess.bak`
   - If site works, there's a syntax error in .htaccess
   - Restore and fix the error

## ✅ Success Checklist

After proper upload, you should see:
- ✅ Homepage loads without blank screen
- ✅ No 404 errors in console
- ✅ JavaScript executes properly
- ✅ CSS styles applied
- ✅ Images load correctly
- ✅ Google Sign-In works
- ✅ Reviews display or show fallback

---

## 🎯 Quick Summary

**The Problem:** The `assets/` folder containing your JavaScript bundle wasn't uploaded.

**The Solution:** Upload the ENTIRE `dist/` folder contents to `public_html/`, especially the `assets/` subfolder.

**Next Build:** After running `npm run build`, always upload:
```
dist/
├── index.html
├── .htaccess
├── assets/           ← Don't forget this!
│   └── (all files)
└── (all other files)
```
