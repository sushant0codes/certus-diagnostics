<?php
/**
 * Google Reviews Controller
 */
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/GoogleReview.php';

class GoogleReviewController
{
    private $database;
    private $db;
    private $googleReview;

    public function __construct()
    {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        
        if (!$this->db) {
            throw new Exception("Database connection failed");
        }
        
        $this->googleReview = new GoogleReview($this->db);
    }

    // Handle GET requests
    public function handleGet()
    {
        if (isset($_GET['rating'])) {
            return $this->getReviewsByRating($_GET['rating']);
        } elseif (isset($_GET['stats'])) {
            return $this->getReviewStats();
        } else {
            return $this->getAllReviews();
        }
    }

    // Get all reviews with pagination
    private function getAllReviews()
    {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page - 1) * $limit;

        $stmt = $this->googleReview->getReviews($limit, $offset);
        $reviews = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $reviews[] = array(
                "id" => $row['id'],
                "author" => $row['author'],
                "rating" => (int) $row['rating'],
                "review_text" => $row['review_text'],
                "review_time" => $row['review_time']
            );
        }

        return array(
            "success" => true,
            "message" => "Reviews retrieved successfully",
            "data" => $reviews,
            "count" => count($reviews),
            "page" => $page,
            "limit" => $limit
        );
    }


    // Get reviews by rating
    private function getReviewsByRating($rating)
    {
        $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 10;
        $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
        $offset = ($page - 1) * $limit;

        $stmt = $this->googleReview->getReviewsByRating($rating, $limit, $offset);
        $reviews = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $reviews[] = array(
                "id" => $row['id'],
                "author" => $row['author'],
                "rating" => (int) $row['rating'],
                "review_text" => $row['review_text'],
                "review_time" => $row['review_time']
            );
        }

        return array(
            "success" => true,
            "message" => "Reviews by rating retrieved",
            "data" => $reviews,
            "count" => count($reviews),
            "rating" => (int) $rating
        );
    }

    // Get review statistics
    private function getReviewStats()
    {
        $avgData = $this->googleReview->getAverageRating();

        $distributionStmt = $this->googleReview->getRatingDistribution();
        $distribution = array();

        while ($row = $distributionStmt->fetch(PDO::FETCH_ASSOC)) {
            $distribution[$row['rating']] = (int) $row['count'];
        }

        // Ensure all ratings 1-5 are represented
        for ($i = 1; $i <= 5; $i++) {
            if (!isset($distribution[$i])) {
                $distribution[$i] = 0;
            }
        }
        ksort($distribution);

        return array(
            "success" => true,
            "message" => "Review statistics retrieved",
            "data" => array(
                "average_rating" => (float) $avgData['average_rating'],
                "total_reviews" => (int) $avgData['total_reviews'],
                "rating_distribution" => $distribution
            )
        );
    }

}
?>