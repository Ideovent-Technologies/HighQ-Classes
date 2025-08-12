import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { FullScreenLoader } from "@/components/common/Loader";
import { Separator } from "@/components/ui/separator";
import {
    Book,
    Clock,
    Calendar,
    Target,
    User,
    Bell,
    BookOpen,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Users,
    Award,
    FileText,
    Video,
    GraduationCap,
    BarChart3,
    DollarSign,
} from "lucide-react";
import { StudentUser, StudentDashboardData } from "@/types/student.types";
import { studentService } from "@/API/services/studentService";
import { Link } from "react-router-dom";
import { useBatchInfo } from "@/hooks/useBatch";

interface DashboardStats {
    totalCourses: number;
    completedAssignments: number;
    pendingAssignments: number;
    attendancePercentage: number;
    averageGrade: number;
    upcomingClasses: number;
}

const StudentDashboard: React.FC = () => {
    const { state } = useAuth();
    // Safe type conversion for student user
    const user =
        state.user && state.user.role === "student"
            ? (state.user as unknown as StudentUser)
            : null;
    const [dashboardData, setDashboardData] =
        useState<StudentDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get batch information
    const {
        batchInfo,
        loading: batchLoading,
        error: batchError,
        isAssigned,
    } = useBatchInfo();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const data = await studentService.getDashboard();

                // Merge auth user data with dashboard data
                if (user && data) {
                    data.student = {
                        ...data.student,
                        _id: user._id || "",
                        name: user.name || data.student.name,
                        email: user.email || "",
                        batch: user.batch || data.student.batch,
                        grade: user.grade || "",
                        parentName: user.parentName || "",
                        parentContact: user.parentContact || "",
                        schoolName: user.schoolName || "",
                        mobile: user.mobile || "",
                    };
                }

                setDashboardData(data);
                console.log(data)
                setError(null);
            } catch (err: any) {
                console.error("Dashboard fetch error:", err);
                setError(err.message || "Failed to load dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchDashboardData();
        } else {
            setIsLoading(false);
        }
    }, [user, state]);

    const calculateStats = (): DashboardStats => {
        if (!dashboardData) {
            return {
                totalCourses: 0,
                completedAssignments: 0,
                pendingAssignments: 0,
                attendancePercentage: 0,
                averageGrade: 0,
                upcomingClasses: 0,
            };
        }

        const completedAssignments = dashboardData.assignments.filter(
            (a) => a.status === "graded"
        ).length;
        const pendingAssignments = dashboardData.assignments.filter(
            (a) => a.status === "pending"
        ).length;
        const gradedAssignments = dashboardData.assignments.filter(
            (a) => a.status === "graded" && a.marks !== undefined
        );
        const averageGrade =
            gradedAssignments.length > 0
                ? gradedAssignments.reduce(
                      (sum, a) => sum + (a.marks || 0),
                      0
                  ) / gradedAssignments.length
                : 0;

        return {
            totalCourses: dashboardData.student.courses?.length || 0,
            completedAssignments,
            pendingAssignments,
            attendancePercentage:
                dashboardData.attendanceSummary.percentage || 0,
            averageGrade,
            upcomingClasses: dashboardData.upcomingClasses.length,
        };
    };

    const stats = calculateStats();

    // Early return if no user
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
                                this dashboard.
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
                {/* <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div> */}
                <FullScreenLoader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-96">
                <Card className="p-6">
                    <CardContent>
                        <div className="text-center">
                            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Failed to Load Dashboard
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage
                            src={user?.profilePicture}
                            alt={user?.name}
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-xl">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Welcome back, {user?.name?.split(" ")[0]}! 👋
                        </h1>
                        <p className="text-gray-600">
                            {user?.batch?.name} • {user?.grade} Grade
                        </p>
                    </div>
                </div>
                <div className="mt-4 md:mt-0">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Student: {user?.name}
                    </Badge>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Courses</p>
                                <p className="text-2xl font-bold">
                                    {stats.totalCourses}
                                </p>
                            </div>
                            <Book className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Attendance</p>
                                <p className="text-2xl font-bold">
                                    {stats.attendancePercentage.toFixed(1)}%
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">Avg. Grade</p>
                                <p className="text-2xl font-bold">
                                    {stats.averageGrade.toFixed(1)}
                                </p>
                            </div>
                            <Award className="h-8 w-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Pending Work</p>
                                <p className="text-2xl font-bold">
                                    {stats.pendingAssignments}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Batch Information Section */}
            {isAssigned && batchInfo && (
                <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <GraduationCap className="h-6 w-6 mr-2" />
                                Your Batch: {batchInfo.name}
                            </div>
                            <Link to="/student/batch">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-purple-700"
                                >
                                    View Details
                                </Button>
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-indigo-200 text-sm">
                                    Course
                                </p>
                                <p className="font-semibold">
                                    {batchInfo.course.name}
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-indigo-200 text-sm">
                                    Teacher
                                </p>
                                <p className="font-semibold">
                                    {batchInfo.teacher.name}
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-indigo-200 text-sm">
                                    Schedule
                                </p>
                                <p className="font-semibold text-sm">
                                    {batchInfo.schedule.days.join(", ")}
                                </p>
                                <p className="text-indigo-200 text-xs">
                                    {batchInfo.schedule.startTime} -{" "}
                                    {batchInfo.schedule.endTime}
                                </p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <p className="text-indigo-200 text-sm">
                                    Students
                                </p>
                                <p className="font-semibold">
                                    {batchInfo.totalStudents}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <Link to="/student/materials">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-purple-700"
                                >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Materials
                                </Button>
                            </Link>
                            <Link to="/student/recordings">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-purple-700"
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    Recordings
                                </Button>
                            </Link>
                            <Link to="/student/assignments">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="text-purple-700"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Assignments
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* No Batch Alert */}
            {!batchLoading && !isAssigned && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-orange-600" />
                            <div>
                                <h3 className="font-semibold text-orange-900">
                                    Not Assigned to Batch
                                </h3>
                                <p className="text-orange-700 text-sm">
                                    You haven't been assigned to any batch yet.
                                    Please contact your administrator.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Upcoming Classes & Recent Assignments */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Upcoming Classes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                                Today's Classes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {dashboardData?.upcomingClasses.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">
                                    No classes scheduled for today
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {dashboardData?.upcomingClasses.map(
                                        (classItem) => (
                                            <div
                                                key={classItem._id}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                    <div>
                                                        <p className="font-semibold">
                                                            {classItem.subject}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            with{" "}
                                                            {classItem.teacher}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-blue-600">
                                                        {classItem.time}
                                                    </p>
                                                    {classItem.room && (
                                                        <p className="text-sm text-gray-600">
                                                            {classItem.room}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Recent Assignments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-green-600" />
                                    Recent Assignments
                                </div>
                                <Link to="/student/assignments">
                                    <Button variant="outline" size="sm">
                                        View All
                                    </Button>
                                </Link>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dashboardData?.assignments
                                    .slice(0, 5)
                                    .map((assignment) => (
                                        <div
                                            key={assignment._id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${
                                                        assignment.status ===
                                                        "graded"
                                                            ? "bg-green-500"
                                                            : assignment.status ===
                                                              "submitted"
                                                            ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                    }`}
                                                ></div>
                                                <div>
                                                    <p className="font-semibold">
                                                        {assignment.title}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {assignment.subject}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={
                                                        assignment.status ===
                                                        "graded"
                                                            ? "default"
                                                            : assignment.status ===
                                                              "submitted"
                                                            ? "secondary"
                                                            : "destructive"
                                                    }
                                                >
                                                    {assignment.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        assignment.status.slice(
                                                            1
                                                        )}
                                                </Badge>
                                                {assignment.marks !==
                                                    undefined && (
                                                    <p className="text-sm font-semibold text-green-600">
                                                        {assignment.marks}/
                                                        {assignment.totalMarks}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Quick Actions & Progress */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Target className="h-5 w-5 mr-2 text-purple-600" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Link to="/student/materials" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    Study Materials
                                </Button>
                            </Link>
                            <Link to="/student/recordings" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Video className="h-4 w-4 mr-2" />
                                    Video Lectures
                                </Button>
                            </Link>
                            <Link to="/student/assignments" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    My Assignments
                                </Button>
                            </Link>
                            <Link to="/student/attendance" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <Users className="h-4 w-4 mr-2" />
                                    My Attendance
                                </Button>
                            </Link>
                            <Link to="/student/fees" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Fee Details
                                </Button>
                            </Link>
                            <Link to="/student/profile" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                >
                                    <User className="h-4 w-4 mr-2" />
                                    My Profile
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Progress Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
                                Progress Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Attendance</span>
                                    <span>
                                        {stats.attendancePercentage.toFixed(1)}%
                                    </span>
                                </div>
                                <Progress
                                    value={stats.attendancePercentage}
                                    className="h-2"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Assignment Completion</span>
                                    <span>
                                        {stats.completedAssignments +
                                            stats.pendingAssignments >
                                        0
                                            ? (
                                                  (stats.completedAssignments /
                                                      (stats.completedAssignments +
                                                          stats.pendingAssignments)) *
                                                  100
                                              ).toFixed(1)
                                            : "0.0"}
                                        %
                                    </span>
                                </div>
                                <Progress
                                    value={
                                        stats.completedAssignments +
                                            stats.pendingAssignments >
                                        0
                                            ? (stats.completedAssignments /
                                                  (stats.completedAssignments +
                                                      stats.pendingAssignments)) *
                                              100
                                            : 0
                                    }
                                    className="h-2"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Average Grade</span>
                                    <span>
                                        {stats.averageGrade.toFixed(1)}/100
                                    </span>
                                </div>
                                <Progress
                                    value={(stats.averageGrade / 100) * 100}
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="h-5 w-5 mr-2 text-yellow-600" />
                                Recent Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {dashboardData?.notifications
                                    .slice(0, 3)
                                    .map((notification) => (
                                        <div
                                            key={notification._id}
                                            className="p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-xs text-gray-600 mt-1">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
