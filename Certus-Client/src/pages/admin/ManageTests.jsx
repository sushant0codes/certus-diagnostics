import React, { useState, useEffect } from "react";
import { API_BASE_URL, UPLOAD_BASE_URL } from "../../config/api";

export default function ManageTests() {
  const [tests, setTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [packageSearchTerm, setPackageSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [packageLoading, setPackageLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddPackageForm, setShowAddPackageForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    photo: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    name: "",
    price: "",
    photo: "",
  });
  const [selectedPackageFile, setSelectedPackageFile] = useState(null);

  useEffect(() => {
    loadTests();
    loadPackages();
  }, []);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/tests`);
      const data = await response.json();

      if (data.success === true || data.status === "success") {
        setTests(data.data);
      } else {
        console.error("Error loading tests:", data.message);
        setTests([]);
      }
    } catch (error) {
      console.error("Error loading tests:", error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadPackages = async () => {
    try {
      setPackageLoading(true);
      const response = await fetch(`${API_BASE_URL}/packages`);
      const data = await response.json();

      if (data.status === "success") {
        setPackages(data.data);
      } else {
        console.error("Error loading packages:", data.message);
        setPackages([]);
      }
    } catch (error) {
      console.error("Error loading packages:", error);
      setPackages([]);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadTests();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/tests?search=${encodeURIComponent(searchTerm)}`
      );
      const data = await response.json();

      if (data.success === true || data.status === "success") {
        setTests(data.data);
      } else {
        console.error("Error searching tests:", data.message);
        setTests([]);
      }
    } catch (error) {
      console.error("Error searching tests:", error);
      setTests([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSearch = async () => {
    if (!packageSearchTerm.trim()) {
      loadPackages();
      return;
    }

    try {
      setPackageLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/packages?search=${encodeURIComponent(
          packageSearchTerm
        )}`
      );
      const data = await response.json();

      if (data.status === "success") {
        setPackages(data.data);
      } else {
        console.error("Error searching packages:", data.message);
        setPackages([]);
      }
    } catch (error) {
      console.error("Error searching packages:", error);
      setPackages([]);
    } finally {
      setPackageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePackageInputChange = (e) => {
    setPackageFormData({
      ...packageFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePackageFileChange = (e) => {
    setSelectedPackageFile(e.target.files[0]);
  };

  const uploadFile = async (file) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("photo", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Upload response:", data);

      if (data.status === "success") {
        return data.url;
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error(`Unable to save file on server: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Handle file upload if a file is selected
      let photoUrl = formData.photo;
      if (selectedFile) {
        photoUrl = await uploadFile(selectedFile);
      }

      const submitData = {
        ...formData,
        photo: photoUrl,
      };

      if (editingTest) {
        // Update existing test
        const response = await fetch(
          `${API_BASE_URL}/tests/${editingTest.test_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          }
        );

        const data = await response.json();
        if (data.success === true || data.status === "success") {
          loadTests(); // Reload tests from database
          setEditingTest(null);
          setShowAddForm(false);
        } else {
          alert("Error updating test: " + data.message);
        }
      } else {
        // Add new test
        const response = await fetch(`${API_BASE_URL}/tests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        const data = await response.json();
        if (data.success === true || data.status === "success") {
          loadTests(); // Reload tests from database
          setShowAddForm(false);
        } else {
          alert("Error creating test: " + data.message);
        }
      }

      // Reset form
      setFormData({
        name: "",
        price: "",
        photo: "",
      });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving test:", error);
      alert(error.message || "Error saving test. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();

    try {
      setPackageLoading(true);

      // Handle file upload if a file is selected
      let photoUrl = packageFormData.photo;
      if (selectedPackageFile) {
        photoUrl = await uploadFile(selectedPackageFile);
      }

      const submitData = {
        ...packageFormData,
        photo: photoUrl,
      };

      if (editingPackage) {
        // Update existing package
        const response = await fetch(
          `${API_BASE_URL}/packages/${editingPackage.package_id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(submitData),
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          loadPackages(); // Reload packages from database
          setEditingPackage(null);
          setShowAddPackageForm(false);
        } else {
          alert("Error updating package: " + data.message);
        }
      } else {
        // Add new package
        const response = await fetch(`${API_BASE_URL}/packages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submitData),
        });

        const data = await response.json();
        if (data.status === "success") {
          loadPackages(); // Reload packages from database
          setShowAddPackageForm(false);
        } else {
          alert("Error creating package: " + data.message);
        }
      }

      // Reset form
      setPackageFormData({
        name: "",
        price: "",
        photo: "",
      });
      setSelectedPackageFile(null);
    } catch (error) {
      console.error("Error saving package:", error);
      alert(error.message || "Error saving package. Please try again.");
    } finally {
      setPackageLoading(false);
    }
  };

  const handleEdit = (test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      price: test.price,
      photo: test.photo,
    });
    setSelectedFile(null);
    setShowAddForm(true);
  };

  const handlePackageEdit = (packageItem) => {
    setEditingPackage(packageItem);
    setPackageFormData({
      name: packageItem.name,
      price: packageItem.price,
      photo: packageItem.photo,
    });
    setSelectedPackageFile(null);
    setShowAddPackageForm(true);
  };

  const handleDelete = async (testId) => {
    if (window.confirm("Are you sure you want to delete this test?")) {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.success === true || data.status === "success") {
          loadTests(); // Reload tests from database
        } else {
          alert("Error deleting test: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting test:", error);
        alert("Error deleting test. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePackageDelete = async (packageId) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      try {
        setPackageLoading(true);
        const response = await fetch(`${API_BASE_URL}/packages/${packageId}`, {
          method: "DELETE",
        });

        const data = await response.json();
        if (data.status === "success") {
          loadPackages(); // Reload packages from database
        } else {
          alert("Error deleting package: " + data.message);
        }
      } catch (error) {
        console.error("Error deleting package:", error);
        alert("Error deleting package. Please try again.");
      } finally {
        setPackageLoading(false);
      }
    }
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Tests</h1>
          <p className="text-lg text-gray-300">
            Add, edit, and manage diagnostic tests
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500 transition-colors"
        >
          Add New Test
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-slate-800 p-6 rounded-lg mb-6">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by test name or ID..."
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
              loadTests();
            }}
            className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
          >
            Reset
          </button>
        </div>

        {/* Tests List */}
        <div className="space-y-4">
          {tests.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No tests found</p>
          ) : (
            tests.map((test) => (
              <div
                key={test.test_id}
                className="bg-slate-700 p-4 rounded flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  {/* Test Image */}
                  <div className="w-20 h-16 bg-slate-600 rounded overflow-hidden flex-shrink-0">
                    {test.photo ? (
                      <img
                        src={test.photo}
                        alt={test.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-slate-600 flex items-center justify-center"
                      style={{ display: test.photo ? "none" : "flex" }}
                    >
                      <span className="text-gray-400 text-xs">IMG</span>
                    </div>
                  </div>

                  {/* Test Info */}
                  <div>
                    <h3 className="text-lg font-medium">{test.name}</h3>
                    <p className="text-gray-300">ID: {test.test_id}</p>
                    <p className="text-green-400 font-semibold">
                      ₹{test.price}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(test)}
                    className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(test.test_id)}
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Manage Packages Section */}
      <div className="mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Packages</h1>
            <p className="text-lg text-gray-300">
              Add, edit, and manage test packages
            </p>
          </div>
          <button
            onClick={() => setShowAddPackageForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-500 transition-colors"
          >
            Add New Package
          </button>
        </div>

        {/* Package Search Section */}
        <div className="bg-slate-800 p-6 rounded-lg mb-6">
          <div className="flex gap-4 mb-6">
            <input
              type="text"
              value={packageSearchTerm}
              onChange={(e) => setPackageSearchTerm(e.target.value)}
              placeholder="Search by package name or ID..."
              className="flex-1 p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
            />
            <button
              onClick={handlePackageSearch}
              disabled={packageLoading}
              className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {packageLoading ? "Searching..." : "Search"}
            </button>
            <button
              onClick={() => {
                setPackageSearchTerm("");
                loadPackages();
              }}
              className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
            >
              Reset
            </button>
          </div>

          {/* Packages List */}
          <div className="space-y-4">
            {packages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                No packages found
              </p>
            ) : (
              packages.map((packageItem) => (
                <div
                  key={packageItem.package_id}
                  className="bg-slate-700 p-4 rounded flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {/* Package Image */}
                    <div className="w-20 h-16 bg-slate-600 rounded overflow-hidden flex-shrink-0">
                      {packageItem.photo ? (
                        <img
                          src={packageItem.photo}
                          alt={packageItem.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : null}
                      <div
                        className="w-full h-full bg-slate-600 flex items-center justify-center"
                        style={{ display: packageItem.photo ? "none" : "flex" }}
                      >
                        <span className="text-gray-400 text-xs">PKG</span>
                      </div>
                    </div>

                    {/* Package Info */}
                    <div>
                      <h3 className="text-lg font-medium">
                        {packageItem.name}
                      </h3>
                      <p className="text-gray-300">
                        ID: {packageItem.package_id}
                      </p>
                      <p className="text-green-400 font-semibold">
                        ₹{packageItem.price}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePackageEdit(packageItem)}
                      className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary/90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        handlePackageDelete(packageItem.package_id)
                      }
                      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Test Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingTest ? "Edit Test" : "Add New Test"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Test Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  placeholder="Enter test name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Photo Upload (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {editingTest && editingTest.photo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Current image:</p>
                    <img
                      src={editingTest.photo}
                      alt="Current"
                      className="w-20 h-16 object-cover rounded mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTest(null);
                    setFormData({
                      name: "",
                      price: "",
                      photo: "",
                    });
                    setSelectedFile(null);
                  }}
                  className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
                >
                  {editingTest ? "Update Test" : "Add Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Package Form Modal */}
      {showAddPackageForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-8 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-6">
              {editingPackage ? "Edit Package" : "Add New Package"}
            </h2>

            <form onSubmit={handlePackageSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Package Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={packageFormData.name}
                  onChange={handlePackageInputChange}
                  required
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  placeholder="Enter package name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={packageFormData.price}
                  onChange={handlePackageInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Photo Upload (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePackageFileChange}
                  className="w-full p-3 bg-slate-700 rounded border border-gray-600 focus:border-primary focus:outline-none text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {editingPackage && editingPackage.photo && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">Current image:</p>
                    <img
                      src={editingPackage.photo}
                      alt="Current"
                      className="w-20 h-16 object-cover rounded mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddPackageForm(false);
                    setEditingPackage(null);
                    setPackageFormData({
                      name: "",
                      price: "",
                      photo: "",
                    });
                    setSelectedPackageFile(null);
                  }}
                  className="bg-slate-600 text-white px-6 py-3 rounded hover:bg-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-3 rounded hover:bg-primary/90"
                >
                  {editingPackage ? "Update Package" : "Add Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
