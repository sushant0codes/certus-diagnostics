// API utility functions for backend communication
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://certusdiagnostics.in";

class ApiService {
  // Generic request handler
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Patient API methods
  async getAllPatients() {
    return this.request("/api/patients");
  }

  async getDashboardStats() {
    return this.request("/api/patients?stats=true");
  }

  async getPatientById(id) {
    return this.request(`/api/patients?id=${id}`);
  }

  async searchPatients(searchTerm) {
    return this.request(
      `/api/patients?search=${encodeURIComponent(searchTerm)}`
    );
  }

  async createPatient(patientData) {
    return this.request("/api/patients", {
      method: "POST",
      body: JSON.stringify(patientData),
    });
  }

  async updatePatient(id, patientData) {
    return this.request("/api/patients", {
      method: "PATCH",
      body: JSON.stringify({ ...patientData, patient_id: id }),
    });
  }

  async deletePatient(id) {
    return this.request("/api/patients", {
      method: "DELETE",
      body: JSON.stringify({ patient_id: id }),
    });
  }

  // Test API methods
  async getAllTests() {
    return this.request("/api/tests");
  }

  async getTestById(id) {
    return this.request(`/api/tests?id=${id}`);
  }

  async searchTests(searchTerm) {
    return this.request(`/api/tests?search=${encodeURIComponent(searchTerm)}`);
  }

  async createTest(testData) {
    return this.request("/api/tests", {
      method: "POST",
      body: JSON.stringify(testData),
    });
  }

  async updateTest(id, testData) {
    return this.request("/api/tests", {
      method: "PATCH",
      body: JSON.stringify({ ...testData, test_id: id }),
    });
  }

  async deleteTest(id) {
    return this.request("/api/tests", {
      method: "DELETE",
      body: JSON.stringify({ test_id: id }),
    });
  }
}

export default new ApiService();
