import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarCheck,
    ClipboardList,
    Users,
    BookOpen,
    TrendingUp,
    Clock,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AttendanceAssignmentDashboardProps {
    userRole: "teacher" | "admin" | "student";
}

const AttendanceAssignmentDashboard: React.FC<
    AttendanceAssignmentDashboardProps
> = ({ userRole }) => {
    const navigate = useNavigate();

    // Mock data - replace with real API data
    const attendanceStats = {
        todayPresent: 45,
        todayTotal: 50,
        weeklyAverage: 92,
        monthlyAverage: 89,
    };

    const assignmentStats = {
        totalAssignments: 12,
        submitted: 8,
        pending: 3,
        overdue: 1,
        averageGrade: 85,
    };

    const recentAttendance = [
        {
            batchName: "JavaScript Batch A",
            date: "2024-01-15",
            present: 18,
            total: 20,
        },
        {
            batchName: "React Batch B",
            date: "2024-01-15",
            present: 15,
            total: 18,
        },
        {
            batchName: "Node.js Batch C",
            date: "2024-01-15",
            present: 12,
            total: 12,
        },
    ];

    const upcomingAssignments = [
        {
            title: "React Component Assignment",
            dueDate: "2024-01-20",
            course: "React Development",
        },
        {
            title: "JavaScript Algorithms",
            dueDate: "2024-01-22",
            course: "JavaScript Fundamentals",
        },
        {
            title: "Database Design Project",
            dueDate: "2024-01-25",
            course: "Database Management",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {userRole !== "student" && (
                    <>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Today's Attendance
                                </CardTitle>
                                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {attendanceStats.todayPresent}/
                                    {attendanceStats.todayTotal}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {Math.round(
                                        (attendanceStats.todayPresent /
                                            attendanceStats.todayTotal) *
                                            100
                                    )}
                                    % present
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Weekly Average
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {attendanceStats.weeklyAverage}%
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    +2% from last week
                                </p>
                            </CardContent>
                        </Card>
                    </>
                )}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            {userRole === "student"
                                ? "My Assignments"
                                : "Total Assignments"}
                        </CardTitle>
                        <ClipboardList className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assignmentStats.totalAssignments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {assignmentStats.submitted} submitted,{" "}
                            {assignmentStats.pending} pending
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Grade
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {assignmentStats.averageGrade}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Based on graded assignments
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(userRole === "teacher" || userRole === "admin") && (
                            <>
                                <Button
                                    onClick={() =>
                                        navigate("/dashboard/attendance")
                                    }
                                    className="h-auto flex-col p-4"
                                    variant="outline"
                                >
                                    <CalendarCheck className="h-6 w-6 mb-2" />
                                    <span>Mark Attendance</span>
                                </Button>

                                <Button
                                    onClick={() =>
                                        navigate("/dashboard/assignments")
                                    }
                                    className="h-auto flex-col p-4"
                                    variant="outline"
                                >
                                    <ClipboardList className="h-6 w-6 mb-2" />
                                    <span>Create Assignment</span>
                                </Button>
                            </>
                        )}

                        {userRole === "student" && (
                            <>
                                <Button
                                    onClick={() =>
                                        navigate("/student/assignments")
                                    }
                                    className="h-auto flex-col p-4"
                                    variant="outline"
                                >
                                    <ClipboardList className="h-6 w-6 mb-2" />
                                    <span>My Assignments</span>
                                </Button>

                                <Button
                                    onClick={() =>
                                        navigate("/dashboard/attendance")
                                    }
                                    className="h-auto flex-col p-4"
                                    variant="outline"
                                >
                                    <CalendarCheck className="h-6 w-6 mb-2" />
                                    <span>My Attendance</span>
                                </Button>
                            </>
                        )}

                        <Button
                            onClick={() =>
                                navigate("/dashboard/study-materials")
                            }
                            className="h-auto flex-col p-4"
                            variant="outline"
                        >
                            <BookOpen className="h-6 w-6 mb-2" />
                            <span>Study Materials</span>
                        </Button>

                        <Button
                            onClick={() => navigate("/dashboard/schedule")}
                            className="h-auto flex-col p-4"
                            variant="outline"
                        >
                            <Clock className="h-6 w-6 mb-2" />
                            <span>Schedule</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Attendance */}
                {userRole !== "student" && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5" />
                                Recent Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentAttendance.map((record, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {record.batchName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {record.date}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">
                                                {record.present}/{record.total}
                                            </p>
                                            <Badge
                                                variant={
                                                    record.present ===
                                                    record.total
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="text-xs"
                                            >
                                                {Math.round(
                                                    (record.present /
                                                        record.total) *
                                                        100
                                                )}
                                                %
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Upcoming Assignments */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            {userRole === "student"
                                ? "Upcoming Assignments"
                                : "Recent Assignments"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingAssignments.map((assignment, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {assignment.title}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {assignment.course}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {assignment.dueDate}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            <Clock className="h-3 w-3 mr-1" />
                                            Due Soon
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Student View */}
            {userRole === "student" && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            My Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    92%
                                </div>
                                <p className="text-sm text-gray-500">
                                    Attendance Rate
                                </p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    8/12
                                </div>
                                <p className="text-sm text-gray-500">
                                    Assignments Submitted
                                </p>
                            </div>
                            <div className="text-center p-4 border rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">
                                    85%
                                </div>
                                <p className="text-sm text-gray-500">
                                    Average Grade
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AttendanceAssignmentDashboard;
