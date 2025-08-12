import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Calendar,
    Clock,
    User,
    BookOpen,
    Video,
    Play,
    Users,
    MapPin,
    AlertCircle,
    CheckCircle,
    Loader2,
    Eye,
    Download,
} from "lucide-react";
import { StudentUser } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";

interface ClassSchedule {
    _id: string;
    subject: string;
    time: string;
    teacher: string;
    room?: string;
    day: string;
    duration?: string;
    course?: string;
    isActive: boolean;
}

interface Recording {
    _id: string;
    title: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: string;
    uploadedAt: string;
    course: string;
    teacher: string;
    viewCount: number;
    isActive: boolean;
}

const MyClasses: React.FC = () => {
    const { state } = useAuth();
    const user =
        state.user && state.user.role === "student"
            ? (state.user as unknown as StudentUser)
            : null;

    const [schedules, setSchedules] = useState<ClassSchedule[]>([]);
    const [recordings, setRecordings] = useState<Recording[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("schedule");

    useEffect(() => {
        const fetchClassData = async () => {
            if (!user) return;

            try {
                setIsLoading(true);

                // Fetch recordings - don't pass studentId
                const recordingsData =
                    await studentService.getStudentRecordings();

                // Ensure recordingsData is an array
                if (Array.isArray(recordingsData)) {
                    setRecordings(recordingsData);
                } else {
                    console.warn(
                        "Recordings data is not an array:",
                        recordingsData
                    );
                    setRecordings([]);
                }

                // Try to fetch dashboard data to get schedule information
                try {
                    const dashboardData = await studentService.getDashboard();
                    const scheduleData = dashboardData.upcomingClasses.map(
                        (classItem) => ({
                            _id: classItem._id,
                            subject: classItem.subject,
                            time: classItem.time,
                            teacher: classItem.teacher,
                            room: classItem.room,
                            day: "Today", // This comes from today's schedule
                            duration: "60 mins", // Default duration
                            course: classItem.subject,
                            isActive: true,
                        })
                    );
                    setSchedules(scheduleData);
                } catch (dashboardError) {
                    console.error(
                        "Failed to fetch schedule from dashboard:",
                        dashboardError
                    );
                    // Use mock data as fallback
                    const mockSchedule: ClassSchedule[] = [
                        {
                            _id: "1",
                            subject: "Mathematics",
                            time: "09:00 AM",
                            teacher: "Prof. John Smith",
                            room: "Room 101",
                            day: "Monday",
                            duration: "1 hour",
                            course: "Advanced Math",
                            isActive: true,
                        },
                        {
                            _id: "2",
                            subject: "Physics",
                            time: "11:00 AM",
                            teacher: "Dr. Sarah Johnson",
                            room: "Lab 201",
                            day: "Monday",
                            duration: "2 hours",
                            course: "Physics Grade 12",
                            isActive: true,
                        },
                        {
                            _id: "3",
                            subject: "Chemistry",
                            time: "02:00 PM",
                            teacher: "Prof. Mike Wilson",
                            room: "Lab 301",
                            day: "Tuesday",
                            duration: "1.5 hours",
                            course: "Organic Chemistry",
                            isActive: true,
                        },
                    ];
                    setSchedules(mockSchedule);
                }

                setError(null);
            } catch (err: any) {
                console.error("Class data fetch error:", err);
                setError(err.message || "Failed to load class data");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClassData();
    }, [user]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDuration = (duration: string) => {
        // Convert duration string to readable format
        return duration || "N/A";
    };

    const handleWatchRecording = (recording: Recording) => {
        // Open video in new tab or embedded player
        window.open(recording.videoUrl, "_blank");
    };

    const getTodaySchedule = () => {
        const today = new Date().toLocaleDateString("en-US", {
            weekday: "long",
        });
        return schedules.filter((schedule) => schedule.day === today);
    };

    const getWeekSchedule = () => {
        const days = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];
        return days.map((day) => ({
            day,
            classes: schedules.filter((schedule) => schedule.day === day),
        }));
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
                                your classes.
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
                    <p className="text-gray-600">Loading your classes...</p>
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        My Classes
                    </h1>
                    <p className="text-gray-600 mt-1">
                        View your class schedule and recorded lectures
                    </p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        {schedules.length} Scheduled Classes
                    </Badge>
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        {recordings.length} Recordings Available
                    </Badge>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="schedule">Class Schedule</TabsTrigger>
                    <TabsTrigger value="today">Today's Classes</TabsTrigger>
                    <TabsTrigger value="recordings">
                        Recorded Lectures
                    </TabsTrigger>
                </TabsList>

                {/* Weekly Schedule */}
                <TabsContent value="schedule" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                Weekly Schedule
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {getWeekSchedule().map(({ day, classes }) => (
                                    <div key={day}>
                                        <h3 className="font-semibold text-lg mb-3">
                                            {day}
                                        </h3>
                                        {classes.length === 0 ? (
                                            <p className="text-gray-500 text-sm">
                                                No classes scheduled
                                            </p>
                                        ) : (
                                            <div className="grid gap-3">
                                                {classes.map((classItem) => (
                                                    <Card
                                                        key={classItem._id}
                                                        className="border-l-4 border-l-blue-500"
                                                    >
                                                        <CardContent className="p-4">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="text-center">
                                                                        <div className="text-lg font-semibold text-blue-600">
                                                                            {
                                                                                classItem.time
                                                                            }
                                                                        </div>
                                                                        <div className="text-xs text-gray-500">
                                                                            {
                                                                                classItem.duration
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-semibold">
                                                                            {
                                                                                classItem.subject
                                                                            }
                                                                        </h4>
                                                                        <p className="text-sm text-gray-600">
                                                                            with{" "}
                                                                            {
                                                                                classItem.teacher
                                                                            }
                                                                        </p>
                                                                        {classItem.room && (
                                                                            <p className="text-xs text-gray-500 flex items-center mt-1">
                                                                                <MapPin className="h-3 w-3 mr-1" />
                                                                                {
                                                                                    classItem.room
                                                                                }
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline">
                                                                    {
                                                                        classItem.course
                                                                    }
                                                                </Badge>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Today's Classes */}
                <TabsContent value="today" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Clock className="h-5 w-5 mr-2 text-green-600" />
                                Today's Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {getTodaySchedule().length === 0 ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No Classes Today
                                    </h3>
                                    <p className="text-gray-600">
                                        Enjoy your free day! Check back tomorrow
                                        for your schedule.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getTodaySchedule().map((classItem) => (
                                        <Card
                                            key={classItem._id}
                                            className="border-l-4 border-l-green-500"
                                        >
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="text-center">
                                                            <div className="text-xl font-bold text-green-600">
                                                                {classItem.time}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {
                                                                    classItem.duration
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-semibold">
                                                                {
                                                                    classItem.subject
                                                                }
                                                            </h4>
                                                            <p className="text-gray-600 flex items-center">
                                                                <User className="h-4 w-4 mr-1" />
                                                                {
                                                                    classItem.teacher
                                                                }
                                                            </p>
                                                            {classItem.room && (
                                                                <p className="text-gray-500 flex items-center mt-1">
                                                                    <MapPin className="h-4 w-4 mr-1" />
                                                                    {
                                                                        classItem.room
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge
                                                            variant="default"
                                                            className="mb-2"
                                                        >
                                                            {classItem.course}
                                                        </Badge>
                                                        <div className="text-sm text-gray-500">
                                                            Starting soon
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Recorded Lectures */}
                <TabsContent value="recordings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Video className="h-5 w-5 mr-2 text-purple-600" />
                                Recorded Lectures
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!Array.isArray(recordings) ||
                            recordings.length === 0 ? (
                                <div className="text-center py-8">
                                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No Recordings Available
                                    </h3>
                                    <p className="text-gray-600">
                                        Recorded lectures will appear here once
                                        your teachers upload them.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {Array.isArray(recordings) &&
                                        recordings.map((recording) => (
                                            <Card
                                                key={recording._id}
                                                className="hover:shadow-lg transition-shadow"
                                            >
                                                <CardHeader className="pb-3">
                                                    <div className="relative">
                                                        {recording.thumbnailUrl ? (
                                                            <img
                                                                src={
                                                                    recording.thumbnailUrl
                                                                }
                                                                alt={
                                                                    recording.title
                                                                }
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                                                                <Video className="h-8 w-8 text-white" />
                                                            </div>
                                                        )}
                                                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                            {formatDuration(
                                                                recording.duration ||
                                                                    "N/A"
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CardTitle className="text-lg line-clamp-2">
                                                        {recording.title}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    {recording.description && (
                                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                            {
                                                                recording.description
                                                            }
                                                        </p>
                                                    )}

                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                                        <span className="flex items-center">
                                                            <User className="h-3 w-3 mr-1" />
                                                            {recording.teacher}
                                                        </span>
                                                        <span className="flex items-center">
                                                            <Eye className="h-3 w-3 mr-1" />
                                                            {
                                                                recording.viewCount
                                                            }{" "}
                                                            views
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-gray-500 mb-3">
                                                        Uploaded:{" "}
                                                        {formatDate(
                                                            recording.uploadedAt
                                                        )}
                                                    </div>

                                                    <Button
                                                        onClick={() =>
                                                            handleWatchRecording(
                                                                recording
                                                            )
                                                        }
                                                        className="w-full"
                                                        size="sm"
                                                    >
                                                        <Play className="h-4 w-4 mr-2" />
                                                        Watch Now
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MyClasses;
