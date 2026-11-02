<?php
// Test model class
class Test
{
    private $connection;
    private $table_name = "tests";

    // Test properties
    public $test_id;
    public $name;
    public $price;
    public $photo;
    public $date_created;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    // Get all tests
    public function getAllTests()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY date_created DESC";

        $stmt = $this->connection->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Get test by ID
    public function getTestById($id = null)
    {
        $testId = $id !== null ? $id : $this->test_id;

        $query = "SELECT * FROM " . $this->table_name . " WHERE test_id = ? LIMIT 0,1";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $testId);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->test_id = $row['test_id'];
            $this->name = $row['name'];
            $this->price = $row['price'];
            $this->photo = $row['photo'];
            $this->date_created = $row['date_created'];
            return true;
        }

        return false;
    }

    // Search tests
    public function searchTests($searchTerm)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                  WHERE name LIKE ? OR test_id LIKE ?
                  ORDER BY date_created DESC";

        $searchParam = "%{$searchTerm}%";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $searchParam);
        $stmt->bindParam(2, $searchParam);
        $stmt->execute();

        return $stmt;
    }

    // Create test
    public function createTest()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, price=:price, photo=:photo";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->photo = htmlspecialchars(strip_tags($this->photo));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":photo", $this->photo);

        if ($stmt->execute()) {
            $this->test_id = $this->connection->lastInsertId();
            return true;
        }

        return false;
    }

    // Update test
    public function updateTest()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, price=:price, photo=:photo
                  WHERE test_id=:test_id";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->photo = htmlspecialchars(strip_tags($this->photo));
        $this->test_id = htmlspecialchars(strip_tags($this->test_id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":photo", $this->photo);
        $stmt->bindParam(":test_id", $this->test_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete test
    public function deleteTest()
    {
        $sql = "DELETE FROM tests WHERE test_id = :test_id";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':test_id', $this->test_id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Validate required fields
    public function validateTest()
    {
        $errors = array();

        if (empty($this->name)) {
            $errors[] = "Test name is required";
        }

        if (empty($this->price) || !is_numeric($this->price) || $this->price <= 0) {
            $errors[] = "Valid price is required";
        }

        return $errors;
    }
}
?>