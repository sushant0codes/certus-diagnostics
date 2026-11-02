<?php
// RESTful API endpoint for package management

// Handle CORS headers dynamically
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'https://certusdiagnostics.in',
    'https://www.certusdiagnostics.in',
    'https://admin.certusdiagnostics.in'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once __DIR__ . '/../config/database.php';
include_once __DIR__ . '/../models/Package.php';
include_once __DIR__ . '/../controllers/PackageController.php';

// Initialize database connection
$database = new Database();
$db = $database->getConnection();

// Initialize controller
$packageController = new PackageController($db);

// Get HTTP method and request data
$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

// Get package ID from URL if present
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$path_parts = explode('/', $path);
$package_id = null;

// Extract package ID from URL like /api/packages/123
for ($i = 0; $i < count($path_parts); $i++) {
    if ($path_parts[$i] === 'packages' && isset($path_parts[$i + 1]) && is_numeric($path_parts[$i + 1])) {
        $package_id = (int) $path_parts[$i + 1];
        break;
    }
}

// Get search parameter from query string
$search = isset($_GET['search']) ? $_GET['search'] : '';

try {
    switch ($method) {
        case 'GET':
            if ($package_id) {
                // Get single package
                $result = $packageController->getPackageById($package_id);
            } else if (!empty($search)) {
                // Search packages
                $result = $packageController->searchPackages($search);
            } else {
                // Get all packages
                $result = $packageController->getAllPackages();
            }
            break;

        case 'POST':
            // Create new package
            if (!$input) {
                $result = array(
                    'status' => 'error',
                    'message' => 'Invalid JSON data'
                );
            } else {
                $result = $packageController->createPackage($input);
            }
            break;

        case 'PATCH':
            // Update package
            if (!$package_id) {
                $result = array(
                    'status' => 'error',
                    'message' => 'Package ID is required for update'
                );
            } else if (!$input) {
                $result = array(
                    'status' => 'error',
                    'message' => 'Invalid JSON data'
                );
            } else {
                $result = $packageController->updatePackage($package_id, $input);
            }
            break;

        case 'DELETE':
            // Delete package
            if (!$package_id) {
                $result = array(
                    'status' => 'error',
                    'message' => 'Package ID is required for deletion'
                );
            } else {
                $result = $packageController->deletePackage($package_id);
            }
            break;

        default:
            $result = array(
                'status' => 'error',
                'message' => 'Method not allowed'
            );
            http_response_code(405);
            break;
    }

    // Set appropriate HTTP status code
    if ($result['status'] === 'error') {
        if (!headers_sent()) {
            http_response_code(400);
        }
    }

    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array(
        'status' => 'error',
        'message' => 'Server error: ' . $e->getMessage()
    ));
}
?>