<?php
class PackageController
{
    private $db;
    private $package;

    public function __construct($database)
    {
        $this->db = $database;
        $this->package = new Package($this->db);
    }

    // Get all packages
    public function getAllPackages()
    {
        try {
            $stmt = $this->package->getAll();
            $packages = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $package_item = array(
                    'package_id' => $package_id,
                    'name' => $name,
                    'price' => $price,
                    'photo' => $photo,
                    'date_created' => $date_created
                );

                array_push($packages, $package_item);
            }

            return array(
                'status' => 'success',
                'data' => $packages
            );

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to fetch packages: ' . $e->getMessage()
            );
        }
    }

    // Get single package
    public function getPackageById($id)
    {
        try {
            if ($this->package->getById($id)) {
                $package_item = array(
                    'package_id' => $this->package->package_id,
                    'name' => $this->package->name,
                    'price' => $this->package->price,
                    'photo' => $this->package->photo,
                    'date_created' => $this->package->date_created
                );

                return array(
                    'status' => 'success',
                    'data' => $package_item
                );
            } else {
                return array(
                    'status' => 'error',
                    'message' => 'Package not found'
                );
            }

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to fetch package: ' . $e->getMessage()
            );
        }
    }

    // Create package
    public function createPackage($data)
    {
        try {
            // Validate required fields
            if (empty($data['name']) || empty($data['price'])) {
                return array(
                    'status' => 'error',
                    'message' => 'Name and price are required'
                );
            }

            // Validate price is numeric
            if (!is_numeric($data['price']) || $data['price'] < 0) {
                return array(
                    'status' => 'error',
                    'message' => 'Price must be a valid positive number'
                );
            }

            $this->package->name = $data['name'];
            $this->package->price = $data['price'];
            $this->package->photo = isset($data['photo']) ? $data['photo'] : '';

            if ($this->package->create()) {
                return array(
                    'status' => 'success',
                    'message' => 'Package created successfully',
                    'data' => array(
                        'package_id' => $this->package->package_id,
                        'name' => $this->package->name,
                        'price' => $this->package->price,
                        'photo' => $this->package->photo
                    )
                );
            } else {
                return array(
                    'status' => 'error',
                    'message' => 'Failed to create package'
                );
            }

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to create package: ' . $e->getMessage()
            );
        }
    }

    // Update package
    public function updatePackage($id, $data)
    {
        try {
            // Check if package exists
            if (!$this->package->getById($id)) {
                return array(
                    'status' => 'error',
                    'message' => 'Package not found'
                );
            }

            // Validate required fields
            if (empty($data['name']) || empty($data['price'])) {
                return array(
                    'status' => 'error',
                    'message' => 'Name and price are required'
                );
            }

            // Validate price is numeric
            if (!is_numeric($data['price']) || $data['price'] < 0) {
                return array(
                    'status' => 'error',
                    'message' => 'Price must be a valid positive number'
                );
            }

            $this->package->package_id = $id;
            $this->package->name = $data['name'];
            $this->package->price = $data['price'];
            $this->package->photo = isset($data['photo']) ? $data['photo'] : $this->package->photo;

            if ($this->package->update()) {
                return array(
                    'status' => 'success',
                    'message' => 'Package updated successfully',
                    'data' => array(
                        'package_id' => $this->package->package_id,
                        'name' => $this->package->name,
                        'price' => $this->package->price,
                        'photo' => $this->package->photo
                    )
                );
            } else {
                return array(
                    'status' => 'error',
                    'message' => 'Failed to update package'
                );
            }

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to update package: ' . $e->getMessage()
            );
        }
    }

    // Delete package
    public function deletePackage($id)
    {
        try {
            // Check if package exists
            if (!$this->package->getById($id)) {
                return array(
                    'status' => 'error',
                    'message' => 'Package not found'
                );
            }

            $this->package->package_id = $id;

            if ($this->package->delete()) {
                return array(
                    'status' => 'success',
                    'message' => 'Package deleted successfully'
                );
            } else {
                return array(
                    'status' => 'error',
                    'message' => 'Failed to delete package'
                );
            }

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to delete package: ' . $e->getMessage()
            );
        }
    }

    // Search packages
    public function searchPackages($searchTerm)
    {
        try {
            if (empty($searchTerm)) {
                return $this->getAllPackages();
            }

            $stmt = $this->package->search($searchTerm);
            $packages = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);

                $package_item = array(
                    'package_id' => $package_id,
                    'name' => $name,
                    'price' => $price,
                    'photo' => $photo,
                    'date_created' => $date_created
                );

                array_push($packages, $package_item);
            }

            return array(
                'status' => 'success',
                'data' => $packages
            );

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to search packages: ' . $e->getMessage()
            );
        }
    }

    // Get package count
    public function getPackageCount()
    {
        try {
            $count = $this->package->getCount();
            return array(
                'status' => 'success',
                'data' => array('count' => $count)
            );

        } catch (Exception $e) {
            return array(
                'status' => 'error',
                'message' => 'Failed to get package count: ' . $e->getMessage()
            );
        }
    }
}
?>