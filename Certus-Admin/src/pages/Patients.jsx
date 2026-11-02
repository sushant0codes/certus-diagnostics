import React, { useState, useEffect } from "react";
import NotificationModal from "../components/NotificationModal";
import { API_ENDPOINTS } from "../utils/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  // Helper function to format date from yyyy-mm-dd to dd-mm-yyyy
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to format date from yyyy-mm-dd to dd/mm/yyyy (with slashes)
  const formatDateWithSlashes = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Helper function to convert dd/mm/yyyy back to yyyy-mm-dd
  const convertDateToISO = (dateString) => {
    if (!dateString || dateString.length !== 10) return "";
    const [day, month, year] = dateString.split("/");
    if (!day || !month || !year) return "";
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Fetch patients from database
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.patients, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data = await response.json();
      console.log("Patients data received:", data);

      if (data.success) {
        // Transform the data to match our component structure
        const transformedPatients = data.data.map((patient) => {
          // Handle name field - it might be stored as 'name' or need to be constructed from first/last names
          let patientName = patient.name || "";
          if (!patientName && (patient.first_name || patient.last_name)) {
            patientName = `${patient.first_name || ""} ${
              patient.last_name || ""
            }`.trim();
          }
          // Fallback to email username if no name available
          if (!patientName && patient.email) {
            patientName = patient.email.split("@")[0];
          }

          return {
            id: patient.patient_id,
            name: patientName || "Unknown",
            email: patient.email || "",
            phone: patient.phone || "",
            dob: patient.dob || "",
            gender: patient.gender || "",
            lastVisit: formatDate(
              patient.created_at
                ? patient.created_at.split(" ")[0]
                : new Date().toISOString().split("T")[0]
            ),
            status: "Active", // Default status
          };
        });

        setPatients(transformedPatients);
      } else {
        setError(data.message || "Failed to load patients");
      }
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Failed to load patients. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editPatient, setEditPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });
  const [editDobDisplay, setEditDobDisplay] = useState("");
  const [showAddTestModal, setShowAddTestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTest, setNewTest] = useState({
    patientId: "",
    testType: "",
    cost: "",
  });

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  // Handle view patient
  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  // Handle edit patient
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setEditPatient({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      dob: patient.dob,
      gender: patient.gender,
    });
    setEditDobDisplay(formatDateWithSlashes(patient.dob));
    setShowEditModal(true);
  };

  // Handle update patient
  const handleUpdatePatient = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_ENDPOINTS.patients, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          name: editPatient.name,
          email: editPatient.email,
          phone: editPatient.phone,
          dob: editPatient.dob,
          gender: editPatient.gender,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert("Patient updated successfully!");
        setShowEditModal(false);
        setSelectedPatient(null);
        setEditDobDisplay("");
        // Refresh the patients list
        fetchPatients();
      } else {
        alert("Failed to update patient: " + result.message);
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Failed to update patient. Please try again.");
    }
  };

  // Handle add test for patient
  const handleAddTestForPatient = (patient) => {
    setSelectedPatient(patient);
    setNewTest({
      patientId: patient.id,
      testType: "",
      cost: "",
    });
    setShowAddTestModal(true);
  };

  // Handle add test submission
  const handleAddTest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.reports, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: parseInt(newTest.patientId),
          test_name: newTest.testType,
          price: parseFloat(newTest.cost),
          test_date_time: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setNewTest({
          patientId: "",
          testType: "",
          cost: "",
        });
        setShowAddTestModal(false);
        setSelectedPatient(null);

        // Show success notification
        setNotification({
          type: "success",
          title: "Test Added Successfully!",
          message: `The diagnostic test has been registered for ${selectedPatient.name}.`,
          details: [
            { label: "Test ID", value: `#${result.data?.id || "N/A"}` },
            {
              label: "Email Status",
              value: result.data?.email_sent
                ? "✅ Patient notified"
                : "⚠️ Email failed",
            },
            { label: "Patient", value: selectedPatient.name },
            { label: "Status", value: "Ready for sample collection" },
          ],
          actions: [
            {
              label: "Add Another Test",
              handler: () => {
                setShowAddTestModal(true);
                setSelectedPatient(selectedPatient);
                setNewTest({
                  patientId: selectedPatient.id,
                  testType: "",
                  cost: "",
                });
              },
              style: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
            },
          ],
        });
      } else {
        setNotification({
          type: "error",
          title: "Failed to Add Test",
          message:
            result.message ||
            "An unexpected error occurred while adding the test.",
          actions: [
            {
              label: "Try Again",
              handler: () => {
                // Keep the modal open for retry
              },
              closeAfter: false,
              style: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error adding test:", error);
      setNotification({
        type: "error",
        title: "Error Adding Test",
        message:
          "Failed to add test. Please check your connection and try again.",
        actions: [
          {
            label: "Retry",
            handler: () => {
              // Keep the modal open for retry
            },
            closeAfter: false,
            style: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
          },
        ],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96">
        <div className="text-red-600 text-xl mb-4">Error Loading Patients</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchPatients}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600">
            Manage patient records and information
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search patients by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-gray-600 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {patient.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {patient.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        DOB: {formatDate(patient.dob)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.gender}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        patient.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAddTestForPatient(patient)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Add Test
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Patient Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Patient Details
              </h2>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedPatient(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.id}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.email}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.phone}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {formatDate(selectedPatient.dob) || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.gender || "Not provided"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Visit
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {selectedPatient.lastVisit}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedPatient.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedPatient.status}
                  </span>
                </div>
              </div>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedPatient(null);
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Patient</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedPatient(null);
                  setEditDobDisplay("");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form
              onSubmit={handleUpdatePatient}
              className="space-y-4 text-gray-600"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <div className="text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">
                  {selectedPatient.id} (Read-only)
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={editPatient.name}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editPatient.email}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={editPatient.phone}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="text"
                  placeholder="DD/MM/YYYY"
                  value={editDobDisplay}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

                    // Limit to 8 digits (DDMMYYYY)
                    if (value.length > 8) {
                      value = value.substring(0, 8);
                    }

                    // Auto-format as user types: DD/MM/YYYY
                    let formattedValue = value;
                    if (value.length >= 2) {
                      formattedValue =
                        value.substring(0, 2) + "/" + value.substring(2);
                    }
                    if (value.length >= 4) {
                      formattedValue =
                        value.substring(0, 2) +
                        "/" +
                        value.substring(2, 4) +
                        "/" +
                        value.substring(4);
                    }

                    // Update the display state
                    setEditDobDisplay(formattedValue);

                    // Convert complete dd/mm/yyyy back to yyyy-mm-dd for API
                    if (
                      formattedValue.length === 10 &&
                      formattedValue.includes("/")
                    ) {
                      const isoDate = convertDateToISO(formattedValue);
                      if (isoDate) {
                        setEditPatient({ ...editPatient, dob: isoDate });
                      }
                    }
                  }}
                  maxLength={10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={editPatient.gender}
                  onChange={(e) =>
                    setEditPatient({ ...editPatient, gender: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedPatient(null);
                    setEditDobDisplay("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Test Modal */}
      {showAddTestModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Add Test for {selectedPatient.name}
              </h2>
              <button
                onClick={() => {
                  setShowAddTestModal(false);
                  setSelectedPatient(null);
                  setNewTest({
                    patientId: "",
                    testType: "",
                    cost: "",
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedPatient.id}
                  className="w-full px-3 py-2 border text-gray-500 bg-gray-100 border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  disabled
                  value={selectedPatient.name}
                  className="w-full px-3 py-2 border text-gray-500 bg-gray-100 border-gray-300 rounded-lg cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  required
                  value={newTest.testType}
                  onChange={(e) =>
                    setNewTest({ ...newTest, testType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter test name (e.g., Blood Sugar Test, CBC)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (₹)
                </label>
                <input
                  type="number"
                  required
                  value={newTest.cost}
                  onChange={(e) =>
                    setNewTest({ ...newTest, cost: e.target.value })
                  }
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter cost amount"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddTestModal(false);
                    setSelectedPatient(null);
                    setNewTest({
                      patientId: "",
                      testType: "",
                      cost: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Adding Test...
                    </div>
                  ) : (
                    "Add Test"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      <NotificationModal
        notification={notification}
        onClose={() => setNotification(null)}
      />
    </div>
  );
}
