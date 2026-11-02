<?php
require_once __DIR__ . '/../config/database.php';

class DashboardController
{
    private $conn;

    public function __construct()
    {
        $database = new Database();
        $this->conn = $database->getConnection();
        
        // Check if database connection was successful
        if ($this->conn === null) {
            throw new Exception('Database connection failed');
        }
    }

    public function handleRequest()
    {
        // CORS headers are already set in dashboard.php via cors.php
        // Just handle the request method
        
        $method = $_SERVER['REQUEST_METHOD'];

        switch ($method) {
            case 'GET':
                $this->getDashboardStats();
                break;

            default:
                http_response_code(405);
                echo json_encode([
                    'success' => false,
                    'error' => 'Method not allowed'
                ]);
                break;
        }
    }

    public function getDashboardStats()
    {
        try {
            // Get basic statistics first
            $totalPatients = $this->getTotalPatients();
            $testsToday = $this->getTestsToday();
            $pendingReports = $this->getPendingReports();
            $revenueToday = $this->getRevenueToday();
            $recentTests = $this->getRecentTests();

            // Get additional statistics
            $revenueThisWeek = $this->getRevenueThisWeek();
            $revenueThisMonth = $this->getRevenueThisMonth();
            $testsThisWeek = $this->getTestsThisWeek();
            $testsThisMonth = $this->getTestsThisMonth();

            // Calculate simple monthly growth
            $monthlyGrowth = [
                'patients' => 0,
                'revenue' => 0,
                'tests' => 0,
                'pendingReports' => -3 // Simple mock data for now
            ];

            echo json_encode([
                'success' => true,
                'data' => [
                    'totalPatients' => $totalPatients,
                    'testsToday' => $testsToday,
                    'pendingReports' => $pendingReports,
                    'revenueToday' => $revenueToday,
                    'recentTests' => $recentTests,
                    'monthlyGrowth' => $monthlyGrowth,
                    'revenueThisWeek' => $revenueThisWeek,
                    'revenueThisMonth' => $revenueThisMonth,
                    'testsThisWeek' => $testsThisWeek,
                    'testsThisMonth' => $testsThisMonth
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to fetch dashboard data: ' . $e->getMessage()
            ]);
        }
    }

    private function getTotalPatients()
    {
        $query = "SELECT COUNT(*) as total FROM patients";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getTestsToday()
    {
        $query = "SELECT COUNT(*) as total FROM reports WHERE DATE(test_date_time) = CURDATE()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getPendingReports()
    {
        // Since there's no status column, we'll assume reports without file are pending
        $query = "SELECT COUNT(*) as total FROM reports WHERE report_location IS NULL OR report_location = ''";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getRevenueToday()
    {
        $query = "SELECT COALESCE(SUM(price), 0) as total FROM reports WHERE DATE(test_date_time) = CURDATE()";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (float) $result['total'];
    }

    private function getRevenueThisWeek()
    {
        $query = "SELECT COALESCE(SUM(price), 0) as total FROM reports 
                  WHERE WEEK(test_date_time) = WEEK(CURDATE()) 
                  AND YEAR(test_date_time) = YEAR(CURDATE())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (float) $result['total'];
    }

    private function getRevenueThisMonth()
    {
        $query = "SELECT COALESCE(SUM(price), 0) as total FROM reports 
                  WHERE MONTH(test_date_time) = MONTH(CURDATE()) 
                  AND YEAR(test_date_time) = YEAR(CURDATE())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (float) $result['total'];
    }

    private function getTestsThisWeek()
    {
        $query = "SELECT COUNT(*) as total FROM reports 
                  WHERE WEEK(test_date_time) = WEEK(CURDATE()) 
                  AND YEAR(test_date_time) = YEAR(CURDATE())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getTestsThisMonth()
    {
        $query = "SELECT COUNT(*) as total FROM reports 
                  WHERE MONTH(test_date_time) = MONTH(CURDATE()) 
                  AND YEAR(test_date_time) = YEAR(CURDATE())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getRecentTests()
    {
        $query = "SELECT r.report_id, r.test_name, p.name as patient_name, 
                         r.test_date_time,
                         CASE 
                             WHEN r.report_location IS NOT NULL AND r.report_location != '' THEN 'Completed'
                             ELSE 'Pending'
                         END as status,
                         TIMESTAMPDIFF(HOUR, r.test_date_time, NOW()) as hours_ago
                  FROM reports r 
                  JOIN patients p ON r.patient_id = p.patient_id 
                  ORDER BY r.test_date_time DESC 
                  LIMIT 5";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getMonthlyGrowth()
    {
        // Calculate growth compared to previous month
        $currentMonth = [
            'patients' => $this->getCurrentMonthPatients(),
            'revenue' => $this->getRevenueThisMonth(),
            'tests' => $this->getTestsThisMonth(),
            'pendingReports' => $this->getPendingReports()
        ];

        $previousMonth = [
            'patients' => $this->getPreviousMonthPatients(),
            'revenue' => $this->getPreviousMonthRevenue(),
            'tests' => $this->getPreviousMonthTests(),
            'pendingReports' => $this->getPreviousMonthPendingReports()
        ];

        $growth = [];
        foreach ($currentMonth as $key => $current) {
            $previous = $previousMonth[$key];
            if ($previous > 0) {
                $growth[$key] = round((($current - $previous) / $previous) * 100, 1);
            } else {
                $growth[$key] = $current > 0 ? 100 : 0;
            }
        }

        return $growth;
    }

    private function getCurrentMonthPatients()
    {
        $query = "SELECT COUNT(*) as total FROM patients 
                  WHERE MONTH(created_at) = MONTH(CURDATE()) 
                  AND YEAR(created_at) = YEAR(CURDATE())";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getPreviousMonthPatients()
    {
        $query = "SELECT COUNT(*) as total FROM patients 
                  WHERE MONTH(created_at) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                  AND YEAR(created_at) = YEAR(CURDATE() - INTERVAL 1 MONTH)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getPreviousMonthRevenue()
    {
        $query = "SELECT COALESCE(SUM(price), 0) as total FROM reports 
                  WHERE MONTH(test_date_time) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                  AND YEAR(test_date_time) = YEAR(CURDATE() - INTERVAL 1 MONTH)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (float) $result['total'];
    }

    private function getPreviousMonthTests()
    {
        $query = "SELECT COUNT(*) as total FROM reports 
                  WHERE MONTH(test_date_time) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                  AND YEAR(test_date_time) = YEAR(CURDATE() - INTERVAL 1 MONTH)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }

    private function getPreviousMonthPendingReports()
    {
        // For pending reports, we'll count reports without files from previous month
        $query = "SELECT COUNT(*) as total FROM reports 
                  WHERE MONTH(test_date_time) = MONTH(CURDATE() - INTERVAL 1 MONTH) 
                  AND YEAR(test_date_time) = YEAR(CURDATE() - INTERVAL 1 MONTH)
                  AND (report_location IS NULL OR report_location = '')";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) $result['total'];
    }
}
?>