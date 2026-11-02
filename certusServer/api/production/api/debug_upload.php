<?php
// Debug upload functionality
$uploadDir = __DIR__ . '/public/uploads/';
echo "Upload directory: " . $uploadDir . "\n";
echo "Realpath: " . realpath($uploadDir) . "\n";
echo "Directory exists: " . (file_exists($uploadDir) ? 'YES' : 'NO') . "\n";
echo "Directory writable: " . (is_writable($uploadDir) ? 'YES' : 'NO') . "\n";
echo "Current working directory: " . getcwd() . "\n";
echo "__DIR__: " . __DIR__ . "\n";
echo "Current user: " . get_current_user() . "\n";
echo "PHP upload max filesize: " . ini_get('upload_max_filesize') . "\n";
echo "PHP post max size: " . ini_get('post_max_size') . "\n";
echo "PHP file uploads enabled: " . (ini_get('file_uploads') ? 'YES' : 'NO') . "\n";

if (isset($_FILES['photo'])) {
    echo "File upload attempted:\n";
    echo "Original name: " . $_FILES['photo']['name'] . "\n";
    echo "File size: " . $_FILES['photo']['size'] . "\n";
    echo "File error: " . $_FILES['photo']['error'] . "\n";
    echo "Temp file: " . $_FILES['photo']['tmp_name'] . "\n";
    echo "Temp file exists: " . (file_exists($_FILES['photo']['tmp_name']) ? 'YES' : 'NO') . "\n";

    $uploadDir = __DIR__ . '/../public/uploads/';
    $filename = time() . '_test.jpg';
    $targetPath = $uploadDir . $filename;

    echo "Target path: " . $targetPath . "\n";

    if (move_uploaded_file($_FILES['photo']['tmp_name'], $targetPath)) {
        echo "Upload successful!\n";
        echo "File saved at: " . $targetPath . "\n";
    } else {
        echo "Upload failed!\n";
        echo "Error details: " . error_get_last()['message'] . "\n";
    }
} else {
    echo "No file upload detected.\n";
}
?>