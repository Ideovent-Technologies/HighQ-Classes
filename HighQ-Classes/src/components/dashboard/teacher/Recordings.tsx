import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRecordings } from "@/hooks/useRecordings";
import { useTeacherAssignments } from "@/hooks/useTeacherAssignments";

const Recordings = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const {
    recordings,
    loading,
    uploading,
    uploadRecording,
  } = useRecordings();

  const { assignedBatches, assignedCourses } = useTeacherAssignments();

  const handleUpload = async () => {
    if (!title || !subject || !videoFile || !selectedBatch || !selectedCourse) {
      return alert("Please fill in all required fields");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subject", subject);
    formData.append("file", videoFile);
    formData.append("batch", selectedBatch);
    formData.append("course", selectedCourse);

    const result = await uploadRecording(formData);

    if (result.success) {
      setTitle("");
      setDescription("");
      setSubject("");
      setSelectedBatch("");
      setSelectedCourse("");
      setVideoFile(null);
    } else {
      alert(result.message);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-6 space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-blue-100 to-indigo-200 p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">Upload New Recording</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Subject *</Label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>
          <div>
            <Label>Course *</Label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Course</option>
              {assignedCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Batch *</Label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Batch</option>
              {assignedBatches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
          <div className="md:col-span-2">
            <Label>Video File *</Label>
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <Button onClick={handleUpload} disabled={uploading} className="mt-4">
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Uploading...
            </>
          ) : (
            "Upload Recording"
          )}
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600" />
          </div>
        ) : recordings.length > 0 ? (
          recordings.map((rec) => (
            <motion.div
              key={rec._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-2xl overflow-hidden shadow-md border border-gray-200">
                <video
                  src={rec.fileUrl}
                  controls
                  poster={rec.thumbnailUrl}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <CardContent className="p-4 space-y-2">
                  <h3 className="text-lg font-semibold">{rec.title}</h3>
                  <p className="text-sm text-gray-600">{rec.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-blue-700 font-medium">
                    <span className="bg-blue-100 px-2 py-0.5 rounded">Subject: {rec.subject}</span>
                    <span className="bg-green-100 px-2 py-0.5 rounded">Duration: {formatDuration(rec.duration)}</span>
                    <span className="bg-yellow-100 px-2 py-0.5 rounded">Views: {rec.views}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Expires on: {new Date(rec.accessExpires || "").toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No recordings found.</p>
        )}
      </div>
    </div>
  );
};

export default Recordings;
