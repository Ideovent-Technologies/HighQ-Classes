import React, { useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { UploadCloud, FileText, BookOpen, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dummy materials data for preview
const dummyMaterials = [
  {
    id: "mat1",
    title: "Calculus Notes - Chapter 1",
    subject: "Mathematics",
    date: "2025-08-01",
    fileName: "calculus-ch1.pdf",
  },
  {
    id: "mat2",
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    date: "2025-08-02",
    fileName: "organic-reactions.pptx",
  },
];

const UploadMaterials = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    file: null as File | null,
    date: new Date().toISOString().split("T")[0],
  });

  // Handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission (placeholder logic)
  const handleUpload = () => {
    if (!formData.title || !formData.subject || !formData.file) {
      alert("Please fill all fields.");
      return;
    }

    // Here you'll send `formData` to the backend
    alert(`✅ "${formData.title}" uploaded successfully!`);

    // Reset the form
    setFormData({
      title: "",
      subject: "",
      file: null,
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e0ff] via-[#f9f4ff] to-[#c4ebff] p-6">
      {/* Upload form container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-10"
      >
        <h2 className="text-4xl font-bold text-center text-[#1A2540] mb-10 drop-shadow-sm">
          📁 Upload Assignment / Study Material
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input fields */}
          <div className="space-y-4">
            <Input
              placeholder="Material Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-white/70 shadow-inner"
            />
            <Input
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="bg-white/70 shadow-inner"
            />
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="bg-white/70 shadow-inner"
            />
            <Input
              type="file"
              name="file"
              accept=".pdf,.docx,.pptx"
              onChange={handleChange}
              className="bg-white/70 shadow-inner cursor-pointer"
            />
            <Button
              onClick={handleUpload}
              className="bg-[#1A2540] text-white w-full hover:bg-[#0e1a33]"
            >
              <UploadCloud className="mr-2 h-5 w-5" />
              Upload Material
            </Button>
          </div>

          {/* 3D illustration */}
          <div className="flex justify-center items-center">
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/2910/2910791.png"
              alt="Upload"
              className="w-56 h-56 object-contain"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Preview uploaded materials */}
      <div className="max-w-6xl mx-auto mt-16">
        <h3 className="text-2xl font-bold text-[#1A2540] mb-6">📚 Your Uploaded Materials</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dummyMaterials.map((mat) => (
            <motion.div
              key={mat.id}
              whileHover={{ scale: 1.03 }}
              className="bg-white/60 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-4 transition-transform"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />
                <div>
                  <h4 className="font-semibold text-[#1A2540]">{mat.title}</h4>
                  <p className="text-sm text-gray-700">{mat.subject}</p>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Date: {mat.date}</p>
                <p>File: {mat.fileName}</p>
              </div>
              <div className="mt-3 flex justify-end">
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadMaterials;
