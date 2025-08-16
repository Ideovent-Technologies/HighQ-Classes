import { useState, useCallback } from "react";
import axios, { AxiosProgressEvent } from "axios";

interface SupportTicket {
  _id: string;
  name: string;
  email: string;
  role: string;
  subject: string;
  message: string;
  fileUrl?: string;
  fileName?: string;
  createdAt?: string;
  status?: string;
}

export const useSupportTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  //  Form state
  const [form, setForm] = useState({
    subject: "",
    message: "",
    file: null as File | null,
  });

  //  New state for status messages
  const [statusMsg, setStatusMsg] = useState("");

  // Fetch user's tickets
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/support", {
        withCredentials: true,
      });
      setTickets(data?.data || []);
    } catch (err: any) {
      console.error("❌ Error fetching tickets:", err);
      setError(err.response?.data?.message || "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Create ticket
  const createTicket = useCallback(async (formData: FormData) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    try {
      const { data } = await axios.post("/api/support", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      });

      setTickets((prev) => [data?.data, ...prev]);
      return { success: true, message: data.message || "Support ticket created successfully." };
    } catch (err: any) {
      console.error("❌ Ticket creation error:", err);
      return { success: false, message: err.response?.data?.message || "Failed to create ticket." };
    } finally {
      setUploading(false);
    }
  }, []);

  //  This is the function your component expects
  const sendTicket = async () => {
    if (!form.subject || !form.message) {
      const msg = "Please fill in subject and message.";
      setStatusMsg(msg);
      return { success: false, message: msg };
    }

    const formData = new FormData();
    formData.append("subject", form.subject);
    formData.append("message", form.message);
    if (form.file) {
      formData.append("file", form.file);
    }

    const res = await createTicket(formData);

    if (res.success) {
      setForm({ subject: "", message: "", file: null });
      setProgress(0);
      setStatusMsg("Ticket submitted successfully!");
    } else {
      setStatusMsg(res.message);
    }

    return res;
  };

  return {
  tickets,
  loading,
  uploading,
  progress,
  error,
  setError,
  statusMsg,
  setStatusMsg,
  fetchTickets,
  createTicket,
  handleSubmit: sendTicket, // alias
  form,
  setForm
};

};
