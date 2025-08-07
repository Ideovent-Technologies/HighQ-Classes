import { useEffect, useState, useCallback } from "react";
import axios from "axios";

interface Course {
  _id: string;
  name: string;
  duration?: string; // Made optional as it might not always be present or relevant
}

interface Batch {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
  courseId?: Course; // Can be populated Course object or just ID
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface TeacherProfile {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  profilePicture?: string;
  bio?: string;
  address?: Address;
  preferences?: any; // Consider refining this type if possible
  batches?: Batch[];
  courses?: Course[];
}

export const useTeacherProfile = () => {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetchProfile function using useCallback
  const fetchProfile = useCallback(async () => {
    setLoading(true); // Set loading to true when starting the fetch
    setError(null);   // Clear any previous errors

    try {
      const res = await axios.get<TeacherProfile>("/api/teacher/profile", {
        withCredentials: true, // Essential for sending cookies (e.g., session/auth tokens)
      });
      setProfile(res.data); // Set the fetched profile data
    } catch (err: any) {
      console.error("❌ Failed to fetch teacher profile:", err); // Log the full error for debugging
      // Set a user-friendly error message, falling back to a generic one
      setError(err.response?.data?.message || "Failed to load profile. Please try again.");
    } finally {
      setLoading(false); // Always set loading to false when the fetch operation completes
    }
  }, []); // Empty dependency array means this function is created once on mount

  // useEffect hook to call fetchProfile when the component mounts.
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Dependency on fetchProfile (memoized)

  // Memoize the updateProfile function using useCallback
  const updateProfile = useCallback(async (
    updatedFields: Partial<Omit<TeacherProfile, "_id" | "batches" | "courses" | "email">> & {
      password?: string;
      address?: Address;
    }
  ) => {
    // No explicit loading state for update operation here,
    // but you could add a separate `isUpdating` state if needed for UI feedback.
    try {
      const res = await axios.put("/api/teacher/profile", updatedFields, {
        withCredentials: true, // Essential for sending cookies
      });
      // Update the profile state with the new data returned from the backend
      setProfile((prev) => ({
        ...prev!, // Use non-null assertion as profile should exist if update is called
        ...res.data.profile, // Assuming backend returns the updated profile under `profile` key
      }));
      // If you want to show a success toast, you would do it here
      return { success: true, message: "Profile updated successfully!" };
    } catch (err: any) {
      console.error("❌ Profile update error:", err); // Log the full error
      // Throw an error so the calling component can catch and display a toast
      throw new Error(err.response?.data?.message || "Profile update failed.");
    }
  }, []); // Empty dependency array means this function is created once on mount

  // Return the profile data, loading state, error state, and update/refetch functions.
  return { profile, loading, error, updateProfile, refetchProfile: fetchProfile };
};
