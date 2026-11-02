<?php
/**
 * Manual Google Reviews Addition Script
 * Use this to manually add recent reviews that aren't returned by the Google Places API
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/GoogleReview.php';

// Initialize database connection
$database = new Database();
$db = $database->getConnection();
$googleReview = new GoogleReview($db);

// Define the newer reviews we can see in Google Maps but API doesn't return
$manualReviews = [
    [
        'author' => 'Alveena Gill',
        'rating' => 5,
        'review_text' => 'Very good 👍 ...',
        'review_time' => date('Y-m-d H:i:s', strtotime('-2 days')) // 2 days ago
    ],
    [
        'author' => 'Ashish Gill',
        'rating' => 5,
        'review_text' => 'Very good 👍 ...',
        'review_time' => date('Y-m-d H:i:s', strtotime('-3 days')) // 3 days ago
    ]
];

echo "Adding manual reviews that Google Places API doesn't return...\n\n";

$addedCount = 0;
foreach ($manualReviews as $reviewData) {
    // Check if review already exists
    if ($googleReview->reviewExists($reviewData['author'], $reviewData['review_text'], $reviewData['review_time'])) {
        echo "Review by {$reviewData['author']} already exists - skipping\n";
        continue;
    }

    // Set review data
    $googleReview->author = $reviewData['author'];
    $googleReview->rating = $reviewData['rating'];
    $googleReview->review_text = $reviewData['review_text'];
    $googleReview->review_time = $reviewData['review_time'];

    // Try to create the review
    if ($googleReview->create()) {
        echo "✅ Successfully added review by {$reviewData['author']} (Rating: {$reviewData['rating']})\n";
        $addedCount++;
    } else {
        echo "❌ Failed to add review by {$reviewData['author']}\n";
    }
}

echo "\nProcess completed. Added {$addedCount} new manual reviews.\n";

// Show updated stats
$stats = $googleReview->getAverageRating();
echo "\nUpdated statistics:\n";
echo "Total reviews: {$stats['total_reviews']}\n";
echo "Average rating: {$stats['average_rating']}\n";
?>