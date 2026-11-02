<?php
// Load environment configuration
require_once __DIR__ . '/environment.php';

/**
 * Database configuration for Certus Diagnostics
 * Uses environment-based settings from environment.php
 */
class Database
{
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $connection;

    public function __construct()
    {
        // Load credentials from environment config
        $this->host = DB_HOST;
        $this->database_name = DB_NAME;
        $this->username = DB_USER;
        $this->password = DB_PASS;
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
            // Log error to file instead of displaying
            error_log("Database connection error: " . $exception->getMessage());
            
            // Return null instead of echoing error
            return null;
        }

        return $this->connection;
    }
}