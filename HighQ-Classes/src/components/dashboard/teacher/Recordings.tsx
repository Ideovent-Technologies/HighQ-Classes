import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useRecordings } from "@/hooks/useRecordings";
import { toast } from "@/components/ui/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

const Recordings = () => {
  const { recordings, loading, error, fetchRecordings, uploadRecording } = useRecordings();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    batch: "",
    course: "",
    file: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, file }));
  };

  const handleUpload = async () => {
    if (!formData.file) {
      toast({ title: "Please select a file" });
      return;
    }

    const uploadData = new FormData();
    uploadData.append("title", formData.title);
    uploadData.append("description", formData.description);
    uploadData.append("subject", formData.subject);
    uploadData.append("batch", formData.batch);
    uploadData.append("course", formData.course);
    uploadData.append("file", formData.file);

    try {
      await uploadRecording(uploadData);
      toast({ title: "Recording uploaded successfully" });
      setFormData({
        title: "",
        description: "",
        subject: "",
        batch: "",
        course: "",
        file: null,
      });
fetchRecordings();
    } catch (err) {
      toast({ title: "Upload failed", description: "Check console for details." });
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6 text-center"
      >
        📼 Class Recordings
      </motion.h2>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid md:grid-cols-2 gap-4 bg-white rounded-xl p-6 shadow-xl mb-10"
      >
        <Input name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
        <Input name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} />
        <Input name="batch" placeholder="Batch ID" value={formData.batch} onChange={handleChange} />
        <Input name="course" placeholder="Course ID" value={formData.course} onChange={handleChange} />
        <Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <Input type="file" onChange={handleFileChange} />
        <Button onClick={handleUpload} className="w-full col-span-full flex gap-2 items-center">
          <UploadCloud className="w-5 h-5" />
          Upload Recording
        </Button>
      </motion.div>

      {/* Loading/Error */}
      {loading ? (
        <div className="text-center py-10">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p>Loading recordings...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        // Recordings List
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recordings.map((rec) => (
            <motion.div
              key={rec._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-2xl transition-all duration-300 rounded-xl border border-blue-100">
                <CardContent className="p-5 space-y-2">
                  <h3 className="text-lg font-semibold">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <p className="text-sm text-blue-600">📘 {rec.subject}</p>
                  <p className="text-xs text-gray-400">Batch: {rec.batch}</p>
                  <p className="text-xs text-gray-400">Course: {rec.course}</p>
                  <a
                    href={rec.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm font-medium underline"
                  >
                    Watch / Download
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recordings;
