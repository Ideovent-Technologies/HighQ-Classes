

import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Recording } from "./dummyRecordings";
import { saveRecording } from "@/utils/storage";
import characterImage from "@/assets/image.png"; // Your transparent image path

const TeacherRecording: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    file: null as File | null,
    date: new Date().toISOString().split("T")[0],
    views: 0,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "file" && files && files.length > 0) {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = () => {
    if (!formData.title || !formData.subject || !formData.file) {
      alert("Please fill all fields and upload a file.");
      return;
    }

    const fileUrl = URL.createObjectURL(formData.file);

    const newRecording: Recording = {
      id: Math.random().toString(),
      title: formData.title,
      subject: formData.subject,
      url: fileUrl,
      date: formData.date,
      topic: formData.title,
      views: 0,
      isActive: true,
    };

    saveRecording(newRecording);
    alert("Recording uploaded successfully!");

    setFormData({
      title: "",
      subject: "",
      file: null,
      date: new Date().toISOString().split("T")[0],
      views: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
        {/* Form Box */}
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-6 text-center text-white">
            📤 Upload New Recording
          </h2>
          <div className="grid gap-4">
            <div>
              <Label className="text-white">Title</Label>
              <Input name="title" value={formData.title} onChange={handleChange} className="bg-white/80" />
            </div>
            <div>
              <Label className="text-white">Subject</Label>
              <Input name="subject" value={formData.subject} onChange={handleChange} className="bg-white/80" />
            </div>
            <div>
              <Label className="text-white">Video File</Label>
              <Input
                name="file"
                type="file"
                accept="video/*"
                onChange={handleChange}
                className="bg-white/80"
              />
            </div>
            <div>
              <Label className="text-white">Date</Label>
              <Input type="date" name="date" value={formData.date} onChange={handleChange} className="bg-white/80" />
            </div>
            <Button onClick={handleUpload} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold mt-2">
              Upload
            </Button>
          </div>
        </div>

        {/* 3D Character Image with animation */}
        <div className="w-full max-w-sm flex justify-center md:justify-end">
          <img
            src={characterImage}
            alt="Character Holding Form"
            className="w-72 hover:scale-105 transition-transform duration-300 animate-character"
          />
        </div>
      </div>

      {/* Custom animation style */}
      <style>
        {`
          @keyframes characterWave {
            0%, 100% {
              transform: translateY(0) scale(1);
            }
            50% {
              transform: translateY(-5px) scale(1.02);
            }
          }

          .animate-character {
            animation: characterWave 3s ease-in-out infinite;
            transform-origin: bottom center;
          }
        `}
      </style>
    </div>
  );
};

export default TeacherRecording;
