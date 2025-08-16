import React from "react";
import { useRecordings } from "@/hooks/useRecordings";
import { useTeacherAssignments } from "@/hooks/useTeacherAssignments";
import { toast } from "@/hooks/use-toast";
import {
  FaTrashAlt,
  FaUpload,
  FaSpinner,
  FaFolderOpen,
} from "react-icons/fa";

type UploadResponse = {
  success: boolean;
  message: string;
};

export default function Recordings() {
  const {
    recordings,
    loading,
    uploading,
    error,
    form,
    setForm,
    handleUpload,
    deleteRecording,
  } = useRecordings();

  const {
    assignedBatches,
    assignedCourses,
    loading: assignmentsLoading,
    error: assignmentsError,
  } = useTeacherAssignments();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "video" && files) {
      setForm((prev) => ({ ...prev, video: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = (await handleUpload()) as UploadResponse;

    if (res?.success) {
      toast({ title: res.message });
    } else {
      toast({ title: res?.message || "Upload failed", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this recording?")) return;

    const res = await deleteRecording(id);
    if (res.success) {
      toast({ title: res.message });
    } else {
      toast({ title: res.message, variant: "destructive" });
    }
  };

  const combinedLoading = loading || assignmentsLoading;
  const combinedError = error || assignmentsError;

  if (combinedLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
          <p className="mt-4 text-lg text-gray-700 font-semibold">
            Loading recordings and assignments...
          </p>
        </div>
      </div>
    );
  }

  if (combinedError) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-red-500 text-lg font-semibold">Error: {combinedError}</p>
          <p className="mt-2 text-sm text-gray-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto bg-gray-100 min-h-screen font-sans">
      {/* Upload Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center">
          <FaUpload className="mr-3 text-blue-600" /> Upload New Recording
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Fill out the form below to upload a new class recording.
        </p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title" // FIX: should be "title" not "name"
              placeholder="Recording Title"
              value={form.title}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={form.subject}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            />
          </div>

          <textarea
            name="description"
            placeholder="Description (Optional)"
            value={form.description}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
            rows={2}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="batchId"
              value={form.batchId}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
            >
              <option value="">Select Batch</option>
              {assignedBatches.map((batch) => (
                <option key={batch._id} value={batch._id}>
                  {batch.name}
                </option>
              ))}
            </select>

            <select
              name="courseId"
              value={form.courseId}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-800"
              required
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Video File
            </label>
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleInputChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white font-semibold flex items-center justify-center space-x-2 ${
              uploading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Upload Recording</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recordings List */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Uploaded Recordings</h2>

        {recordings.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <FaFolderOpen className="text-5xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No recordings found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordings.map((rec) => (
              <div
                key={rec._id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <video
                  src={rec.fileUrl}
                  controls
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-base text-gray-900 truncate">{rec.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    <span className="font-semibold">{rec.subject}</span>
                  </p>
                 
<div className="text-xs text-gray-500 mt-2 space-y-1">
  <p>
    <span className="font-medium">Batch:</span> {rec.batch?.name || "N/A"}
  </p>
  <p>
    <span className="font-medium">Course:</span> {rec.course?.name || "N/A"}
  </p>
</div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(rec._id)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <FaTrashAlt className="mr-1" />
                      <span className="text-xs font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}