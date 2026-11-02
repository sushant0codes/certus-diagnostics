#!/bin/bash

# Google Reviews Cron Job Setup Script
# This script helps you set up a daily cron job to fetch Google Reviews

echo "=== Google Reviews Cron Job Setup ==="
echo ""

# Get the current script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PHP_SCRIPT="$SCRIPT_DIR/fetch_google_reviews.php"

# Check if PHP script exists
if [ ! -f "$PHP_SCRIPT" ]; then
    echo "Error: fetch_google_reviews.php not found at $PHP_SCRIPT"
    exit 1
fi

# Find PHP executable
PHP_PATH=$(which php)
if [ -z "$PHP_PATH" ]; then
    echo "Error: PHP not found in PATH"
    echo "Please make sure PHP is installed and accessible"
    exit 1
fi

echo "Found PHP at: $PHP_PATH"
echo "Script location: $PHP_SCRIPT"
echo ""

# Test the script first
echo "Testing the Google Reviews script..."
$PHP_PATH "$PHP_SCRIPT"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Script test successful!"
else
    echo ""
    echo "❌ Script test failed. Please check your configuration."
    echo "Make sure you have:"
    echo "1. Updated config/google_reviews_config.php with your API key and Place ID"
    echo "2. Created the google_reviews table in your database"
    echo "3. Proper database connection in config/database.php"
    exit 1
fi

echo ""
echo "=== Cron Job Configuration ==="
echo ""
echo "To set up a daily cron job, follow these steps:"
echo ""
echo "1. Open your crontab:"
echo "   crontab -e"
echo ""
echo "2. Add this line to run the script daily at 9:00 AM:"
echo "   0 9 * * * $PHP_PATH \"$PHP_SCRIPT\" >> \"$SCRIPT_DIR/../logs/cron.log\" 2>&1"
echo ""
echo "3. Alternative times you can use:"
echo "   0 6 * * *   # Daily at 6:00 AM"
echo "   0 12 * * *  # Daily at 12:00 PM"
echo "   0 18 * * *  # Daily at 6:00 PM"
echo "   0 0 * * *   # Daily at midnight"
echo ""
echo "4. To run every 6 hours:"
echo "   0 */6 * * * $PHP_PATH \"$PHP_SCRIPT\" >> \"$SCRIPT_DIR/../logs/cron.log\" 2>&1"
echo ""
echo "5. Save and exit the crontab editor"
echo ""
echo "=== Manual Testing ==="
echo ""
echo "You can manually run the script anytime with:"
echo "$PHP_PATH \"$PHP_SCRIPT\""
echo ""
echo "=== Log Files ==="
echo ""
echo "Script logs: $SCRIPT_DIR/../logs/google_reviews_*.log"
echo "Cron logs: $SCRIPT_DIR/../logs/cron.log"
echo ""
echo "=== Troubleshooting ==="
echo ""
echo "If you encounter issues:"
echo "1. Check the log files for detailed error messages"
echo "2. Verify your Google API key has Places API enabled"
echo "3. Confirm your Place ID is correct"
echo "4. Ensure your database connection works"
echo "5. Check file permissions for the script and log directories"
echo ""
echo "Setup complete! 🎉"
