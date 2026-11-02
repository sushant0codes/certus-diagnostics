import { createContext, useContext, useState, useEffect } from "react";

// Create the AdminAuthContext
const AdminAuthContext = createContext();

// Custom hook to use the AdminAuthContext
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
};

// AdminAuthProvider component
export const AdminAuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const loggedIn = localStorage.getItem("adminIsLoggedIn");
      const adminData = localStorage.getItem("adminUser");

      if (loggedIn === "true" && adminData) {
        const parsedAdmin = JSON.parse(adminData);
        setIsLoggedIn(true);
        setAdmin(parsedAdmin);
      } else {
        setIsLoggedIn(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error("Error checking admin auth status:", error);
      // Clear invalid data
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminIsLoggedIn");
      setIsLoggedIn(false);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (adminData) => {
    try {
      localStorage.setItem("adminUser", JSON.stringify(adminData));
      localStorage.setItem("adminIsLoggedIn", "true");
      setIsLoggedIn(true);
      setAdmin(adminData);
    } catch (error) {
      console.error("Error during admin login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminIsLoggedIn");
    setIsLoggedIn(false);
    setAdmin(null);
  };

  const updateAdmin = (updatedAdminData) => {
    try {
      const newAdminData = { ...admin, ...updatedAdminData };
      localStorage.setItem("adminUser", JSON.stringify(newAdminData));
      setAdmin(newAdminData);
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  // Context value
  const value = {
    isLoggedIn,
    admin,
    loading,
    login,
    logout,
    updateAdmin,
    checkAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
