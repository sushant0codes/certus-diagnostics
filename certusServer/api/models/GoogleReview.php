<?php
/**
 * Google Review model class
 */
class GoogleReview
{
    private $connection;
    private $table_name = "google_reviews";

    // Review properties
    public $id;
    public $author;
    public $rating;
    public $review_text;
    public $review_time;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    /**
     * Create a new review
     */
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  (author, rating, review_text, review_time) 
                  VALUES (:author, :rating, :review_text, :review_time)";

        $stmt = $this->connection->prepare($query);

        // Clean data
        $this->author = htmlspecialchars(strip_tags($this->author));
        $this->rating = (int) $this->rating;
        $this->review_text = htmlspecialchars(strip_tags($this->review_text));
        $this->review_time = htmlspecialchars(strip_tags($this->review_time));

        // Bind data
        $stmt->bindParam(':author', $this->author);
        $stmt->bindParam(':rating', $this->rating);
        $stmt->bindParam(':review_text', $this->review_text);
        $stmt->bindParam(':review_time', $this->review_time);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    /**
     * Check if review already exists (prevent duplicates)
     */
    public function reviewExists($author, $review_text, $review_time)
    {
        $query = "SELECT id FROM " . $this->table_name . " 
                  WHERE author = :author 
                  AND review_text = :review_text 
                  AND review_time = :review_time";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':author', $author);
        $stmt->bindParam(':review_text', $review_text);
        $stmt->bindParam(':review_time', $review_time);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    /**
     * Get all reviews
     */
    public function getAllReviews()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY rating DESC, review_time DESC";

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    /**
     * Get reviews with pagination
     */
    public function getReviews($limit = 15, $offset = 0)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                  ORDER BY rating DESC, review_time DESC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }

    /**
     * Get average rating
     */
    public function getAverageRating()
    {
        $query = "SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews 
                  FROM " . $this->table_name;

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return array(
            'average_rating' => round($row['avg_rating'], 1),
            'total_reviews' => $row['total_reviews']
        );
    }

    /**
     * Get rating distribution
     */
    public function getRatingDistribution()
    {
        $query = "SELECT rating, COUNT(*) as count 
                  FROM " . $this->table_name . " 
                  GROUP BY rating 
                  ORDER BY rating DESC";

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    /**
     * Get reviews by rating
     */
    public function getReviewsByRating($rating, $limit = 10, $offset = 0)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE rating = :rating
                  ORDER BY rating DESC, review_time DESC 
                  LIMIT :limit OFFSET :offset";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(':rating', $rating, PDO::PARAM_INT);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt;
    }
}
?>