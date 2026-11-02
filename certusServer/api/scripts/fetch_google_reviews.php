<?php
/**
 * Google Reviews Fetcher Script
 * Fetches reviews from Google Places API and stores them in the database
 * 
 * Run this script daily via cron job:
 * 0 9 * * * /usr/bin/php /path/to/your/script/fetch_google_reviews.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/GoogleReview.php';

class GoogleReviewsFetcher
{
    private $apiKey;
    private $placeId;
    private $maxReviews;
    private $database;
    private $db;
    private $googleReview;
    private $logFile;
    private $config;

    public function __construct()
    {
        // Load configuration
        $this->config = require __DIR__ . '/../config/google_reviews_config.php';

        // Set configuration values
        $this->apiKey = $this->config['google_api_key'];
        $this->placeId = $this->config['google_place_id'];
        $this->maxReviews = $this->config['max_reviews'] ?? 5;

        // Set timezone if configured
        if (isset($this->config['timezone'])) {
            date_default_timezone_set($this->config['timezone']);
        }

        // Initialize database connection
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        $this->googleReview = new GoogleReview($this->db);

        // Set up logging
        $this->logFile = __DIR__ . '/../logs/google_reviews_' . date('Y-m') . '.log';

        // Create logs directory if it doesn't exist
        $logsDir = dirname($this->logFile);
        if (!is_dir($logsDir)) {
            mkdir($logsDir, 0755, true);
        }
    }

    /**
     * Fetch reviews from Google Places API
     */
    public function fetchReviews()
    {
        try {
            $this->log("Starting Google Reviews fetch process...");

            // Validate configuration
            if ($this->apiKey === 'YOUR_GOOGLE_API_KEY_HERE' || $this->placeId === 'YOUR_GOOGLE_PLACE_ID_HERE') {
                throw new Exception("Please configure your Google API key and Place ID in config/google_reviews_config.php");
            }

            // Build API URL with additional parameters to try to get different reviews
            $url = "https://maps.googleapis.com/maps/api/place/details/json?" . http_build_query([
                'place_id' => $this->placeId,
                'fields' => 'reviews,rating,user_ratings_total',
                'key' => $this->apiKey,
                'language' => 'en', // Try different language to get different review set
                'reviews_sort' => 'newest' // Request newest reviews (may not always work)
            ]);

            // Make API request
            $response = $this->makeApiRequest($url);

            if (!$response) {
                throw new Exception("Failed to fetch data from Google Places API");
            }

            // Process reviews
            $newReviewsCount = $this->processReviews($response);

            $this->log("Process completed. Added {$newReviewsCount} new reviews.");

            return $newReviewsCount;

        } catch (Exception $e) {
            $this->log("ERROR: " . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Make API request to Google Places
     */
    private function makeApiRequest($url)
    {
        $context = stream_context_create([
            'http' => [
                'timeout' => 30,
                'user_agent' => 'Certus Diagnostics Review Fetcher/1.0'
            ]
        ]);

        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            throw new Exception("Failed to make API request");
        }

        $data = json_decode($response, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON response from API");
        }

        if (isset($data['error_message'])) {
            throw new Exception("Google API Error: " . $data['error_message']);
        }

        if ($data['status'] !== 'OK') {
            throw new Exception("Google API returned status: " . $data['status']);
        }

        return $data;
    }

    /**
     * Process and store reviews
     */
    private function processReviews($apiResponse)
    {
        if (!isset($apiResponse['result']['reviews']) || !is_array($apiResponse['result']['reviews'])) {
            $this->log("No reviews found in API response");
            return 0;
        }

        $reviews = $apiResponse['result']['reviews'];
        $newReviewsCount = 0;

        // Limit to configured maximum reviews
        $reviews = array_slice($reviews, 0, $this->maxReviews);

        foreach ($reviews as $review) {
            try {
                if ($this->storeReview($review)) {
                    $newReviewsCount++;
                }
            } catch (Exception $e) {
                $this->log("Error storing review: " . $e->getMessage());
            }
        }

        return $newReviewsCount;
    }

    /**
     * Store individual review in database
     */
    private function storeReview($reviewData)
    {
        // Extract review data
        $author = isset($reviewData['author_name']) ? $reviewData['author_name'] : 'Anonymous';
        $rating = isset($reviewData['rating']) ? (int) $reviewData['rating'] : 0;
        $reviewText = isset($reviewData['text']) ? $reviewData['text'] : '';

        // Convert timestamp to MySQL datetime format
        $reviewTime = isset($reviewData['time'])
            ? date('Y-m-d H:i:s', $reviewData['time'])
            : date('Y-m-d H:i:s');

        // Set review properties
        $this->googleReview->author = $author;
        $this->googleReview->rating = $rating;
        $this->googleReview->review_text = $reviewText;
        $this->googleReview->review_time = $reviewTime;

        // Validate review data
        if (empty($author) || $rating < 1 || $rating > 5) {
            $this->log("Skipping invalid review data for author: {$author}");
            return false;
        }

        // Check if review already exists to prevent duplicates
        if ($this->googleReview->reviewExists($author, $reviewText, $reviewTime)) {
            $this->log("Review by {$author} already exists - skipping duplicate");
            return false;
        }

        // Try to create the review
        if ($this->googleReview->create()) {
            $this->log("Successfully added review by {$author} (Rating: {$rating})");
            return true;
        } else {
            $this->log("Failed to insert review by {$author}");
            return false;
        }
    }

    /**
     * Log messages with timestamp
     */
    private function log($message)
    {
        $timestamp = date('Y-m-d H:i:s');
        $logMessage = "[{$timestamp}] {$message}" . PHP_EOL;

        // Write to log file
        file_put_contents($this->logFile, $logMessage, FILE_APPEND | LOCK_EX);

        // Also output to console if running from command line
        if (php_sapi_name() === 'cli') {
            echo $logMessage;
        }
    }

    /**
     * Get recent log entries
     */
    public function getRecentLogs($lines = 50)
    {
        if (!file_exists($this->logFile)) {
            return "No log file found.";
        }

        $logs = file($this->logFile);
        $recentLogs = array_slice($logs, -$lines);

        return implode('', $recentLogs);
    }
}

// Main execution
if (php_sapi_name() === 'cli') {
    // Running from command line
    try {
        $fetcher = new GoogleReviewsFetcher();
        $newReviews = $fetcher->fetchReviews();
        echo "Fetched {$newReviews} new reviews successfully." . PHP_EOL;
        exit(0);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . PHP_EOL;
        exit(1);
    }
} else {
    // Running from web browser (for testing)
    header('Content-Type: text/plain');
    try {
        $fetcher = new GoogleReviewsFetcher();
        $newReviews = $fetcher->fetchReviews();
        echo "Fetched {$newReviews} new reviews successfully.\n\n";
        echo "Recent logs:\n";
        echo $fetcher->getRecentLogs(20);
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
    }
}
?>