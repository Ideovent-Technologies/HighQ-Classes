import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import {
    Search,
    Filter,
    Upload,
    Play,
    Pause,
    Trash2,
    Video,
    Users,
    Calendar,
    Eye,
    BarChart3,
    Plus,
} from "lucide-react";
import { format } from "date-fns";
import recordingService, { Recording } from "@/API/services/recordingService";
import courseService from "@/API/services/courseService";
import batchService from "@/API/services/batchService";

interface TeacherRecordingManagementPageProps {
    teacherId: string;
}

const TeacherRecordingManagementPage: React.FC<
    TeacherRecordingManagementPageProps
> = ({ teacherId }) => {
    const [recordings, setRecordings] = useState<Recording[]>([]);
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
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    // Upload form state
    const [uploadForm, setUploadForm] = useState({
        title: "",
        description: "",
        courseId: "",
        batchId: "",
        recordingDate: "",
        duration: "",
        file: null as File | null,
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [stats, setStats] = useState({
        totalRecordings: 0,
        totalViews: 0,
        averageViewTime: 0,
        popularRecording: null as Recording | null,
    });

    useEffect(() => {
        fetchInitialData();
        fetchStats();
    }, [teacherId]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [recordingsResult, coursesResult, batchesResult] =
                await Promise.all([
                    recordingService.getTeacherRecordings(teacherId),
                    courseService.getAllCourses(),
                    batchService.getAllBatches(),
                ]);

            if (recordingsResult.success && recordingsResult.recordings) {
                setRecordings(recordingsResult.recordings);
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

    const fetchStats = async () => {
        try {
            const result = await recordingService.getRecordingStats(teacherId);
            if (result.success && result.stats) {
                setStats({
                    totalRecordings: result.stats.totalRecordings,
                    totalViews: result.stats.totalViews,
                    averageViewTime: result.stats.averageViews,
                    popularRecording:
                        result.stats.recentRecordings?.[0] || null,
                });
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
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
                batchId: uploadForm.batchId,
                recordingDate:
                    uploadForm.recordingDate || new Date().toISOString(),
                duration: uploadForm.duration,
                file: uploadForm.file,
                teacherId,
            };

            const result = await recordingService.uploadRecording(uploadData);

            if (result.success && result.recording) {
                setRecordings((prev) => [result.recording!, ...prev]);
                setMessage({
                    type: "success",
                    text: "Recording uploaded successfully!",
                });

                // Reset form
                setUploadForm({
                    title: "",
                    description: "",
                    courseId: "",
                    batchId: "",
                    recordingDate: "",
                    duration: "",
                    file: null,
                });
                setUploadProgress(0);
                fetchStats(); // Refresh stats
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

    const handleDelete = async (recordingId: string) => {
        if (!confirm("Are you sure you want to delete this recording?")) return;

        try {
            const result = await recordingService.deleteRecording(recordingId);
            if (result.success) {
                setRecordings((prev) =>
                    prev.filter((r) => r._id !== recordingId)
                );
                setMessage({
                    type: "success",
                    text: "Recording deleted successfully!",
                });
                fetchStats(); // Refresh stats
            } else {
                setMessage({ type: "error", text: result.message });
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to delete recording" });
        } finally {
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Filter and sort recordings
    const filteredRecordings = recordings
        .filter((recording) => {
            const matchesSearch =
                recording.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                recording.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            const matchesCourse =
                selectedCourse === "all" ||
                recording.course._id === selectedCourse;

            const matchesStatus =
                selectedStatus === "all" ||
                (selectedStatus === "processing" && !recording.fileUrl) ||
                (selectedStatus === "ready" && recording.fileUrl) ||
                (selectedStatus === "error" && false); // No error status in current interface

            return matchesSearch && matchesCourse && matchesStatus;
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
                case "views":
                    return (b.views || 0) - (a.views || 0);
                default:
                    return 0;
            }
        });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ready":
                return "bg-green-100 text-green-800";
            case "processing":
                return "bg-yellow-100 text-yellow-800";
            case "error":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes
                .toString()
                .padStart(2, "0")}:${remainingSeconds
                .toString()
                .padStart(2, "0")}`;
        }
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Recording Management</h1>
                <Badge variant="outline" className="text-sm">
                    {filteredRecordings.length} recordings
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

            <Tabs defaultValue="recordings" className="w-full">
                <TabsList>
                    <TabsTrigger value="recordings">All Recordings</TabsTrigger>
                    <TabsTrigger value="upload">Upload Recording</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="recordings" className="space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                            <Input
                                placeholder="Search recordings..."
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
                                        {course.courseName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="processing">
                                    Processing
                                </SelectItem>
                                <SelectItem value="error">Error</SelectItem>
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
                                <SelectItem value="views">
                                    Most Viewed
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Recordings Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="h-32 bg-gray-200 rounded mb-4"></div>
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
                            {filteredRecordings.map((recording) => (
                                <Card
                                    key={recording._id}
                                    className="hover:shadow-lg transition-shadow"
                                >
                                    <CardContent className="p-4">
                                        {/* Video Thumbnail */}
                                        <div className="relative bg-gray-900 rounded-lg mb-4 h-40 flex items-center justify-center">
                                            {recording.thumbnailUrl ? (
                                                <img
                                                    src={recording.thumbnailUrl}
                                                    alt={recording.title}
                                                    className="w-full h-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Video className="h-12 w-12 text-gray-400" />
                                            )}

                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                {recording.duration
                                                    ? formatDuration(
                                                          recording.duration
                                                      )
                                                    : "00:00"}
                                            </div>

                                            <div className="absolute top-2 left-2">
                                                <Badge
                                                    className={getStatusColor(
                                                        recording.fileUrl
                                                            ? "ready"
                                                            : "processing"
                                                    )}
                                                >
                                                    {recording.fileUrl
                                                        ? "Ready"
                                                        : "Processing"}
                                                </Badge>
                                            </div>

                                            <div className="absolute top-2 right-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(
                                                            recording._id
                                                        )
                                                    }
                                                    className="text-red-600 hover:text-red-800 bg-white"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {recording.title}
                                        </h3>

                                        {recording.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {recording.description}
                                            </p>
                                        )}

                                        <div className="space-y-2 mb-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Video className="h-4 w-4" />
                                                <span>
                                                    {recording.course?.name ||
                                                        "Unknown Course"}
                                                </span>
                                            </div>

                                            {recording.createdAt && (
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {format(
                                                            new Date(
                                                                recording.createdAt
                                                            ),
                                                            "MMM dd, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                <span>
                                                    {recording.views || 0} views
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1"
                                                disabled={!recording.fileUrl}
                                                onClick={() =>
                                                    window.open(
                                                        recording.fileUrl,
                                                        "_blank"
                                                    )
                                                }
                                            >
                                                <Play className="h-4 w-4 mr-2" />
                                                Play
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    // Open analytics for this recording
                                                    console.log(
                                                        "View analytics for:",
                                                        recording._id
                                                    );
                                                }}
                                            >
                                                <BarChart3 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {!loading && filteredRecordings.length === 0 && (
                        <div className="text-center py-12">
                            <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">
                                No recordings found
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm ||
                                selectedCourse !== "all" ||
                                selectedStatus !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "No recordings have been uploaded yet"}
                            </p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="upload" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Upload New Recording
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
                                        placeholder="Recording title..."
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="duration">
                                        Duration (minutes)
                                    </Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        value={uploadForm.duration}
                                        onChange={(e) =>
                                            setUploadForm({
                                                ...uploadForm,
                                                duration: e.target.value,
                                            })
                                        }
                                        placeholder="Duration in minutes..."
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={uploadForm.description}
                                    onChange={(e) =>
                                        setUploadForm({
                                            ...uploadForm,
                                            description: e.target.value,
                                        })
                                    }
                                    placeholder="Recording description..."
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
                                                    {course.courseName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="batch">Batch</Label>
                                    <Select
                                        value={uploadForm.batchId}
                                        onValueChange={(value) =>
                                            setUploadForm({
                                                ...uploadForm,
                                                batchId: value,
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
                                                    {batch.batchName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="recordingDate">
                                    Recording Date
                                </Label>
                                <Input
                                    id="recordingDate"
                                    type="date"
                                    value={uploadForm.recordingDate}
                                    onChange={(e) =>
                                        setUploadForm({
                                            ...uploadForm,
                                            recordingDate: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <Label htmlFor="file">Video File *</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    onChange={(e) =>
                                        setUploadForm({
                                            ...uploadForm,
                                            file: e.target.files?.[0] || null,
                                        })
                                    }
                                    accept=".mp4,.avi,.mov,.mkv,.webm"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Supported formats: MP4, AVI, MOV, MKV, WebM
                                    (Max: 500MB)
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
                                        Upload Recording
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Video className="h-5 w-5 text-blue-500" />
                                    <span className="font-medium">
                                        Total Recordings
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {stats.totalRecordings}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="h-5 w-5 text-green-500" />
                                    <span className="font-medium">
                                        Total Views
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {stats.totalViews}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <BarChart3 className="h-5 w-5 text-purple-500" />
                                    <span className="font-medium">
                                        Avg. View Time
                                    </span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {stats.averageViewTime
                                        ? formatDuration(stats.averageViewTime)
                                        : "0:00"}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="h-5 w-5 text-orange-500" />
                                    <span className="font-medium">Courses</span>
                                </div>
                                <div className="text-2xl font-bold">
                                    {
                                        new Set(
                                            recordings.map((r) => r.course._id)
                                        ).size
                                    }
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Popular Recordings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {recordings
                                        .sort(
                                            (a, b) =>
                                                (b.views || 0) - (a.views || 0)
                                        )
                                        .slice(0, 5)
                                        .map((recording, index) => (
                                            <div
                                                key={recording._id}
                                                className="flex items-center justify-between p-3 border rounded-lg"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold text-lg text-gray-500">
                                                        #{index + 1}
                                                    </span>
                                                    <div>
                                                        <p className="font-medium">
                                                            {recording.title}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {
                                                                recording.course
                                                                    ?.name
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="outline">
                                                    {recording.views || 0} views
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recording Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        {
                                            status: "ready",
                                            label: "Ready",
                                            count: recordings.filter(
                                                (r) => r.fileUrl
                                            ).length,
                                        },
                                        {
                                            status: "processing",
                                            label: "Processing",
                                            count: recordings.filter(
                                                (r) => !r.fileUrl
                                            ).length,
                                        },
                                        {
                                            status: "error",
                                            label: "Error",
                                            count: 0, // No error status in current interface
                                        },
                                    ].map((item) => (
                                        <div
                                            key={item.status}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Badge
                                                    className={getStatusColor(
                                                        item.status
                                                    )}
                                                >
                                                    {item.label}
                                                </Badge>
                                            </div>
                                            <span className="font-semibold">
                                                {item.count}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TeacherRecordingManagementPage;
