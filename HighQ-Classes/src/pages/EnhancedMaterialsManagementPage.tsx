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
            const [materialsResult, coursesResult, batchesResult] =
                await Promise.all([
                    userRole === "student"
                        ? materialService.getStudentMaterials()
                        : materialService.getAdminTeacherMaterials(),
                    courseService.getAllCourses(),
                    batchService.getAllBatches(),
                ]);

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
                setMaterials((prev) =>
                    prev.filter((m) => m._id !== materialId)
                );
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
                material.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                material.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            // --- FIX: Robust courseId check for both object and string, avoid type error ---
            const matchesCourse =
                selectedCourse === "all" ||
                (typeof material.courseId === "object" && material.courseId !== null && "_id" in material.courseId
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
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Materials Management</h1>
                <Badge variant="outline" className="text-sm">
                    {filteredMaterials.length} materials
                </Badge>
            </div>

            {message && (
                <Alert
                    className={
                        message.type === "success"
                            ? "border-green-500"
                            : "border-red-500"
                    }
                >
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="materials" className="w-full">
                <TabsList>
                    <TabsTrigger value="materials">All Materials</TabsTrigger>
                    {(userRole === "teacher" || userRole === "admin") && (
                        <TabsTrigger value="upload">
                            Upload Material
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="materials" className="space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <Input
                                placeholder="Search materials..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        <Select
                            value={selectedCourse}
                            onValueChange={setSelectedCourse}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course._id}
                                        value={course._id}
                                    >
                                        {course.courseName || course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedFileType}
                            onValueChange={setSelectedFileType}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="pdf">
                                    PDF Documents
                                </SelectItem>
                                <SelectItem value="video">Videos</SelectItem>
                                <SelectItem value="image">Images</SelectItem>
                                <SelectItem value="document">
                                    Documents
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="name">
                                    Alphabetical
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Materials Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded mb-4"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 bg-gray-200 rounded flex-1"></div>
                                            <div className="h-8 bg-gray-200 rounded w-16"></div>
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
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">
                                                    {getFileTypeIcon(
                                                        material.fileUrl
                                                    )}
                                                </span>
                                                <Badge
                                                    className={getCategoryColor(
                                                        material.category ||
                                                            "reference"
                                                    )}
                                                >
                                                    {material.category ||
                                                        "Reference"}
                                                </Badge>
                                            </div>
                                            {(userRole === "teacher" ||
                                                userRole === "admin") && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(
                                                            material._id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>

                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {material.title}
                                        </h3>

                                        {material.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                                {material.description}
                                            </p>
                                        )}

                                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>
                                                    {/* --- FIX: Show course name robustly --- */}
                                                    {typeof material.courseId === "object" && material.courseId !== null
                                                        ? (material.courseId as any).courseName || (material.courseId as any).name || (material.courseId as any)._id || "Unknown Course"
                                                        : material.courseId || "Unknown Course"}
                                                </span>
                                            </div>

                                            {material.createdAt && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                material.createdAt
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            {material.views && (
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    <span>
                                                        {material.views} views
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() =>
                                                handleDownload(material)
                                            }
                                            className="w-full"
                                            size="sm"
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading && filteredMaterials.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No materials found
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm ||
                                selectedCourse !== "all" ||
                                selectedFileType !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No materials have been uploaded yet"}
                            </p>
                        </div>
                    )}
                </TabsContent>

                {(userRole === "teacher" || userRole === "admin") && (
                    <TabsContent value="upload" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="h-5 w-5" />
                                    Upload New Material
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Title *</Label>
                                        <Input
                                            id="name"
                                            value={uploadForm.title}
                                            onChange={(e) =>
                                                setUploadForm({
                                                    ...uploadForm,
                                                    title: e.target.value,
                                                })
                                            }
                                            placeholder="Material title..."
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">
                                            Category
                                        </Label>
                                        <Select
                                            value={uploadForm.category}
                                            onValueChange={(value: any) =>
                                                setUploadForm({
                                                    ...uploadForm,
                                                    category: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="lecture">
                                                    Lecture Material
                                                </SelectItem>
                                                <SelectItem value="assignment">
                                                    Assignment
                                                </SelectItem>
                                                <SelectItem value="reference">
                                                    Reference
                                                </SelectItem>
                                                <SelectItem value="exam">
                                                    Exam Material
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">
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
                                        placeholder="Material description..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="course">Course *</Label>
                                        <Select
                                            value={uploadForm.courseId}
                                            onValueChange={(value) =>
                                                setUploadForm({
                                                    ...uploadForm,
                                                    courseId: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select course..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {courses.map((course) => (
                                                    <SelectItem
                                                        key={course._id}
                                                        value={course._id}
                                                    >
                                                        {course.courseName || course.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label htmlFor="batches">
                                            Target Batches
                                        </Label>
                                        <Select
                                            value={uploadForm.batchIds[0] || ""}
                                            onValueChange={(value) =>
                                                setUploadForm({
                                                    ...uploadForm,
                                                    batchIds: [value],
                                                })
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select batch..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {batches.map((batch) => (
                                                    <SelectItem
                                                        key={batch._id}
                                                        value={batch._id}
                                                    >
                                                        {batch.batchName || batch.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="file">File *</Label>
                                    <Input
                                        id="file"
                                        type="file"
                                        onChange={(e) =>
                                            setUploadForm({
                                                ...uploadForm,
                                                file:
                                                    e.target.files?.[0] || null,
                                            })
                                        }
                                        accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.txt"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Supported formats: PDF, DOC, PPT, MP4,
                                        Images, TXT (Max: 100MB)
                                    </p>
                                </div>

                                {uploading && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}
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
                                    className="w-full"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="h-4 w-4 mr-2" />
                                            Upload Material
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium">
                                        Total Materials
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {materials.length}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <BookOpen className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">
                                        Courses Covered
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {
                                        new Set(
                                            materials.map((m) => m.courseId)
                                        ).size
                                    }
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium">
                                        Total Views
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {materials.reduce(
                                        (sum, m) => sum + (m.views || 0),
                                        0
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Materials</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {materials
                                    .sort(
                                        (a, b) =>
                                            (b.views || 0) - (a.views || 0)
                                    )
                                    .slice(0, 5)
                                    .map((material, index) => (
                                        <div
                                            key={material._id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-lg text-gray-500">
                                                    #{index + 1}
                                                </span>
                                                <div>
                                                    <p className="font-medium">
                                                        {material.title}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {
                                                            material.courseId
                                                                ?.name
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {material.views || 0} views
                                            </Badge>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default EnhancedMaterialsManagementPage;
