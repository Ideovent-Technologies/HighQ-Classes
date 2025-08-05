import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

// TypeScript interface for a Recording
export interface Recording {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration: number;
  subject: string;
  batch: string;
  course: string;
  teacher: string;
  accessExpires: string;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Return type for the custom hook
interface UseRecordingsResult {
  recordings: Recording[];
  loading: boolean;
  error: string | null;
  fetchRecordings: () => Promise<void>;
  uploadRecording: (formData: FormData) => Promise<void>;
}

export const useRecordings = (): UseRecordingsResult => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all recordings
  const fetchRecordings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("/api/recordings");
      const data = response.data?.data || [];
      setRecordings(data);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Failed to fetch recordings.";
      console.error("Fetch Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Upload a new recording
  const uploadRecording = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post("/api/recordings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Upload Successful",
        description: response.data?.message || "Recording uploaded.",
      });
      await fetchRecordings(); // Refresh list
    } catch (error: any) {
      const message =
        error?.response?.data?.message || "Upload failed. Try again.";
      console.error("Upload Error:", message);
      toast({
        title: "Upload Failed",
        description: message,
        variant: "destructive",
      });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Load recordings on component mount
  useEffect(() => {
    fetchRecordings();
  }, []);

  return {
    recordings,
    loading,
    error,
    fetchRecordings,
    uploadRecording,
  };
};
