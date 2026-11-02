<?php
class Package
{
    private $conn;
    private $table = 'packages';

    public $package_id;
    public $name;
    public $price;
    public $photo;
    public $date_created;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Get all packages
    public function getAll()
    {
        $query = "SELECT package_id, name, price, photo, date_created FROM " . $this->table . " ORDER BY date_created DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Get single package
    public function getById($id)
    {
        $query = "SELECT package_id, name, price, photo, date_created FROM " . $this->table . " WHERE package_id = ? LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->package_id = $row['package_id'];
            $this->name = $row['name'];
            $this->price = $row['price'];
            $this->photo = $row['photo'];
            $this->date_created = $row['date_created'];
            return true;
        }

        return false;
    }

    // Create package
    public function create()
    {
        $query = "INSERT INTO " . $this->table . " SET name=:name, price=:price, photo=:photo";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->photo = htmlspecialchars(strip_tags($this->photo));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':photo', $this->photo);

        if ($stmt->execute()) {
            $this->package_id = $this->conn->lastInsertId();
            return true;
        }

        return false;
    }

    // Update package
    public function update()
    {
        $query = "UPDATE " . $this->table . " SET name=:name, price=:price, photo=:photo WHERE package_id=:package_id";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->photo = htmlspecialchars(strip_tags($this->photo));
        $this->package_id = htmlspecialchars(strip_tags($this->package_id));

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':photo', $this->photo);
        $stmt->bindParam(':package_id', $this->package_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Delete package
    public function delete()
    {
        $query = "DELETE FROM " . $this->table . " WHERE package_id = ?";

        $stmt = $this->conn->prepare($query);

        // Clean data
        $this->package_id = htmlspecialchars(strip_tags($this->package_id));

        // Bind data
        $stmt->bindParam(1, $this->package_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Search packages
    public function search($searchTerm)
    {
        $query = "SELECT package_id, name, price, photo, date_created FROM " . $this->table . " 
                 WHERE name LIKE ? OR package_id LIKE ? 
                 ORDER BY date_created DESC";

        $stmt = $this->conn->prepare($query);

        $searchTerm = "%{$searchTerm}%";
        $stmt->bindParam(1, $searchTerm);
        $stmt->bindParam(2, $searchTerm);
        $stmt->execute();

        return $stmt;
    }

    // Get package count for dashboard
    public function getCount()
    {
        $query = "SELECT COUNT(*) as total FROM " . $this->table;

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['total'];
    }
}
?>