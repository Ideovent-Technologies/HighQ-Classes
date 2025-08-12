import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Calendar,
    Clock,
    Users,
    BookOpen,
    Video,
    FileText,
    CheckCircle,
    User,
    GraduationCap,
    CalendarDays,
    School,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import batchService, { StudentBatchInfo } from "@/API/services/batchService";

const StudentBatch: React.FC = () => {
    const [batchInfo, setBatchInfo] = useState<StudentBatchInfo | null>(null);
    const [materials, setMaterials] = useState<any[]>([]);
    const [recordings, setRecordings] = useState<any[]>([]);
    const [assignments, setAssignments] = useState<any[]>([]);
    const [attendance, setAttendance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBatchData();
    }, []);

    const fetchBatchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch batch info
            const batch = await batchService.getStudentBatch();
            if (!batch) {
                setError(
                    "You are not assigned to any batch yet. Please contact admin."
                );
                return;
            }
            setBatchInfo(batch);

            // Fetch batch content in parallel
            const [
                materialsData,
                recordingsData,
                assignmentsData,
                attendanceData,
            ] = await Promise.allSettled([
                batchService.getBatchMaterials(),
                batchService.getBatchRecordings(),
                batchService.getBatchAssignments(),
                batchService.getStudentAttendance(),
            ]);

            if (materialsData.status === "fulfilled")
                setMaterials(materialsData.value);
            if (recordingsData.status === "fulfilled")
                setRecordings(recordingsData.value);
            if (assignmentsData.status === "fulfilled")
                setAssignments(assignmentsData.value);
            if (attendanceData.status === "fulfilled")
                setAttendance(attendanceData.value);
        } catch (err: any) {
            console.error("Error fetching batch data:", err);
            setError(err.message || "Failed to load batch information");
        } finally {
            setLoading(false);
        }
    };

    const handleViewMaterial = async (materialId: string) => {
        try {
            await batchService.viewMaterial(materialId);
            // Navigate to material viewer
            navigate(`/student/materials/${materialId}`);
        } catch (error) {
            console.error("Error viewing material:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert className="border-orange-200 bg-orange-50">
                    <AlertDescription className="text-orange-800">
                        {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!batchInfo) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert>
                    <AlertDescription>
                        You are not assigned to any batch yet. Please contact
                        your administrator.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-6">
            {/* Batch Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {batchInfo.name}
                        </h1>
                        <p className="text-blue-100 text-lg">
                            {batchInfo.course.name}
                        </p>
                    </div>
                    <Badge
                        variant={batchInfo.isActive ? "default" : "secondary"}
                        className="text-lg px-4 py-2"
                    >
                        {batchInfo.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>
            </div>

            {/* Batch Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                        <User className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="text-sm text-gray-600">Teacher</p>
                            <p className="font-semibold">
                                {batchInfo.teacher.name}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                        <Users className="h-8 w-8 text-green-600" />
                        <div>
                            <p className="text-sm text-gray-600">Students</p>
                            <p className="font-semibold">
                                {batchInfo.totalStudents}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                        <CalendarDays className="h-8 w-8 text-purple-600" />
                        <div>
                            <p className="text-sm text-gray-600">Schedule</p>
                            <p className="font-semibold">
                                {batchInfo.schedule.days.join(", ")}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 flex items-center space-x-3">
                        <Clock className="h-8 w-8 text-orange-600" />
                        <div>
                            <p className="text-sm text-gray-600">Time</p>
                            <p className="font-semibold">
                                {batchInfo.schedule.startTime} -{" "}
                                {batchInfo.schedule.endTime}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Batch Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Course Information */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <School className="h-5 w-5" />
                            Course Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-lg">
                                {batchInfo.course.name}
                            </h3>
                            {batchInfo.course.description && (
                                <p className="text-gray-600 mt-2">
                                    {batchInfo.course.description}
                                </p>
                            )}
                        </div>

                        {batchInfo.course.topics &&
                            batchInfo.course.topics.length > 0 && (
                                <div>
                                    <h4 className="font-medium mb-2">
                                        Topics Covered:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {batchInfo.course.topics.map(
                                            (topic, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                >
                                                    {topic}
                                                </Badge>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}

                        <Separator />

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Start Date
                                </p>
                                <p className="font-medium">
                                    {formatDate(batchInfo.startDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    End Date
                                </p>
                                <p className="font-medium">
                                    {formatDate(batchInfo.endDate)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Teacher Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            Your Teacher
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            {batchInfo.teacher.profilePicture ? (
                                <img
                                    src={batchInfo.teacher.profilePicture}
                                    alt={batchInfo.teacher.name}
                                    className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-3">
                                    <User className="h-8 w-8 text-gray-400" />
                                </div>
                            )}
                            <h3 className="font-semibold text-lg">
                                {batchInfo.teacher.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {batchInfo.teacher.email}
                            </p>
                            {batchInfo.teacher.qualification && (
                                <p className="text-sm text-blue-600 mt-1">
                                    {batchInfo.teacher.qualification}
                                </p>
                            )}
                            {batchInfo.teacher.specialization && (
                                <p className="text-sm text-gray-500">
                                    {batchInfo.teacher.specialization}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Materials */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            Materials ({materials.length})
                        </CardTitle>
                        <CardDescription>
                            Study materials and resources
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {materials.length > 0 ? (
                            <div className="space-y-2">
                                {materials
                                    .slice(0, 3)
                                    .map((material, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded-lg"
                                        >
                                            <h4 className="font-medium text-sm">
                                                {material.title || "Material"}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {material.type || "Document"}
                                            </p>
                                        </div>
                                    ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                    onClick={() =>
                                        navigate("/student/materials")
                                    }
                                >
                                    View All Materials
                                </Button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No materials available yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Recordings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5" />
                            Recordings ({recordings.length})
                        </CardTitle>
                        <CardDescription>
                            Class recordings and lectures
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {recordings.length > 0 ? (
                            <div className="space-y-2">
                                {recordings
                                    .slice(0, 3)
                                    .map((recording, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded-lg"
                                        >
                                            <h4 className="font-medium text-sm">
                                                {recording.title || "Recording"}
                                            </h4>
                                            <p className="text-xs text-gray-600">
                                                {recording.duration || "Video"}
                                            </p>
                                        </div>
                                    ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                    onClick={() =>
                                        navigate("/student/recordings")
                                    }
                                >
                                    View All Recordings
                                </Button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No recordings available yet
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Assignments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Assignments ({assignments.length})
                        </CardTitle>
                        <CardDescription>
                            Pending and completed assignments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {assignments.length > 0 ? (
                            <div className="space-y-2">
                                {assignments
                                    .slice(0, 3)
                                    .map((assignment, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded-lg"
                                        >
                                            <h4 className="font-medium text-sm">
                                                {assignment.title ||
                                                    "Assignment"}
                                            </h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-gray-600">
                                                    {assignment.dueDate
                                                        ? `Due: ${formatDate(
                                                              assignment.dueDate
                                                          )}`
                                                        : "No due date"}
                                                </p>
                                                {assignment.completed && (
                                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full mt-3"
                                    onClick={() =>
                                        navigate("/student/assignments")
                                    }
                                >
                                    View All Assignments
                                </Button>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                No assignments available yet
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                        Access your batch content and activities
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center gap-2"
                            onClick={() => navigate("/student/materials")}
                        >
                            <BookOpen className="h-6 w-6" />
                            <span>Materials</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center gap-2"
                            onClick={() => navigate("/student/recordings")}
                        >
                            <Video className="h-6 w-6" />
                            <span>Recordings</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center gap-2"
                            onClick={() => navigate("/student/assignments")}
                        >
                            <FileText className="h-6 w-6" />
                            <span>Assignments</span>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-20 flex flex-col items-center gap-2"
                            onClick={() => navigate("/student/attendance")}
                        >
                            <Calendar className="h-6 w-6" />
                            <span>Attendance</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentBatch;
