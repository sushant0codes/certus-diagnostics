#!/bin/bash

# Certus Diagnostics - Production Deployment Script
# This script helps prepare your applications for Hostinger deployment

echo "🚀 Certus Diagnostics - Production Deployment Preparation"
echo "========================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo ""
print_info "Step 1: Preparing Backend API for Production"
echo "=============================================="

# Create production directory structure
print_info "Creating production directory structure..."
mkdir -p production/api
mkdir -p production/client/build
mkdir -p production/admin/build

# Copy backend files
print_info "Copying backend API files..."
cp -r /Applications/XAMPP/xamppfiles/htdocs/certusServer/* production/api/

print_status "Backend files copied to production/api/"

echo ""
print_info "Step 2: Building Client Application"
echo "=================================="

cd "/Users/rehnooraulakh/Documents/Certus Diagnostics Client/certusdiagnostics"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Installing client dependencies..."
    npm install
fi

# Build client for production
print_info "Building client application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Client build successful!"
    # Copy build files
    cp -r dist/* ../../../production/client/build/
    print_status "Client build files copied to production/client/build/"
else
    print_error "Client build failed!"
    exit 1
fi

echo ""
print_info "Step 3: Building Admin Application"
echo "================================="

cd "/Users/rehnooraulakh/Documents/Certus Diagnostics Admin"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "Installing admin dependencies..."
    npm install
fi

# Build admin for production
print_info "Building admin application..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Admin build successful!"
    # Copy build files
    cp -r dist/* ../../../production/admin/build/
    print_status "Admin build files copied to production/admin/build/"
else
    print_error "Admin build failed!"
    exit 1
fi

echo ""
print_info "Step 4: Creating Production Package"
echo "=================================="

cd production

# Create zip files for easy upload
print_info "Creating zip packages..."
zip -r certus-api.zip api/
zip -r certus-client.zip client/
zip -r certus-admin.zip admin/

print_status "Production packages created:"
print_info "- certus-api.zip (Upload to public_html/api/)"
print_info "- certus-client.zip (Upload to public_html/)"
print_info "- certus-admin.zip (Upload to public_html/admin/)"

echo ""
print_info "Step 5: Deployment Checklist"
print_info "============================"

echo ""
print_warning "BEFORE UPLOADING TO HOSTINGER:"
echo "1. Update Google OAuth settings:"
echo "   - Add https://admin.certusdiagnostics.in to authorized origins"
echo "   - Add https://certusdiagnostics.in to authorized origins"

echo ""
echo "2. Upload files to Hostinger:"
echo "   - Extract certus-api.zip to public_html/api/"
echo "   - Extract certus-client.zip to public_html/"
echo "   - Extract certus-admin.zip to public_html/admin/"

echo ""
echo "3. Set file permissions on Hostinger:"
echo "   - chmod 755 public_html/api/"
echo "   - chmod 644 public_html/api/*.php"
echo "   - chmod 755 public_html/api/uploads/"
echo "   - chmod 755 public_html/api/uploads/reports/"

echo ""
echo "4. Test the applications:"
echo "   - Client: https://certusdiagnostics.in"
echo "   - Admin: https://admin.certusdiagnostics.in"
echo "   - Test API: https://certusdiagnostics.in/api/patients.php"

echo ""
print_status "🎉 Production preparation complete!"
print_info "All files are ready in the 'production' directory"

echo ""
print_warning "Next Steps:"
echo "1. Upload the zip files to Hostinger"
echo "2. Update Google OAuth settings"
echo "3. Test all functionality"
echo "4. Enable SSL certificates"

echo ""
print_info "For detailed instructions, see: HOSTINGER_DEPLOYMENT_GUIDE.md"
