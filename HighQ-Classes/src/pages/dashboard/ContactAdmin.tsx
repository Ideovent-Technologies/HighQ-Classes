import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Send, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useSupportTickets } from "@/hooks/useSupportTickets";

const ContactAdmin: React.FC = () => {
  const { user } = useAuth();

  const { createTicket, loading, progress, error, setError } = useSupportTickets();

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [file]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg("");

    const fd = new FormData();
    fd.append("subject", subject);
    fd.append("message", message);
    fd.append("name", user?.name || "");
    fd.append("email", user?.email || "");
    fd.append("role", user?.role || "");
    if (file) fd.append("file", file, file.name);

    const res = await createTicket(fd);

    if (res.success) {
      setSubject("");
      setMessage("");
      setFile(null);
      setSuccessMsg("Your message has been received. We'll get back to you soon!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-50 to-purple-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl border border-gray-100"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Contact Admin</h2>
            <p className="text-sm text-gray-500">
              Submit account or classroom issues — we'll respond ASAP.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="w-full p-2 rounded-lg border bg-gray-50"
            />
            <span
              className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                user?.role === "teacher"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {String(user?.role || "USER").toUpperCase()}
            </span>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full p-2 rounded-lg border bg-gray-50"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Short subject"
              className="w-full p-2 rounded-lg border focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              placeholder="Explain the issue"
              className="w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Attachment (optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border hover:bg-blue-100 transition">
                <Upload className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Choose file</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>
              {file && (
                <span className="text-sm text-gray-600 truncate max-w-[200px]">
                  {file.name}
                </span>
              )}
            </div>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mt-3 max-h-40 rounded-md border"
              />
            )}
          </div>

          {/* Upload Progress */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-400"
              />
            </div>
          )}

          {/* Submit Button */}
          <div>
            <Button type="submit" className="w-full" disabled={loading}>
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-center text-sm mt-2 text-red-500">{error}</p>
          )}
        </form>

        {/* Success Alert */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3"
            >
              <CheckCircle2 className="text-green-500 w-5 h-5" />
              <p className="text-green-700 text-sm">{successMsg}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ContactAdmin;
