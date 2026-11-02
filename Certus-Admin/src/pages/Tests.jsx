import React, { useState, useEffect } from "react";
import NotificationModal from "../components/NotificationModal";
import { API_ENDPOINTS } from "../utils/api";

export default function Tests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // Fetch tests data from database
  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.reports, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tests data");
      }

      const data = await response.json();
      console.log("Tests data received:", data);

      if (data.success) {
        // Transform the data to match our component structure
        const transformedTests = data.data.map((report) => ({
          id: report.report_id, // Use report_id as the test ID
          patientName: report.patient_name,
          patientId: report.patient_id,
          testType: report.test_name,
          category: "General", // Default category since not in reports table
          orderDate: report.test_date_time
            ? report.test_date_time.split(" ")[0]
            : new Date().toISOString().split("T")[0],
          sampleDate: report.test_date_time
            ? report.test_date_time.split(" ")[0]
            : new Date().toISOString().split("T")[0],
          status: report.status,
          priority: "Normal", // Default as it's not in database
          technician: "Lab Tech", // Default as it's not in database
          cost: parseFloat(report.price) || 0,
          reportLocation: report.report_location, // Add report location for button logic
        }));

        setTests(transformedTests);
      } else {
        setError(data.message || "Failed to load tests");
      }
    } catch (err) {
      console.error("Error fetching tests:", err);
      setError("Failed to load tests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle viewing existing report
  const handleViewReport = (test) => {
    if (test.reportLocation) {
      // Open the report in a new tab using the correct server path
      const reportUrl = API_ENDPOINTS.getReportUrl(test.reportLocation);
      window.open(reportUrl, "_blank");
    }
  };

  // Handle uploading new report
  const handleUploadReport = (test) => {
    // Create a file input element
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf,.jpg,.jpeg,.png,.gif,.webp";
    fileInput.style.display = "none";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("photo", file);
        formData.append("report_id", test.id);

        const response = await fetch(API_ENDPOINTS.upload, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.status === "success") {
          // Refresh the tests list
          fetchTests();

          setNotification({
            type: "success",
            title: "Report Uploaded Successfully!",
            message:
              "The test report has been uploaded and the patient has been notified.",
            details: [
              { label: "Test ID", value: `#${test.id}` },
              { label: "Patient", value: test.patientName },
              { label: "Test Type", value: test.testType },
              {
                label: "Email Status",
                value: result.email_sent
                  ? "✅ Patient notified"
                  : "⚠️ Email failed",
              },
            ],
            actions: [
              {
                label: "View Report",
                handler: () => {
                  window.open(result.url, "_blank");
                },
                style: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
              },
            ],
          });
        } else {
          setNotification({
            type: "error",
            title: "Upload Failed",
            message: result.message || "Failed to upload the report file.",
            actions: [
              {
                label: "Try Again",
                handler: () => handleUploadReport(test),
                style: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error uploading report:", error);
        setNotification({
          type: "error",
          title: "Upload Error",
          message:
            "Unable to upload the report. Please check your connection and try again.",
          actions: [
            {
              label: "Retry",
              handler: () => handleUploadReport(test),
              style: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
            },
          ],
        });
      }
    };

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTest, setNewTest] = useState({
    patientId: "",
    testType: "",
    cost: "",
  });
  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || test.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        // Reset form
        setNewTest({
          patientId: "",
          testType: "",
          cost: "",
        });
        setShowAddModal(false);
        // Refresh the tests list
        fetchTests();

        // Show success notification
        setNotification({
          type: "success",
          title: "Test Added Successfully!",
          message: "The diagnostic test has been registered in the system.",
          details: [
            { label: "Test ID", value: `#${result.data?.id || "N/A"}` },
            {
              label: "Email Status",
              value: result.data?.email_sent
                ? "✅ Patient notified"
                : "⚠️ Email failed",
            },
            { label: "Status", value: "Ready for sample collection" },
          ],
          actions: [
            {
              label: "View Test",
              handler: () => {
                // Could navigate to test details or scroll to new test
                console.log("View test:", result.data?.id);
              },
              style: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
            },
            {
              label: "Add Another",
              handler: () => setShowAddModal(true),
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
        title: "Connection Error",
        message:
          "Unable to connect to the server. Please check your connection and try again.",
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

  const handleEditTest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.reports, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: editingTest.id,
          test_name: editingTest.testType,
          price: parseFloat(editingTest.cost),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setEditingTest(null);
        fetchTests();

        setNotification({
          type: "success",
          title: "Test Updated Successfully!",
          message: "The test details have been updated.",
          details: [
            { label: "Test ID", value: `#${editingTest.id}` },
            { label: "Test Name", value: editingTest.testType },
            { label: "Price", value: `₹${editingTest.cost}` },
          ],
        });
      } else {
        setNotification({
          type: "error",
          title: "Failed to Update Test",
          message:
            result.message || "An error occurred while updating the test.",
        });
      }
    } catch (error) {
      console.error("Error updating test:", error);
      setNotification({
        type: "error",
        title: "Connection Error",
        message: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTest = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this test?\n\nTest: ${editingTest.testType}\nPatient: ${editingTest.patientName}\n\nThis action cannot be undone.`
      )
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(API_ENDPOINTS.reports, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          report_id: editingTest.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowEditModal(false);
        setEditingTest(null);
        fetchTests();

        setNotification({
          type: "success",
          title: "Test Deleted Successfully!",
          message: "The test has been removed from the system.",
          details: [
            { label: "Test ID", value: `#${editingTest.id}` },
            { label: "Test Name", value: editingTest.testType },
          ],
        });
      } else {
        setNotification({
          type: "error",
          title: "Failed to Delete Test",
          message:
            result.message || "An error occurred while deleting the test.",
        });
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      setNotification({
        type: "error",
        title: "Connection Error",
        message: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Urgent":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Normal":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
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
        <div className="text-red-600 text-xl mb-4">Error Loading Tests</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <button
          onClick={fetchTests}
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
          <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
          <p className="text-gray-600">
            Manage diagnostic tests and procedures
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Test
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder="Search tests by patient, ID, or test type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-gray-600 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border bg-blue-600 text-white border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" className="bg-white text-gray-900">
                All Status
              </option>
              <option value="Pending" className="bg-white text-gray-900">
                Pending
              </option>
              <option value="Completed" className="bg-white text-gray-900">
                Completed
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {test.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {test.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {test.patientId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-700">
                        {test.testType}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-500">
                        Ordered: {test.orderDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        test.status
                      )}`}
                    >
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                        test.priority
                      )}`}
                    >
                      {test.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{test.cost.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-green-600 hover:text-green-900"
                        onClick={() => {
                          setEditingTest(test);
                          setShowEditModal(true);
                        }}
                      >
                        Edit
                      </button>
                      {test.reportLocation ? (
                        <button
                          className="text-purple-600 hover:text-purple-900"
                          onClick={() => handleViewReport(test)}
                        >
                          Report
                        </button>
                      ) : (
                        <button
                          className="text-orange-600 hover:text-orange-900"
                          onClick={() => handleUploadReport(test)}
                        >
                          Upload Report
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Test Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Test</h2>
              <button
                onClick={() => setShowAddModal(false)}
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
                  type="number"
                  required
                  value={newTest.patientId}
                  onChange={(e) =>
                    setNewTest({ ...newTest, patientId: e.target.value })
                  }
                  className=" w-full px-3 py-2 border text-gray-600 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient ID"
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
                  onClick={() => setShowAddModal(false)}
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

      {/* Edit Test Modal */}
      {showEditModal && editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Test</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTest(null);
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
            <form onSubmit={handleEditTest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test ID
                </label>
                <input
                  type="text"
                  disabled
                  value={editingTest.id}
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
                  value={editingTest.patientName}
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
                  value={editingTest.testType}
                  onChange={(e) =>
                    setEditingTest({ ...editingTest, testType: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 text-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter test name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={editingTest.cost}
                  onChange={(e) =>
                    setEditingTest({ ...editingTest, cost: e.target.value })
                  }
                  className="w-full text-gray-600 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter price"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleDeleteTest}
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {isSubmitting ? "Processing..." : "Delete Test"}
                </button>
                <div className="flex-1"></div>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTest(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 ${
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
                      Saving...
                    </div>
                  ) : (
                    "Save Changes"
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
