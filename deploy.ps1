# Quick Deployment Script for Hostinger
# Run this in PowerShell from the Certus-Diagnostics-main directory

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Certus Diagnostics - Quick Deploy" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Rebuild the client
Write-Host "[1/3] Building client for production..." -ForegroundColor Yellow
cd Certus-Client
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Build successful!" -ForegroundColor Green
} else {
    Write-Host "✗ Build failed! Check errors above." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Step 2: Display what needs to be uploaded
Write-Host "[2/3] Files ready for deployment:" -ForegroundColor Yellow
Write-Host ""
Write-Host "CLIENT FILES (upload to public_html/):" -ForegroundColor Cyan
Write-Host "  → All contents of: Certus-Client/dist/" -ForegroundColor White
Write-Host "  → Make sure .htaccess is included" -ForegroundColor White
Write-Host ""
Write-Host "API FILES (upload to /api/ on server):" -ForegroundColor Cyan
Write-Host "  → api/google-reviews.php (UPDATED)" -ForegroundColor Green
Write-Host "  → api/google-auth.php (UPDATED)" -ForegroundColor Green
Write-Host "  → api/update-user-phone.php (UPDATED)" -ForegroundColor Green
Write-Host "  → api/config/database.php" -ForegroundColor White
Write-Host "  → api/controllers/GoogleReviewController.php" -ForegroundColor White
Write-Host "  → api/models/GoogleReview.php" -ForegroundColor White
Write-Host ""

# Step 3: Deployment checklist
Write-Host "[3/3] Deployment Checklist:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Before uploading:" -ForegroundColor Magenta
Write-Host "  [ ] Verify database credentials in api/config/database.php" -ForegroundColor White
Write-Host "  [ ] Ensure Google OAuth credentials are set for production domain" -ForegroundColor White
Write-Host ""
Write-Host "After uploading:" -ForegroundColor Magenta
Write-Host "  [ ] Test: Visit https://certusdiagnostics.in" -ForegroundColor White
Write-Host "  [ ] Test: Check if homepage reviews load without errors" -ForegroundColor White
Write-Host "  [ ] Test: Try Google Sign-In" -ForegroundColor White
Write-Host "  [ ] Test: Verify profile picture appears in header" -ForegroundColor White
Write-Host "  [ ] Test: For new users, test phone number collection" -ForegroundColor White
Write-Host "  [ ] Check browser console for any remaining errors" -ForegroundColor White
Write-Host ""

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Build Complete! Ready to deploy." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Upload files using:" -ForegroundColor Yellow
Write-Host "  - Hostinger File Manager" -ForegroundColor White
Write-Host "  - FTP/SFTP client (FileZilla, WinSCP, etc.)" -ForegroundColor White
Write-Host "  - Git deployment (if configured)" -ForegroundColor White
Write-Host ""
Write-Host "See API_FIXES_SUMMARY.md for detailed information." -ForegroundColor Cyan
Write-Host ""

# Return to original directory
cd ..
