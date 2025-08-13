import { useEffect, useState, useCallback } from "react";
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
  description?: string;
  subject: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  course: Course; // changed from string
  batch: Batch;   // changed from string
  views: number;
  accessExpires?: string;
  createdAt?: string;
}

export const useRecordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //  NEW: Form state
  const [form, setForm] = useState({
    title: "",
    subject: "",
    description: "",
    video: null as File | null,
    batchId: "",
    courseId: "",
  });

  const fetchAssignmentsForRecordings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/teacher/profile", {
        withCredentials: true,
      });
      setCourses(data?.teacher?.courses || []);
      setBatches(data?.teacher?.batches || []);
    } catch (err: any) {
      console.error("❌ Error fetching assignments for recordings hook:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load assigned data for recordings."
      );
    }
  }, []);

  const fetchRecordings = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/recordings", {
        withCredentials: true,
      });
      setRecordings(data?.data || []);
    } catch (err: any) {
      console.error("❌ Error fetching recordings:", err);
      setError(
        err.response?.data?.message || "Failed to fetch recordings."
      );
    }
  }, []);

  const uploadRecording = useCallback(async (formData: FormData) => {
    setUploading(true);
    setError(null);
    try {
      const { data } = await axios.post("/api/recordings", formData, {
        withCredentials: true,
      });
      setRecordings((prev) => [data?.data, ...prev].filter(Boolean) as Recording[]);
      return {
        success: true,
        message: data.message || "Recording uploaded successfully!",
      };
    } catch (err: any) {
      console.error("❌ Upload error:", err);
      return {
        success: false,
        message:
          err?.response?.data?.message || "Upload failed. Please try again.",
      };
    } finally {
      setUploading(false);
    }
  }, []);

  //  NEW: handleUpload for form submission
  type UploadResponse = {
  success: boolean;
  message: string;
};

const handleUpload = async (): Promise<UploadResponse> => {
  if (!form.title || !form.subject || !form.video || !form.batchId || !form.courseId) {
    const msg = "Please fill all required fields.";
    setError(msg);
    return { success: false, message: msg };
  }

  const formData = new FormData();
  // FIX: The backend expects "title" not "name" for the recording title
  formData.append("title", form.title);
  formData.append("subject", form.subject);
  formData.append("description", form.description);
  formData.append("video", form.video);
  formData.append("batchId", form.batchId);
  formData.append("courseId", form.courseId);

  const res = await uploadRecording(formData);

  if (res.success) {
    setForm({
      title: "",
      subject: "",
      description: "",
      video: null,
      batchId: "",
      courseId: "",
    });
  }

  return res;
};


  const deleteRecording = useCallback(async (id: string) => {
    try {
      await axios.delete(`/api/recordings/${id}`, {
        withCredentials: true,
      });
      setRecordings((prev) => prev.filter((r) => r._id !== id));
      return { success: true, message: "Recording deleted successfully." };
    } catch (err: any) {
      console.error("❌ Delete error:", err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to delete recording. Please try again.",
      };
    }
  }, []);

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchAssignmentsForRecordings(),
          fetchRecordings(),
        ]);
      } catch (err) {
        console.error("❌ Initial recordings hook load failed:", err);
        if (!error) {
          setError("An unexpected error occurred during initial data load.");
        }
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, [fetchAssignmentsForRecordings, fetchRecordings]);

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
    form,         //  added
    setForm,      //  added
    handleUpload, //  added
  };
};
