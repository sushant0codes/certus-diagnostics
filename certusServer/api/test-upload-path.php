<?php
// Test script to verify upload paths and file existence

require_once __DIR__ . '/config/environment.php';

header('Content-Type: application/json');

$uploadDir = UPLOAD_PATH . '/reports/';
$testFile = '1761131924674.pdf'; // The file from your last upload
$fullPath = $uploadDir . $testFile;

$response = array(
    'environment' => ENVIRONMENT,
    'upload_path_constant' => UPLOAD_PATH,
    'upload_dir' => $uploadDir,
    'test_file_path' => $fullPath,
    'upload_url_constant' => UPLOAD_URL,
    'checks' => array(
        'upload_path_exists' => file_exists(UPLOAD_PATH),
        'upload_dir_exists' => file_exists($uploadDir),
        'upload_dir_is_writable' => is_writable($uploadDir),
        'test_file_exists' => file_exists($fullPath),
        'test_file_readable' => is_readable($fullPath)
    )
);

// List all files in the directory
if (file_exists($uploadDir) && is_dir($uploadDir)) {
    $files = scandir($uploadDir);
    $response['files_in_directory'] = array_diff($files, array('.', '..'));
} else {
    $response['files_in_directory'] = 'Directory does not exist';
}

// Get real path
$response['real_paths'] = array(
    'upload_path' => realpath(UPLOAD_PATH),
    'upload_dir' => realpath($uploadDir),
    'current_dir' => __DIR__,
    'document_root' => $_SERVER['DOCUMENT_ROOT'] ?? 'not set'
);

echo json_encode($response, JSON_PRETTY_PRINT);
?>
