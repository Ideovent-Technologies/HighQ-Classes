import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Batch {
  _id: string;
  name: string;
  // Assuming 'course' field is not directly part of Batch interface for simplicity,
  // as assignedCourses will handle course data.
}

interface Course {
  _id: string;
  name: string;
}

export const useTeacherAssignments = () => {
  const [assignedBatches, setAssignedBatches] = useState<Batch[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added error state

  // Memoize the fetchAssignments function using useCallback.
  const fetchAssignments = useCallback(async () => {
    setLoading(true); // Set loading to true when starting the fetch
    setError(null);   // Clear any previous errors

    try {
      // FIX: Fetch from /api/teacher/profile for comprehensive assigned batches and courses.
      // This aligns with previous fixes to ensure courses are fetched correctly.
      const { data } = await axios.get("/api/teacher/profile", {
        withCredentials: true, // Essential for sending cookies (e.g., session/auth tokens)
      });

      // Assuming /api/teacher/profile returns 'batches' and 'courses' directly
      setAssignedBatches(data.batches || []);
      setAssignedCourses(data.courses || []);

    } catch (err: any) {
      console.error("❌ Failed to fetch teacher assignments:", err); // Refined error logging
      // Set a user-friendly error message, falling back to a generic one
      setError(err.response?.data?.message || "Failed to load teacher assignments. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false when the fetch operation completes
    }
  }, []); // Empty dependency array means this function is created once on mount

  // useEffect hook to call fetchAssignments when the component mounts.
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]); // Dependency on fetchAssignments (memoized)

  // Return the assigned batches, assigned courses, loading state, and error state.
  // Also, expose fetchAssignments as a refetch function if a component needs to manually trigger a data refresh.
  return {
    assignedBatches,
    assignedCourses,
    loading,
    error, // Expose the error state
    refetch: fetchAssignments, // Expose refetch function
  };
};
