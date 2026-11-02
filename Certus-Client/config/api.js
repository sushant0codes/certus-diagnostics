// Production API Configuration for Certus Diagnostics Client
const API_CONFIG = {
  // Base API URL - Using production URL
  BASE_URL: "https://certusdiagnostics.in/api",

  // For local development, uncomment this line:
  // BASE_URL: "http://localhost/certusServer/api",

  // Upload URL for reports and images
  UPLOAD_BASE_URL: "https://certusdiagnostics.in/uploads",

  // For local development, uncomment this line:
  // UPLOAD_BASE_URL: "http://localhost/certusServer/public/uploads",

  // API Endpoints
  ENDPOINTS: {
    PATIENTS: "/patients.php",
    REPORTS: "/reports.php",
    TESTS: "/tests.php",
    PACKAGES: "/packages.php",
    UPLOAD: "/upload.php",
    GOOGLE_AUTH: "/google-auth.php",
    DOWNLOAD_REPORT: "/download-report.php",
  },

  // File paths
  REPORT_PATH: "/reports",
  IMAGE_PATH: "/images",

  // Production domain settings
  PRODUCTION: {
    CLIENT_DOMAIN: "https://certusdiagnostics.in",
    ADMIN_DOMAIN: "https://admin.certusdiagnostics.in",
    API_DOMAIN: "https://certusdiagnostics.in/api",
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get upload URL
export const getUploadUrl = (path) => {
  return `${API_CONFIG.UPLOAD_BASE_URL}${path}`;
};

// Helper function to get report download URL
export const getReportUrl = (filename) => {
  return `${API_CONFIG.UPLOAD_BASE_URL}/reports/${filename}`;
};

// Helper function to get test/package image URL
export const getImageUrl = (filename) => {
  return `${API_CONFIG.BASE_URL}/../public${filename}`;
};

export default API_CONFIG;
