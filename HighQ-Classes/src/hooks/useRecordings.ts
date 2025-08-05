// src/hooks/useRecordings.ts

import { useEffect, useState } from "react";
import axios from "axios";

interface Course {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface Recording {
  _id: string;
  title: string;
  description: string;
  subject: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  course: string;
  batch: string;
  views: number;
  accessExpires?: string;
  createdAt?: string;
}

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses and batches assigned to the logged-in teacher
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/teacher/profile"); // adjust if route differs
      setCourses(data?.teacher?.courses || []);
      setBatches(data?.teacher?.batches || []);
    } catch (err: any) {
      console.error("Error fetching assignments", err);
      setError("Failed to load assigned data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all recordings
  const fetchRecordings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/recordings");
      setRecordings(data?.data || []);
    } catch (err) {
      console.error("Error fetching recordings", err);
      setError("Failed to fetch recordings.");
    } finally {
      setLoading(false);
    }
  };

  // Upload a new recording
  const uploadRecording = async (formData: FormData) => {
    try {
      setUploading(true);
      const { data } = await axios.post("/api/recordings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setRecordings((prev) => [data?.data, ...prev]);
      return { success: true, message: data.message };
    } catch (err: any) {
      console.error("Upload error", err);
      return {
        success: false,
        message: err?.response?.data?.message || "Upload failed",
      };
    } finally {
      setUploading(false);
    }
  };

  // Delete a recording
  const deleteRecording = async (id: string) => {
    try {
      await axios.delete(`/api/recordings/${id}`);
      setRecordings((prev) => prev.filter((r) => r._id !== id));
      return { success: true };
    } catch (err) {
      console.error("Delete error", err);
      return { success: false, message: "Failed to delete recording" };
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchRecordings();
  }, []);

  return {
    recordings,
    courses,
    batches,
    loading,
    uploading,
    error,
    fetchRecordings,
    uploadRecording,
    deleteRecording,
  };
};
