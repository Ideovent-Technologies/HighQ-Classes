import React, { useState, useEffect, useCallback } from "react";
import { Bell, Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios"; // Import axios for the useTeacherDashboard hook

// --- Your Actual useTeacherDashboard Hook (from your provided code) ---
// This hook now fetches data from your backend.
export const useTeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Renamed fetchDashboard to fetchData and made it callable for refetch
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // This is your actual API call to the dashboard endpoint
      const res = await axios.get("/api/teacher/dashboard", {
        withCredentials: true,
      });
      console.log("📊 Teacher Dashboard Response:", res.data);
      setData(res.data);
    } catch (err) {
      console.error("❌ Dashboard fetch error:", err);
      // Ensure error is a string for consistency with useState<string | null>
      setError(err.response?.data?.message || "Failed to fetch dashboard");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchData(); // Initial data fetch when component mounts
  }, [fetchData]); // Dependency on fetchData ensures it runs when fetchData changes (though it won't here)

  // Expose fetchData as refetch for external calls
  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch };
};

// --- Notices Component ---
const Notices = () => {
  // Use your actual useTeacherDashboard hook
  const { data, loading, error, refetch } = useTeacherDashboard();

  // State for the form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Display loading, error, or null states
  if (loading) return <p className="p-6 text-lg font-medium">Loading notices...</p>;
  if (error) return <p className="p-6 text-red-500 font-semibold">Error: {error}</p>; // Use 'error' directly as it's already a string
  if (!data || !data.recentNotices || !data.assignedBatches) return null;

  const { recentNotices, assignedBatches } = data;

  // Function to handle notice submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Clear previous errors
    setFormSuccess(false); // Clear previous success messages

    // Basic form validation
    if (!title.trim() || !description.trim()) {
      setFormError("Title and description are required.");
      return;
    }

    if (targetAudience === "batch" && selectedBatches.length === 0) {
      setFormError("Please select at least one batch if targeting specific batches.");
      return;
    }

    setIsSubmitting(true); // Indicate submission is in progress
    try {
      const noticeData = {
        title,
        description,
        targetAudience,
        targetBatchIds: targetAudience === "batch" ? selectedBatches : [],
        isScheduled: false, // Assuming immediate post for this form
      };

      // --- Actual API Call to your backend's createNotice route ---
      const response = await fetch('/api/teacher/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // IMPORTANT: You'll need to add your authentication token here.
          // This token would typically come from your authentication context or local storage.
          // Example: 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify(noticeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to post notice.');
      }

      setFormSuccess(true); // Show success message
      
      // Reset form fields after successful submission
      setTitle("");
      setDescription("");
      setTargetAudience("all");
      setSelectedBatches([]);

      // Re-fetch notices to update the list displayed on the UI
      refetch();

    } catch (err) {
      console.error("Error posting notice:", err);
      setFormError(err.message); // Display error message from API or custom message
    } finally {
      setIsSubmitting(false); // End submission process
    }
  };

  // Handle checkbox changes for batch selection
  const handleBatchChange = (batchId) => {
    setSelectedBatches((prev) =>
      prev.includes(batchId)
        ? prev.filter((id) => id !== batchId) // Remove if already selected
        : [...prev, batchId] // Add if not selected
    );
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 via-sky-100 to-blue-200">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* --- Notice Creation Form --- */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-3xl shadow-xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Send className="w-7 h-7 text-green-600" />
            <h3 className="text-3xl font-extrabold text-blue-800">
              Create New Notice
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Notice Title
              </label>
              <input
                id="name"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="e.g., Upcoming Exam Schedule"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Provide details about the notice..."
                required
              />
            </div>
            
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </span>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    value="all"
                    checked={targetAudience === "all"}
                    onChange={() => {
                      setTargetAudience("all");
                      setSelectedBatches([]); // Clear selected batches if "All Students" is chosen
                    }}
                    className="form-radio text-blue-600"
                  />
                  <span>All Students</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="targetAudience"
                    value="batch"
                    checked={targetAudience === "batch"}
                    onChange={() => setTargetAudience("batch")}
                    className="form-radio text-blue-600"
                  />
                  <span>Specific Batches</span>
                </label>
              </div>
            </div>
            
            {/* Conditional rendering for batch selection */}
            {targetAudience === "batch" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="mt-4"
              >
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Select Batches
                </span>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {assignedBatches.map((batch) => (
                    <label
                      key={batch._id}
                      className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(batch._id)}
                        onChange={() => handleBatchChange(batch._id)}
                        className="form-checkbox text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-blue-900">{batch.name}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Form submission messages */}
            {formError && (
              <div className="text-sm font-medium text-red-600 p-3 bg-red-100 rounded-lg">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="text-sm font-medium text-green-600 p-3 bg-green-100 rounded-lg">
                Notice created successfully!
              </div>
            )}
            
            {/* Submit button with loading spinner */}
            <motion.button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Post Notice</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
        
        {/* --- Recent Notices Display --- */}
        <div className="flex items-center gap-3">
          <Bell className="w-8 h-8 text-yellow-600 drop-shadow-sm" />
          <h2 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-md">
            Recent Notices
          </h2>
        </div>

        {recentNotices.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No recent notices posted.
          </div>
        ) : (
          <motion.ul
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {recentNotices.map((notice) => {
              // Determine target batches for display
              const targetBatches = notice.targetAudience === "batch"
                ? assignedBatches
                    .filter((b) =>
                      Array.isArray(notice.targetBatchIds)
                        ? notice.targetBatchIds.includes(b._id)
                        : false
                    )
                    .map((b) => b.name)
                : [];

              return (
                <motion.li
                  key={notice._id}
                  className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl shadow-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{notice.title}</h3>
                  <p className="text-gray-700 text-sm mb-4">{notice.description}</p>

                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <span>
                      📅 <span className="font-semibold">Posted:</span>{" "}
                      {new Date(notice.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      🎯 <span className="font-semibold">Target:</span>{" "}
                      {notice.targetAudience === "batch" && targetBatches.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {targetBatches.map((batch) => (
                            <span
                              key={batch}
                              className="bg-sky-200 text-sky-900 px-3 py-0.5 rounded-full text-xs font-semibold"
                            >
                              {batch}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="font-medium text-gray-800">All Students</span>
                      )}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </div>
  );
};

export default Notices;
