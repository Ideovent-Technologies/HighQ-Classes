import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Bell,
    Calendar,
    User,
    AlertCircle,
    CheckCircle,
    Loader2,
    Clock,
    BookOpen,
} from "lucide-react";
import { StudentUser } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";

interface Notice {
    _id: string;
    title: string;
    message: string;
    createdAt: string;
    postedBy: {
        name: string;
        role: string;
    };
    targetAudience: string;
    batch?: string;
    course?: string;
    isImportant: boolean;
    read?: boolean;
}

const StudentNotices: React.FC = () => {
    const { state } = useAuth();
    const user =
        state.user && state.user.role === "student"
            ? (state.user as unknown as StudentUser)
            : null;

    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNotices = async () => {
            if (!user) return;

            try {
                setIsLoading(true);
                // Fetch student dashboard data which includes notices
                const dashboardData = await studentService.getDashboard();

                // Extract notices from dashboard data
                if (dashboardData && dashboardData.notifications) {
                    // Map notifications to notices format
                    const mappedNotices = dashboardData.notifications.map(
                        (notification) => ({
                            _id: notification._id,
                            title: notification.title,
                            message: notification.message,
                            createdAt: notification.date,
                            postedBy: {
                                name: "System",
                                role: "admin",
                            },
                            targetAudience: "all",
                            isImportant:
                                notification.type === "warning" ||
                                notification.type === "error",
                            read: notification.read,
                        })
                    );
                    setNotices(mappedNotices);
                } else {
                    setNotices([]);
                }

                setError(null);
            } catch (err: any) {
                console.error("Notices fetch error:", err);
                setError(err.message || "Failed to load notices");
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotices();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getNoticePriority = (notice: Notice) => {
        if (notice.isImportant) return "high";
        if (notice.targetAudience === "batch") return "medium";
        return "low";
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "high":
                return "bg-red-100 text-red-800 border-red-200";
            case "medium":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "low":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    if (!user) {
        return (
            <div className="flex justify-center items-center h-96">
                <Card className="p-6">
                    <CardContent>
                        <div className="text-center">
                            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Please Login
                            </h3>
                            <p className="text-gray-600">
                                You need to be logged in as a student to view
                                notices.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
                    <p className="text-gray-600">Loading notices...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <Alert className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="ml-2 text-blue-600 hover:text-blue-800 underline"
                        >
                            Try again
                        </button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Bell className="h-8 w-8 text-blue-600 mr-3" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Notice Board
                        </h1>
                    </div>
                    <p className="text-gray-600">
                        Stay updated with the latest announcements and important
                        information
                    </p>
                </div>

                {/* Notices List */}
                {notices.length === 0 ? (
                    <Card>
                        <CardContent className="p-8">
                            <div className="text-center">
                                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Notices Available
                                </h3>
                                <p className="text-gray-600">
                                    New notices and announcements will appear
                                    here.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {notices.map((notice) => {
                            const priority = getNoticePriority(notice);
                            const priorityColor = getPriorityColor(priority);

                            return (
                                <Card
                                    key={notice._id}
                                    className={`transition-all duration-200 hover:shadow-lg ${
                                        notice.isImportant
                                            ? "border-l-4 border-l-red-500"
                                            : ""
                                    }`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                                                    {notice.title}
                                                </CardTitle>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <User className="h-4 w-4 mr-1" />
                                                        {notice.postedBy
                                                            ?.name || "System"}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {formatDate(
                                                            notice.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {notice.isImportant && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="text-xs"
                                                    >
                                                        Important
                                                    </Badge>
                                                )}
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${priorityColor}`}
                                                >
                                                    {notice.targetAudience ===
                                                    "all"
                                                        ? "All Students"
                                                        : notice.targetAudience ===
                                                          "batch"
                                                        ? "Your Batch"
                                                        : "Course Specific"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700 leading-relaxed">
                                            {notice.message}
                                        </p>
                                        {(notice.batch || notice.course) && (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    {notice.batch && (
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            Batch:{" "}
                                                            {notice.batch}
                                                        </div>
                                                    )}
                                                    {notice.course && (
                                                        <div className="flex items-center">
                                                            <BookOpen className="h-4 w-4 mr-1" />
                                                            Course:{" "}
                                                            {notice.course}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentNotices;
