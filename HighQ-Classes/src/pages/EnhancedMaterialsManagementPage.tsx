import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  BookOpen,
  Users,
  FileText,
  Tag,
  Calendar,
  Eye,
  CheckCircle2, // Add this line
  AlertTriangle, // Add this line
  Loader2, // Add this line, as it appears in another error
} from "lucide-react";
import { format } from "date-fns";
import materialService from "@/API/services/materialService";
import courseService from "@/API/services/courseService";
import batchService from "@/API/services/batchService";
import { Material } from "@/types/material.types";

interface EnhancedMaterialsManagementPageProps {
  userRole: "teacher" | "admin" | "student";
}

const EnhancedMaterialsManagementPage: React.FC<
  EnhancedMaterialsManagementPageProps
> = ({ userRole }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    courseId: "",
    batchIds: [] as string[],
    file: null as File | null,
    category: "lecture" as "lecture" | "assignment" | "reference" | "exam",
  });

  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [materialsResult, coursesResult, batchesResult] = await Promise.all(
        [
          userRole === "student"
            ? materialService.getStudentMaterials()
            : materialService.getAdminTeacherMaterials(),
          courseService.getAllCourses(),
          batchService.getAllBatches(),
        ]
      );

      if (materialsResult.success && materialsResult.materials) {
        setMaterials(materialsResult.materials);
      }
      if (coursesResult.success && coursesResult.courses) {
        setCourses(coursesResult.courses);
      }
      if (batchesResult.success && batchesResult.batches) {
        setBatches(batchesResult.batches);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.courseId) {
      setMessage({
        type: "error",
        text: "Please fill in all required fields",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadData = {
        title: uploadForm.title,
        description: uploadForm.description,
        courseId: uploadForm.courseId,
        batchIds: uploadForm.batchIds,
        file: uploadForm.file,
        category: uploadForm.category,
      };

      const result = await materialService.uploadMaterial(
        uploadData,
        (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      if (result.success && result.material) {
        setMaterials((prev) => [result.material!, ...prev]);
        setMessage({
          type: "success",
          text: "Material uploaded successfully!",
        });

        // Reset form
        setUploadForm({
          title: "",
          description: "",
          courseId: "",
          batchIds: [],
          file: null,
          category: "lecture",
        });
        setUploadProgress(0);
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return;

    try {
      const result = await materialService.deleteMaterial(materialId);
      if (result.success) {
        setMaterials((prev) => prev.filter((m) => m._id !== materialId));
        setMessage({
          type: "success",
          text: "Material deleted successfully!",
        });
      } else {
        setMessage({ type: "error", text: result.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete material" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDownload = async (material: Material) => {
    if (userRole === "student") {
      await materialService.trackMaterialView(material._id);
    }
    window.open(material.fileUrl, "_blank");
  };

  // Filter and sort materials
  const filteredMaterials = materials
    .filter((material) => {
      const matchesSearch =
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // --- FIX: Robust courseId check for both object and string, avoid type error ---
      const matchesCourse =
        selectedCourse === "all" ||
        (typeof material.courseId === "object" &&
        material.courseId !== null &&
        "_id" in material.courseId
          ? (material.courseId as any)._id === selectedCourse
          : String(material.courseId) === selectedCourse);

      const fileExtension =
        material.fileUrl?.split(".").pop()?.toLowerCase() || "";
      const matchesFileType =
        selectedFileType === "all" ||
        (selectedFileType === "pdf" && fileExtension === "pdf") ||
        (selectedFileType === "video" &&
          ["mp4", "avi", "mov", "mkv"].includes(fileExtension)) ||
        (selectedFileType === "image" &&
          ["jpg", "jpeg", "png", "gif"].includes(fileExtension)) ||
        (selectedFileType === "document" &&
          ["doc", "docx", "txt"].includes(fileExtension));

      return matchesSearch && matchesCourse && matchesFileType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt || 0).getTime() -
            new Date(b.createdAt || 0).getTime()
          );
        case "name":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getFileTypeIcon = (fileUrl: string) => {
    const extension = fileUrl?.split(".").pop()?.toLowerCase() || "";
    switch (extension) {
      case "pdf":
        return "📄";
      case "mp4":
      case "avi":
      case "mov":
        return "🎥";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      case "doc":
      case "docx":
        return "📝";
      default:
        return "📎";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "lecture":
        return "bg-blue-100 text-blue-800";
      case "assignment":
        return "bg-orange-100 text-orange-800";
      case "reference":
        return "bg-green-100 text-green-800";
      case "exam":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 lg:p-12 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Materials Management 📚
        </h1>
        <Badge
          variant="secondary"
          className="text-sm px-4 py-2 rounded-full shadow-sm"
        >
          Total: {filteredMaterials.length} materials
        </Badge>
      </div>

      {/* Alert Message */}
      {message && (
        <Alert
          className={`border-l-4 ${
            message.type === "success"
              ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300"
              : "border-red-500 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300"
          } rounded-lg shadow-md`}
        >
          <AlertDescription className="flex items-center space-x-2">
            {message.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertTriangle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs Navigation */}
      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 h-auto p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
          <TabsTrigger
            value="materials"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 rounded-lg p-2 md:p-3"
          >
            All Materials
          </TabsTrigger>
          {(userRole === "teacher" || userRole === "admin") && (
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 rounded-lg p-2 md:p-3"
            >
              Upload Material
            </TabsTrigger>
          )}
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all duration-200 rounded-lg p-2 md:p-3"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* All Materials Tab Content */}
        <TabsContent value="materials" className="space-y-6 mt-6">
          {/* Search and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              />
            </div>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.courseName || course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedFileType}
              onValueChange={setSelectedFileType}
            >
              <SelectTrigger className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="pdf">PDF Documents</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="image">Images</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:text-white">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Materials Grid */}
{/* Materials Grid */}
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card
        key={i}
        className="animate-pulse dark:bg-gray-800 bg-white/60 backdrop-blur-md rounded-2xl shadow-lg"
      >
        <CardContent className="p-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-4 w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-6 w-1/2"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {filteredMaterials.map((material) => (
      <Card
        key={material._id}
        className="bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden"
      >
        <CardContent className="p-6">
          {/* Top section */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full text-blue-700 dark:text-blue-300 shadow-inner">
                {getFileTypeIcon(material.fileUrl)}
              </div>
              <Badge
                className={`${getCategoryColor(
                  material.category || "reference"
                )} text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm`}
              >
                {material.category || "Reference"}
              </Badge>
            </div>
            {(userRole === "teacher" || userRole === "admin") && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => handleDelete(material._id)}
                className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-900 rounded-full p-2 transition"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Title & description */}
          <h3 className="font-bold text-xl mb-2 line-clamp-2 text-gray-900 dark:text-white tracking-tight">
            {material.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {material.description || "No description provided."}
          </p>

          {/* Info */}
          <div className="space-y-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <span>
                {typeof material.courseId === "object" && material.courseId !== null
                  ? (material.courseId as any).courseName ||
                    (material.courseId as any).name ||
                    (material.courseId as any)._id ||
                    "Unknown Course"
                  : material.courseId || "Unknown Course"}
              </span>
            </div>
            {material.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>
                  {format(new Date(material.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>{material.views || 0} views</span>
            </div>
          </div>

          {/* Download button */}
          <Button
            onClick={() => handleDownload(material)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 transition-all duration-200 rounded-xl font-semibold tracking-wide shadow-md hover:shadow-lg"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </CardContent>
      </Card>
    ))}
  </div>
)}

{/* Empty state */}
{!loading && filteredMaterials.length === 0 && (
  <div className="text-center py-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-inner border border-gray-200 dark:border-gray-700">
    <FileText className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
      No materials found
    </h3>
    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
      {searchTerm || selectedCourse !== "all" || selectedFileType !== "all"
        ? "Try adjusting your search or filter criteria to find what you're looking for."
        : "No materials have been uploaded yet. Be the first to upload one!"}
    </p>
  </div>
)}


        </TabsContent>

        {/* Upload Material Tab Content */}
        {(userRole === "teacher" || userRole === "admin") && (
          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
                  <Upload className="h-6 w-6 text-blue-600" />
                  Upload New Material
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Fill out the form below to upload a new learning material.
                </p>
              </CardHeader>
              <CardContent className="p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={uploadForm.title}
                      onChange={(e) =>
                        setUploadForm({ ...uploadForm, title: e.target.value })
                      }
                      placeholder="e.g., Introduction to React.js"
                      className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Category
                    </Label>
                    <Select
  value={uploadForm.category}
  onValueChange={(value) =>
    setUploadForm({
      ...uploadForm,
      category: value as "lecture" | "assignment" | "reference" | "exam",
    })
  }
>
                      <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:text-white">
                        <SelectItem value="lecture">
                          Lecture Material
                        </SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="reference">Reference</SelectItem>
                        <SelectItem value="exam">Exam Material</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={uploadForm.description}
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        description: e.target.value,
                      })
                    }
                    placeholder="Provide a brief description of the material..."
                    rows={4}
                    className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="course"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Course <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={uploadForm.courseId}
                      onValueChange={(value) =>
                        setUploadForm({ ...uploadForm, courseId: value })
                      }
                    >
                      <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select course..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:text-white">
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.courseName || course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="batches"
                      className="text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Target Batches
                    </Label>
                    <Select
                      value={uploadForm.batchIds[0] || ""}
                      onValueChange={(value) =>
                        setUploadForm({ ...uploadForm, batchIds: [value] })
                      }
                    >
                      <SelectTrigger className="mt-1 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="Select batch..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:text-white">
                        {batches.map((batch) => (
                          <SelectItem key={batch._id} value={batch._id}>
                            {batch.batchName || batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="file"
                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    File <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        file: e.target.files?.[0] || null,
                      })
                    }
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.txt"
                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Supported formats: PDF, DOC, PPT, MP4, Images, TXT (Max:
                    100MB)
                  </p>
                </div>

                {uploading && (
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-200">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={
                    uploading ||
                    !uploadForm.file ||
                    !uploadForm.title ||
                    !uploadForm.courseId
                  }
                  className="w-full h-12 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 rounded-lg"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Upload Material
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Analytics Tab Content */}
        <TabsContent value="analytics" className="space-y-8 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="dark:bg-gray-800 shadow-md rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                    Total Materials
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {materials.length}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 shadow-md rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                    Courses Covered
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {new Set(materials.map((m) => m.courseId)).size}
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 shadow-md rounded-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-400">
                    <Eye className="h-6 w-6" />
                  </div>
                  <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">
                    Total Views
                  </span>
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
                  {materials.reduce((sum, m) => sum + (m.views || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="dark:bg-gray-800 shadow-md rounded-xl">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700 p-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Popular Materials
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Top 5 most viewed materials across all courses.
              </p>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {materials
                .sort((a, b) => (b.views || 0) - (a.views || 0))
                .slice(0, 5)
                .map((material, index) => (
                  <div
                    key={material._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center gap-4">
                      <span className="font-extrabold text-xl text-gray-400 dark:text-gray-600">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                          {material.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {material.courseId?.name || "Unknown Course"}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      <Eye className="h-3 w-3 mr-1" /> {material.views || 0}{" "}
                      views
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedMaterialsManagementPage;
