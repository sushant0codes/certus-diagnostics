<?php
// Test controller class
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Test.php';

class TestController
{
    private $database;
    private $db;
    private $test;

    public function __construct()
    {
        $this->database = new Database();
        $this->db = $this->database->getConnection();
        $this->test = new Test($this->db);
    }

    // Handle GET requests
    public function handleGet()
    {
        if (isset($_GET['id'])) {
            return $this->getTestById($_GET['id']);
        } elseif (isset($_GET['search'])) {
            return $this->searchTests($_GET['search']);
        } else {
            return $this->getAllTests();
        }
    }

    // Get all tests
    private function getAllTests()
    {
        $stmt = $this->test->getAllTests();
        $tests = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tests[] = array(
                "test_id" => $row['test_id'],
                "name" => $row['name'],
                "price" => $row['price'],
                "photo" => $row['photo'],
                "date_created" => $row['date_created']
            );
        }

        return array(
            "success" => true,
            "message" => "Tests retrieved successfully",
            "data" => $tests,
            "count" => count($tests)
        );
    }

    // Get test by ID
    private function getTestById($id)
    {
        if ($this->test->getTestById($id)) {
            return array(
                "success" => true,
                "message" => "Test found",
                "data" => array(
                    "test_id" => $this->test->test_id,
                    "name" => $this->test->name,
                    "price" => $this->test->price,
                    "photo" => $this->test->photo,
                    "date_created" => $this->test->date_created
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Test not found"
            );
        }
    }

    // Search tests
    private function searchTests($searchTerm)
    {
        $stmt = $this->test->searchTests($searchTerm);
        $tests = array();

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tests[] = array(
                "test_id" => $row['test_id'],
                "name" => $row['name'],
                "price" => $row['price'],
                "photo" => $row['photo'],
                "date_created" => $row['date_created']
            );
        }

        return array(
            "success" => true,
            "message" => "Search completed",
            "data" => $tests,
            "count" => count($tests),
            "search_term" => $searchTerm
        );
    }

    // Handle POST requests
    public function handlePost($data)
    {
        // Set test properties
        $this->test->name = $data->name ?? '';
        $this->test->price = $data->price ?? '';
        $this->test->photo = $data->photo ?? '';

        // Validate test data
        $errors = $this->test->validateTest();
        if (!empty($errors)) {
            return array(
                "success" => false,
                "message" => "Validation failed",
                "errors" => $errors
            );
        }

        if ($this->test->createTest()) {
            return array(
                "success" => true,
                "message" => "Test created successfully",
                "data" => array(
                    "test_id" => $this->test->test_id,
                    "name" => $this->test->name,
                    "price" => $this->test->price,
                    "photo" => $this->test->photo
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to create test"
            );
        }
    }

    // Handle PATCH requests
    public function handlePatch($data)
    {
        if (empty($data->test_id)) {
            return array(
                "success" => false,
                "message" => "Test ID is required"
            );
        }

        // Set test properties
        $this->test->test_id = $data->test_id;
        $this->test->name = $data->name ?? '';
        $this->test->price = $data->price ?? '';
        $this->test->photo = $data->photo ?? '';

        // Validate test data
        $errors = $this->test->validateTest();
        if (!empty($errors)) {
            return array(
                "success" => false,
                "message" => "Validation failed",
                "errors" => $errors
            );
        }

        if ($this->test->updateTest()) {
            return array(
                "success" => true,
                "message" => "Test updated successfully",
                "data" => array(
                    "test_id" => $this->test->test_id,
                    "name" => $this->test->name,
                    "price" => $this->test->price,
                    "photo" => $this->test->photo
                )
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to update test"
            );
        }
    }

    // Handle DELETE requests
    public function handleDelete($data)
    {
        if (empty($data->test_id)) {
            return array(
                "success" => false,
                "message" => "Test ID is required"
            );
        }

        $this->test->test_id = $data->test_id;

        // First, get the test data to retrieve the image path
        if (!$this->test->getTestById($data->test_id)) {
            return array(
                "success" => false,
                "message" => "Test not found"
            );
        }

        // Store the photo path for deletion
        $photoPath = $this->test->photo;

        // Delete the test from database
        if ($this->test->deleteTest()) {
            // Delete the associated image file if it exists
            if (!empty($photoPath)) {
                $this->deleteImageFile($photoPath);
            }

            return array(
                "success" => true,
                "message" => "Test and associated image deleted successfully"
            );
        } else {
            return array(
                "success" => false,
                "message" => "Unable to delete test"
            );
        }
    }

    // Delete image file from server
    private function deleteImageFile($photoPath)
    {
        try {
            // Handle different photo path formats
            $imagePath = '';

            if (strpos($photoPath, '/uploads/') !== false) {
                // If path already contains /uploads/, use it directly
                $imagePath = __DIR__ . '/..' . $photoPath;
            } elseif (strpos($photoPath, '/') === 0) {
                // If path starts with /, it's likely a relative path
                $imagePath = __DIR__ . '/../uploads' . $photoPath;
            } else {
                // If it's just a filename, prepend the uploads directory
                $imagePath = __DIR__ . '/../uploads/' . $photoPath;
            }

            // Normalize the path
            $imagePath = realpath($imagePath);

            // Security check: ensure the file is within the uploads directory
            $uploadsDir = realpath(__DIR__ . '/../uploads');
            if ($imagePath && $uploadsDir && strpos($imagePath, $uploadsDir) === 0) {
                if (file_exists($imagePath) && is_file($imagePath)) {
                    if (unlink($imagePath)) {
                        error_log("Successfully deleted image: " . $imagePath);
                        return true;
                    } else {
                        error_log("Failed to delete image: " . $imagePath);
                    }
                } else {
                    error_log("Image file not found: " . $imagePath);
                }
            } else {
                error_log("Security violation: Attempted to delete file outside uploads directory: " . $photoPath);
            }
        } catch (Exception $e) {
            error_log("Error deleting image file: " . $e->getMessage());
        }

        return false;
    }
}
?>