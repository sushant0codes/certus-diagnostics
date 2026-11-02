import React, { useState, useEffect } from "react";
import ApiService from "../../utils/api.js";

export default function SearchPatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    // Load patients from API on component mount
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllPatients();
      if (response.success) {
        setPatients(response.data);
      } else {
        console.error("Failed to load patients:", response.message);
        // Fallback to mock data if API fails
        setPatients([]);
      }
    } catch (error) {
      console.error("Error loading patients:", error);
      // Fallback to mock data if API fails
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadPatients(); // Load all patients if search term is empty
      return;
    }

    try {
      setLoading(true);
      const response = await ApiService.searchPatients(searchTerm);
      if (response.success) {
        setPatients(response.data);
      } else {
        console.error("Search failed:", response.message);
        setPatients([]);
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingPatient) {
        // Update existing patient
        const response = await ApiService.updatePatient(
          editingPatient.patient_id,
          formData
        );
        if (response.success) {
          await loadPatients(); // Reload all patients from API
          setEditingPatient(null);
          setShowAddForm(false);
        } else {
          alert("Error updating patient: " + response.message);
        }
      } else {
        // Add new patient
        const response = await ApiService.createPatient(formData);
        if (response.success) {
          await loadPatients(); // Reload all patients from API
          setShowAddForm(false);
        } else {
          alert("Error creating patient: " + response.message);
        }
      }

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
      });
    } catch (error) {
      console.error("Error saving patient:", error);
      alert("Error saving patient. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      first_name: patient.first_name,
      last_name: patient.last_name,
      email: patient.email,
      phone: patient.phone,
      dob: patient.dob,
      gender: patient.gender,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (patientId) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        setLoading(true);
        const response = await ApiService.deletePatient(patientId);
        if (response.success) {
          await loadPatients(); // Reload all patients from API
        } else {
          alert("Error deleting patient: " + response.message);
        }
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Error deleting patient. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Search Patients</h1>
          <p className="text-lg text-gray-300">
            Find and manage patient records
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500 transition-colors"
        >
          Add New Patient
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, ID, email, or phone..."
            className="flex-1 p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={() => {
              setSearchTerm("");
              loadPatients(); // Reload all patients from API
            }}
            className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
          >
            Reset
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {patients.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No patients found</p>
          ) : (
            patients.map((patient) => (
              <div
                key={patient.patient_id}
                className="bg-slate-700 p-4 rounded"
              >
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                    <div>
                      <h3 className="text-lg font-medium">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <p className="text-gray-300">ID: {patient.patient_id}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">Email: {patient.email}</p>
                      <p className="text-gray-300">Phone: {patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-300">DOB: {patient.dob}</p>
                      <p className="text-gray-300">Gender: {patient.gender}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(patient)}
                      className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.patient_id)}
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Patient Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg w-full max-w-2xl mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingPatient ? "Edit Patient" : "Add New Patient"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingPatient(null);
                    setFormData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      dob: "",
                      gender: "",
                    });
                  }}
                  className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
                >
                  {editingPatient ? "Update Patient" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
