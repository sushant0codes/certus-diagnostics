import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import LoadingButton from "../components/LoadingButton";
import { API_BASE_URL, UPLOAD_BASE_URL } from "../config/api";

export default function YourReports() {
  const { isLoggedIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const [downloadingReports, setDownloadingReports] = useState({});

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/sign-in");
    }
  }, [isLoggedIn, loading, navigate]);

  const fetchUserReports = useCallback(async () => {
    setIsLoadingReports(true);
    try {
      // Fetch real reports from the server API
      const response = await fetch(`${API_BASE_URL}/reports.php`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      if (data.success) {
        // Filter reports for the current user and transform the data
        const userReports = data.data
          .filter((report) => report.patient_email === user?.email) // Filter by user email
          .map((report) => ({
            id: report.report_id,
            test_name: report.test_name,
            date: report.test_date_time
              ? report.test_date_time.split(" ")[0]
              : new Date().toISOString().split("T")[0],
            status: report.report_location ? "Ready" : "Pending",
            report_url: report.report_location,
            price: report.price,
          }));

        setReports(userReports);
      } else {
        console.error("Failed to fetch reports:", data.message);
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  }, [user?.email]);

  // Fetch user reports when user is logged in
  useEffect(() => {
    if (isLoggedIn && user) {
      fetchUserReports();
    }
  }, [isLoggedIn, user, fetchUserReports]);

  const downloadReport = async (reportUrl, testName, reportId) => {
    if (reportUrl) {
      setDownloadingReports((prev) => ({ ...prev, [reportId]: true }));

      try {
        // Construct the full URL to the report file
        const fullReportUrl = `${UPLOAD_BASE_URL}/reports/${reportUrl}`;

        // Create a temporary link element to trigger download
        const link = document.createElement("a");
        link.href = fullReportUrl;
        link.download = `${testName}_Report.pdf`;
        link.target = "_blank";

        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Small delay to simulate download process
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Download error:", error);
        alert(`Failed to download ${testName} report. Please try again.`);
      } finally {
        setDownloadingReports((prev) => ({ ...prev, [reportId]: false }));
      }
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <LoadingSpinner
          size="large"
          color="white"
          text="Checking authentication..."
        />
      </div>
    );
  }

  // Show redirecting message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <LoadingSpinner
          size="large"
          color="white"
          text="Redirecting to sign in..."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxkZWZzPgogICAgICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgogICAgICAgICAgICA8cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDIpIiBzdHJva2Utd2lkdGg9IjEiLz4KICAgICAgICA8L3BhdHRlcm4+CiAgICA8L2RlZnM+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPgogICAgPC9zdmc+')] opacity-30"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Your Reports
          </h1>
          <p className="text-gray-300 text-lg">
            Welcome back, {user?.name}! Here are your test reports.
          </p>
        </div>

        {/* Reports Section */}
        {isLoadingReports ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner
              size="large"
              color="white"
              text="Loading your reports..."
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {reports.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 text-center">
                <div className="text-gray-300 text-lg mb-4">
                  No reports found
                </div>
                <p className="text-gray-400">
                  Your test reports will appear here once they are ready.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {report.test_name}
                        </h3>
                        <div className="text-gray-300 space-y-1">
                          <p>
                            Date: {new Date(report.date).toLocaleDateString()}
                          </p>
                          <div className="flex items-center">
                            <span className="mr-2">Status:</span>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                report.status === "Ready"
                                  ? "bg-green-600 text-green-100"
                                  : report.status === "Pending"
                                  ? "bg-orange-600 text-orange-100"
                                  : "bg-yellow-600 text-yellow-100"
                              }`}
                            >
                              {report.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-3">
                        {report.status === "Ready" && report.report_url ? (
                          <LoadingButton
                            onClick={() =>
                              downloadReport(
                                report.report_url,
                                report.test_name,
                                report.id
                              )
                            }
                            isLoading={downloadingReports[report.id]}
                            loadingText="Downloading..."
                            color="gradient"
                            size="medium"
                            className="transform hover:scale-105"
                          >
                            Download Report
                          </LoadingButton>
                        ) : (
                          <span className="text-gray-400 px-6 py-2">
                            Report pending...
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
