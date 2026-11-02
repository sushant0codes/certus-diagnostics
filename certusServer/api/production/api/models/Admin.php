<?php
// Admin model class
class Admin
{
    private $connection;
    private $table_name = "admin";

    // Admin properties
    public $admin_id;
    public $name;
    public $email;
    public $phone;
    public $password;
    public $google_id;
    public $profile_picture;
    public $last_login;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->connection = $db;
    }

    // Get admin by email
    public function getAdminByEmail($email)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE email = ? LIMIT 0,1";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $email);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->admin_id = $row['admin_id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->password = $row['password'];
            $this->google_id = $row['google_id'];
            $this->profile_picture = $row['profile_picture'];
            $this->last_login = $row['last_login'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Get admin by Google ID
    public function getAdminByGoogleId($google_id)
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE google_id = ? LIMIT 0,1";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $google_id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->admin_id = $row['admin_id'];
            $this->name = $row['name'];
            $this->email = $row['email'];
            $this->phone = $row['phone'];
            $this->password = $row['password'];
            $this->google_id = $row['google_id'];
            $this->profile_picture = $row['profile_picture'];
            $this->last_login = $row['last_login'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }

        return false;
    }

    // Create new admin (for Google sign-up)
    public function createAdmin()
    {
        $query = "INSERT INTO " . $this->table_name . " 
                  SET name=:name, email=:email, phone=:phone, 
                      google_id=:google_id, profile_picture=:profile_picture";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->google_id = htmlspecialchars(strip_tags($this->google_id));
        $this->profile_picture = htmlspecialchars(strip_tags($this->profile_picture));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":google_id", $this->google_id);
        $stmt->bindParam(":profile_picture", $this->profile_picture);

        if ($stmt->execute()) {
            $this->admin_id = $this->connection->lastInsertId();
            return true;
        }

        return false;
    }

    // Update admin profile
    public function updateAdmin()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET name=:name, email=:email, phone=:phone, 
                      profile_picture=:profile_picture, updated_at=NOW()
                  WHERE admin_id=:admin_id";

        $stmt = $this->connection->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->phone = htmlspecialchars(strip_tags($this->phone));
        $this->profile_picture = htmlspecialchars(strip_tags($this->profile_picture));
        $this->admin_id = htmlspecialchars(strip_tags($this->admin_id));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":email", $this->email);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":profile_picture", $this->profile_picture);
        $stmt->bindParam(":admin_id", $this->admin_id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Update last login
    public function updateLastLogin()
    {
        $query = "UPDATE " . $this->table_name . " 
                  SET last_login=NOW() 
                  WHERE admin_id=:admin_id";

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(":admin_id", $this->admin_id);

        return $stmt->execute();
    }

    // Check if email exists
    public function emailExists($email, $excludeId = null)
    {
        $query = "SELECT admin_id FROM " . $this->table_name . " WHERE email = ?";

        if ($excludeId) {
            $query .= " AND admin_id != ?";
        }

        $stmt = $this->connection->prepare($query);
        $stmt->bindParam(1, $email);

        if ($excludeId) {
            $stmt->bindParam(2, $excludeId);
        }

        $stmt->execute();

        return $stmt->rowCount() > 0;
    }

    // Validate email format
    public function isValidEmail($email)
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL);
    }
}
?>