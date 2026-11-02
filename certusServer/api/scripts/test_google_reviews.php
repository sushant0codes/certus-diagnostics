<?php
/**
 * Test script for Google Reviews functionality
 * Run this to test your setup before enabling the cron job
 */

// Set timezone
date_default_timezone_set('Asia/Kolkata');

echo "=== Google Reviews Test Script ===\n\n";

// Test 1: Check if table exists
echo "1. Testing database connection and table...\n";
try {
    require_once __DIR__ . '/../config/database.php';
    $database = new Database();
    $db = $database->getConnection();

    // Check if table exists
    $stmt = $db->query("SHOW TABLES LIKE 'google_reviews'");
    if ($stmt->rowCount() > 0) {
        echo "✅ google_reviews table exists\n";
    } else {
        echo "❌ google_reviews table not found. Please create it first.\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

// Test 2: Check configuration
echo "\n2. Testing configuration...\n";
try {
    $config = require __DIR__ . '/../config/google_reviews_config.php';

    if ($config['google_api_key'] === 'YOUR_GOOGLE_API_KEY_HERE') {
        echo "⚠️  Google API key not configured\n";
    } else {
        echo "✅ Google API key configured\n";
    }

    if ($config['google_place_id'] === 'YOUR_GOOGLE_PLACE_ID_HERE') {
        echo "⚠️  Google Place ID not configured\n";
    } else {
        echo "✅ Google Place ID configured\n";
    }
} catch (Exception $e) {
    echo "❌ Configuration error: " . $e->getMessage() . "\n";
}

// Test 3: Test GoogleReview model
echo "\n3. Testing GoogleReview model...\n";
try {
    require_once __DIR__ . '/../models/GoogleReview.php';
    $googleReview = new GoogleReview($db);

    // Test creating a sample review
    $googleReview->author = "Test User";
    $googleReview->rating = 5;
    $googleReview->review_text = "This is a test review created by the test script.";
    $googleReview->review_time = date('Y-m-d H:i:s');

    if ($googleReview->createReview()) {
        echo "✅ Successfully created test review\n";

        // Clean up - delete the test review
        $googleReview->deleteReview();
        echo "✅ Successfully deleted test review\n";
    } else {
        echo "⚠️  Could not create test review (might be duplicate)\n";
    }

    // Test getting statistics
    $stats = $googleReview->getAverageRating();
    echo "✅ Current reviews in database: " . $stats['total_reviews'] . "\n";

} catch (Exception $e) {
    echo "❌ GoogleReview model error: " . $e->getMessage() . "\n";
}

// Test 4: Test API endpoint
echo "\n4. Testing API endpoint...\n";
try {
    $apiUrl = "http://localhost/certusServer/api/google-reviews.php?stats=1";
    $context = stream_context_create([
        'http' => [
            'timeout' => 10,
            'ignore_errors' => true
        ]
    ]);

    $response = file_get_contents($apiUrl, false, $context);
    if ($response !== false) {
        $data = json_decode($response, true);
        if ($data && $data['success']) {
            echo "✅ API endpoint working\n";
            echo "   Total reviews: " . $data['data']['total_reviews'] . "\n";
            echo "   Average rating: " . $data['data']['average_rating'] . "\n";
        } else {
            echo "⚠️  API returned error: " . ($data['message'] ?? 'Unknown error') . "\n";
        }
    } else {
        echo "❌ Could not reach API endpoint\n";
    }
} catch (Exception $e) {
    echo "❌ API test error: " . $e->getMessage() . "\n";
}

// Test 5: Test Google Reviews fetcher (dry run)
echo "\n5. Testing Google Reviews fetcher...\n";
try {
    require_once __DIR__ . '/fetch_google_reviews.php';

    if (
        $config['google_api_key'] !== 'YOUR_GOOGLE_API_KEY_HERE' &&
        $config['google_place_id'] !== 'YOUR_GOOGLE_PLACE_ID_HERE'
    ) {

        echo "⚠️  Note: This will make a real API call to Google\n";
        echo "   Proceeding with live test...\n";

        $fetcher = new GoogleReviewsFetcher();
        $newReviews = $fetcher->fetchReviews();
        echo "✅ Google Reviews fetcher working - fetched {$newReviews} new reviews\n";
    } else {
        echo "⚠️  Skipping live test - configure API credentials first\n";
    }
} catch (Exception $e) {
    echo "❌ Google Reviews fetcher error: " . $e->getMessage() . "\n";
}

echo "\n=== Test Complete ===\n";
echo "\nNext steps:\n";
echo "1. Configure your Google API key and Place ID in config/google_reviews_config.php\n";
echo "2. Run the setup script: ./scripts/setup_cron.sh\n";
echo "3. Set up the cron job as instructed by the setup script\n";
echo "4. Monitor the logs in logs/ directory\n\n";
?>