<?php
// Database configuration for Certus Diagnostics
class Database
{
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $connection;

    public function __construct()
    {
        $this->host = getenv('DB_HOST') ?: "localhost";
        $this->database_name = getenv('DB_NAME') ?: "";
        $this->username = getenv('DB_USER') ?: "";
        $this->password = getenv('DB_PASS') ?: "";
    }

    public function getConnection()
    {
        $this->connection = null;

        try {
            $this->connection = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->database_name,
                $this->username,
                $this->password
            );

            // Set PDO attributes
            $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->connection->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

        } catch (PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }

        return $this->connection;
    }
}
?>