// API Configuration for Certus Admin
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://certusdiagnostics.in/api";
const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_BASE_URL || "https://certusdiagnostics.in/uploads";

export const API_ENDPOINTS = {
  // Admin endpoints
  adminGoogleAuth: `${API_BASE_URL}/admin-google-auth.php`,

  // Dashboard endpoints
  dashboard: `${API_BASE_URL}/dashboard.php`,

  // Patient endpoints
  patients: `${API_BASE_URL}/patients.php`,

  // Report endpoints
  reports: `${API_BASE_URL}/reports.php`,
  upload: `${API_BASE_URL}/upload.php`,

  // Upload URL builder
  getReportUrl: (filename) => `${UPLOAD_BASE_URL}/reports/${filename}`,
};

export default API_ENDPOINTS;
