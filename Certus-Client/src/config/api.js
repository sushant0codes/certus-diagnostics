// API Configuration
// This file provides centralized API endpoint configuration based on environment

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://certusdiagnostics.in/api";
const UPLOAD_BASE_URL =
  import.meta.env.VITE_UPLOAD_BASE_URL ||
  "https://certusdiagnostics.in/uploads";

export { API_BASE_URL, UPLOAD_BASE_URL };

// Usage in components:
// import { API_BASE_URL } from '../config/api';
// const response = await fetch(`${API_BASE_URL}/google-auth.php`, {...});
