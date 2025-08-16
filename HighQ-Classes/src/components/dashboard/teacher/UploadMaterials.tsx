import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast"; // Assuming this is where toast comes from
import { useTeacherProfile } from "@/hooks/useTeacherProfile";
import { Loader2, Trash2, CloudUpload, FileText, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";

// Interface for the Teacher, assuming a populated field from the API
interface Teacher {
  _id: string;
  name: string;
}

// Interfaces for populated Course and Batch data
interface Course {
  _id: string;
  name: string;
}

interface Batch {
  _id: string;
  name: string;
}

// Updated Material interface to include populated fields
interface Material {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  // These will be populated objects, not just IDs
  batch: Batch;
  course: Course;
  uploadedBy: Teacher;
  createdAt: string;
  updatedAt: string;
}

// A custom component for a friendly empty state message
const NoMaterialsFound = () => (
  <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 rounded-3xl border-2 border-dashed border-indigo-200 bg-white/70 backdrop-blur-md">
    <FileText className="w-16 h-16 text-indigo-300 mb-4" />
    <h3 className="text-xl font-semibold">No materials uploaded yet.</h3>
    <p className="text-sm mt-1">Start by uploading some course materials on the left.</p>
  </div>
);

const UploadMaterials = () => {
  // Assuming useTeacherProfile provides profile data including batches and courses
  const { profile, loading: profileLoading } = useTeacherProfile();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [batchId, setBatchId] = useState(""); // Keeping as single string for select input
  const [courseId, setCourseId] = useState("");
  const [filterBatch, setFilterBatch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [loading, setLoading] = useState(false); // For upload/delete operations

  // Function to fetch materials from the API
  const fetchMaterials = useCallback(async () => {
    setLoading(true); // Indicate loading for the materials list
    try {
      // API call to get materials, filtered by batch and course
      const res = await axios.get("/api/materials", {
        params: { batchId: filterBatch, courseId: filterCourse },
        withCredentials: true, // Ensure cookies are sent with this GET request
      });
      setMaterials(res.data);
    } catch (err: any) { // Explicitly type err as 'any' for easier access to response
      console.error("Error fetching materials:", err);
      toast({ 
        title: "Error fetching materials", 
        description: err.response?.data?.message || "Could not load materials. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false); // End loading for the materials list
    }
  }, [filterBatch, filterCourse]); // Dependencies ensure re-fetch when filters change

  // Effect to re-fetch materials whenever the filters change or on initial mount
  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]); // Dependency on fetchMaterials (which is memoized with useCallback)

  // Handler for uploading a new material
  const handleUpload = async () => {
    // Input validation
    if (!selectedFile || !title.trim() || !description.trim() || !batchId || !courseId) {
      toast({ title: "Validation Error", description: "Please fill all fields and select a file.", variant: "destructive" });
      return;
    }
    setLoading(true); // Indicate loading for the upload operation
    try {
      // Create form data to send the file and other fields
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", title);
      formData.append("description", description);
      
      // IMPORTANT FIX: Send batchId as a stringified array named "batchIds"
      formData.append("batchIds", JSON.stringify([batchId])); 
      
      formData.append("courseId", courseId);

      // IMPORTANT FIX: Add fileType from the selected file's MIME type
      formData.append("fileType", selectedFile.type || selectedFile.name.split('.').pop() || 'application/octet-stream');


      // IMPORTANT FIX: Change endpoint to /api/materials as per Postman
      await axios.post("/api/materials", formData, { // Changed /api/materials/upload to /api/materials
        withCredentials: true, // IMPORTANT: Ensure cookies are sent with this POST request
        headers: {
          'Content-Type': 'multipart/form-data' // Important for FormData
        }
      });
      toast({ title: "Success", description: "Material uploaded successfully." }); // Removed variant="success"
      
      // Reset form fields after successful upload
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setBatchId("");
      setCourseId("");
      
      // Refresh the materials list
      fetchMaterials();
    } catch (err: any) { // Explicitly type err as 'any' for easier access to response
      console.error("Upload failed:", err);
      toast({ 
        title: "Upload Failed", 
        description: err.response?.data?.message || "An error occurred during upload.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false); // End loading for the upload operation
    }
  };

  // Handler for deleting a material
  const handleDelete = async (id: string) => {
    setLoading(true); // Indicate loading for the delete operation
    try {
      await axios.delete(`/api/materials/${id}`, {
        withCredentials: true, // IMPORTANT: Ensure cookies are sent with this DELETE request
      });
      toast({ title: "Success", description: "Material deleted." }); // Removed variant="success"
      
      // Refresh the materials list after deletion
      fetchMaterials();
    } catch (err: any) { // Explicitly type err as 'any' for easier access to response
      console.error("Delete failed:", err);
      toast({ 
        title: "Delete Failed", 
        description: err.response?.data?.message || "An error occurred during deletion.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false); // End loading for the delete operation
    }
  };

  // Show a loading state while the user profile is being fetched
  if (profileLoading) return <div className="p-6 text-center text-lg text-gray-600">Loading profile...</div>;

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white px-6 py-10 overflow-hidden font-sans">
      {/* Dynamic background for visual flair */}
      <div className="absolute inset-0 z-0 opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="fractal" x="0" y="0" width="100%" height="100%">
              <feTurbulence id="turbulence" type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="2" result="noise" />
              <feColorMatrix in="noise" type="saturate" values="0" />
              <feBlend in="SourceGraphic" in2="noise" mode="soft-light" />
            </filter>
          </defs>
          <rect width="100%" height="100%" filter="url(#fractal)" className="fill-current text-indigo-200" />
        </svg>
      </div>

      <div className="relative z-10 container mx-auto">
        {/* Main heading with a gradient text effect */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 mb-12 drop-shadow-lg">
          Material Management
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Upload Form Card */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-[30px] shadow-3xl border border-indigo-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-indigo-100 rounded-full">
                <CloudUpload className="text-indigo-600 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-indigo-800 tracking-tight">Upload New Material</h2>
            </div>
            
            <div className="space-y-6">
              <Input
                placeholder="name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 transition-all duration-300 shadow-sm"
              />
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 transition-all duration-300 shadow-sm min-h-[120px]"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <select
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl text-gray-700 bg-white shadow-sm focus:border-indigo-500 transition-all duration-300 appearance-none"
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                >
                  <option value="">Select Batch</option>
                  {profile?.batches?.map((batch) => (
                    <option key={batch._id} value={batch._id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
                <select
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-xl text-gray-700 bg-white shadow-sm focus:border-indigo-500 transition-all duration-300 appearance-none"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Select Course</option>
                  {profile?.courses?.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="relative">
                <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-indigo-300 rounded-xl cursor-pointer hover:border-indigo-500 transition-all duration-300 bg-indigo-50/50">
                  <span className="flex flex-col items-center">
                    <CloudUpload className="w-6 h-6 text-indigo-500" />
                    <span className="mt-2 text-sm text-indigo-600 font-medium">
                      {selectedFile ? selectedFile.name : "Choose a file to upload"}
                    </span>
                  </span>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                onClick={handleUpload}
                disabled={loading}
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl shadow-lg hover:shadow-indigo-400/50 transition-all duration-300 transform hover:scale-[1.01]"
              >
                {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : "🚀 Upload"}
              </Button>
            </div>
          </motion.div>

          {/* Uploaded Materials List Card */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="text-blue-600 w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold text-indigo-900 tracking-tight">Uploaded Materials</h2>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                className="px-5 py-3 rounded-full border border-indigo-300 bg-white/70 backdrop-blur-sm shadow-md text-sm text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 appearance-none"
                value={filterBatch}
                onChange={(e) => setFilterBatch(e.target.value)}
              >
                <option value="">All Batches</option>
                {profile?.batches?.map((batch) => (
                  <option key={batch._id} value={batch._id}>
                    {batch.name}
                  </option>
                ))}
              </select>

              <select
                className="px-5 py-3 rounded-full border border-indigo-300 bg-white/70 backdrop-blur-sm shadow-md text-sm text-gray-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all duration-300 appearance-none"
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
              >
                <option value="">All Courses</option>
                {profile?.courses?.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Materials Display */}
            {materials.length === 0 ? (
              <NoMaterialsFound />
            ) : (
              <div className="grid grid-cols-1 gap-6 max-h-[calc(100vh-250px)] overflow-y-auto pr-4 custom-scrollbar">
                {materials.map((mat) => (
                  <motion.div
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 25px 50px -12px rgba(99, 102, 241, 0.4)",
                      border: "1px solid rgba(99, 102, 241, 0.5)"
                    }}
                    whileTap={{ scale: 0.99 }}
                    key={mat._id}
                    className="group relative p-8 bg-white/90 backdrop-blur-lg border border-indigo-100 rounded-3xl shadow-xl transition-all duration-300 hover:border-indigo-300"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="flex items-start">
                          <FileText className="w-8 h-8 mr-4 text-indigo-500" />
                          <div>
                            <h4 className="text-2xl font-bold text-indigo-800 group-hover:text-indigo-900 transition-colors duration-200">
                              {mat.title}
                            </h4>
                            <p className="text-gray-600 text-base mt-2 leading-snug line-clamp-3">
                              {mat.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-y-4">
                        <div className="space-y-1">
                          {mat.batch?.name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                              <span className="font-semibold">Batch:</span>
                              <span>{mat.batch.name}</span>
                            </div>
                          )}
                          {mat.course?.name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-700">
                              <span className="font-semibold">Course:</span>
                              <span>{mat.course.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1 text-left md:text-right">
                          {mat.uploadedBy?.name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-700 justify-start md:justify-end">
                              <span className="font-semibold">Uploaded By:</span>
                              <span>{mat.uploadedBy.name}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-sm text-gray-700 justify-start md:justify-end">
                            <span className="font-semibold">Date:</span>
                            <span>
                              {mat.createdAt ? new Date(mat.createdAt).toLocaleString() : "Date not available"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-4 md:mt-0 col-span-1 md:col-span-2 justify-end">
                          <a
                            href={mat.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </a>
                          <a
                            href={mat.fileUrl}
                            download
                            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-green-600 border border-green-200 rounded-full bg-green-50 hover:bg-green-100 transition-colors duration-200"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </a>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(mat._id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 w-10 h-10 transition-all duration-200"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UploadMaterials;
