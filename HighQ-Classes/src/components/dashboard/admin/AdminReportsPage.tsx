import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    BarChart3,
    TrendingUp,
    Users,
    GraduationCap,
    DollarSign,
    Calendar,
    Download,
    Filter,
    RefreshCw,
    PieChart,
    Activity,
    Award,
    Clock,
    Target,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ReportData {
    students: {
        total: number;
        active: number;
        newThisMonth: number;
        performance: number;
    };
    teachers: {
        total: number;
        active: number;
        newThisMonth: number;
        avgRating: number;
    };
    courses: {
        total: number;
        active: number;
        completed: number;
        revenue: number;
    };
    attendance: {
        overall: number;
        thisWeek: number;
        trend: string;
    };
}

const AdminReportsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState("month");
    const [reportType, setReportType] = useState("overview");
    const [dashboardData, setDashboardData] = useState<any>(null);

    const [reportData, setReportData] = useState<ReportData>({
        students: {
            total: 0,
            active: 0,
            newThisMonth: 0,
            performance: 87,
        },
        teachers: {
            total: 0,
            active: 0,
            newThisMonth: 0,
            avgRating: 4.6,
        },
        courses: {
            total: 0,
            active: 0,
            completed: 0,
            revenue: 0,
        },
        attendance: {
            overall: 85,
            thisWeek: 92,
            trend: "up",
        },
    });

    useEffect(() => {
        fetchReportsData();
    }, [timeRange, reportType]);

    const fetchReportsData = async () => {
        setLoading(true);
        try {
            const [dashboardResponse, studentsResponse, teachersResponse] =
                await Promise.all([
                    AdminService.getAdminData(),
                    AdminService.getAllStudents(),
                    AdminService.getAllTeachers(),
                ]);

            if (dashboardResponse.success && dashboardResponse.data) {
                setDashboardData(dashboardResponse.data);

                // Update report data with real dashboard data
                setReportData((prev) => ({
                    ...prev,
                    students: {
                        total: dashboardResponse.data.totalStudents || 0,
                        active: dashboardResponse.data.activeStudents || 0,
                        newThisMonth: Math.floor(
                            (dashboardResponse.data.totalStudents || 0) * 0.12
                        ), // Estimate
                        performance: prev.students.performance,
                    },
                    teachers: {
                        total: dashboardResponse.data.totalTeachers || 0,
                        active: dashboardResponse.data.activeTeachers || 0,
                        newThisMonth: Math.floor(
                            (dashboardResponse.data.totalTeachers || 0) * 0.17
                        ), // Estimate
                        avgRating: prev.teachers.avgRating,
                    },
                    courses: {
                        total: dashboardResponse.data.totalCourses || 0,
                        active: dashboardResponse.data.activeCourses || 0,
                        completed: dashboardResponse.data.completedCourses || 0,
                        revenue: dashboardResponse.data.totalRevenue || 0,
                    },
                }));
            }

            // If we have additional student/teacher data, use it
            if (studentsResponse.success && studentsResponse.students) {
                setReportData((prev) => ({
                    ...prev,
                    students: {
                        ...prev.students,
                        total:
                            studentsResponse.students?.length ||
                            prev.students.total,
                        active:
                            studentsResponse.students?.length ||
                            prev.students.active,
                    },
                }));
            }

            if (teachersResponse.success && teachersResponse.teachers) {
                setReportData((prev) => ({
                    ...prev,
                    teachers: {
                        ...prev.teachers,
                        total:
                            teachersResponse.teachers?.length ||
                            prev.teachers.total,
                        active:
                            teachersResponse.teachers?.length ||
                            prev.teachers.active,
                    },
                }));
            }
        } catch (error) {
            console.error("Error fetching reports data:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        }
        if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} L`;
        }
        if (amount >= 1000) {
            return `₹${(amount / 1000).toFixed(1)}k`;
        }
        return `₹${amount}`;
    };

    const generateReport = () => {
        fetchReportsData();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading reports...</span>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        Reports & Analytics
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Comprehensive insights and performance metrics
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[150px]">
                            <Calendar className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">
                                This Quarter
                            </SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="overview">Overview</SelectItem>
                            <SelectItem value="students">Students</SelectItem>
                            <SelectItem value="teachers">Teachers</SelectItem>
                            <SelectItem value="financial">Financial</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={generateReport}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>

                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-700">
                                        Total Students
                                    </p>
                                    <p className="text-3xl font-bold text-blue-900">
                                        {reportData.students.total}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                        <span className="text-sm text-green-600">
                                            +{reportData.students.newThisMonth}{" "}
                                            this month
                                        </span>
                                    </div>
                                </div>
                                <Users className="h-12 w-12 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-700">
                                        Active Teachers
                                    </p>
                                    <p className="text-3xl font-bold text-green-900">
                                        {reportData.teachers.active}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <Award className="h-4 w-4 text-yellow-600 mr-1" />
                                        <span className="text-sm text-yellow-600">
                                            {reportData.teachers.avgRating} avg
                                            rating
                                        </span>
                                    </div>
                                </div>
                                <GraduationCap className="h-12 w-12 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-700">
                                        Course Revenue
                                    </p>
                                    <p className="text-3xl font-bold text-purple-900">
                                        {formatCurrency(
                                            reportData.courses.revenue
                                        )}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                                        <span className="text-sm text-green-600">
                                            +12% growth
                                        </span>
                                    </div>
                                </div>
                                <DollarSign className="h-12 w-12 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-700">
                                        Attendance Rate
                                    </p>
                                    <p className="text-3xl font-bold text-orange-900">
                                        {reportData.attendance.overall}%
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <Target className="h-4 w-4 text-blue-600 mr-1" />
                                        <span className="text-sm text-blue-600">
                                            {reportData.attendance.thisWeek}%
                                            this week
                                        </span>
                                    </div>
                                </div>
                                <Activity className="h-12 w-12 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Charts and Detailed Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Performance Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-blue-600" />
                                Student Performance Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Excellent (90-100%)
                                    </span>
                                    <Badge className="bg-green-100 text-green-800">
                                        35%
                                    </Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: "35%" }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Good (80-89%)
                                    </span>
                                    <Badge className="bg-blue-100 text-blue-800">
                                        40%
                                    </Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: "40%" }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Average (70-79%)
                                    </span>
                                    <Badge className="bg-yellow-100 text-yellow-800">
                                        20%
                                    </Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-600 h-2 rounded-full"
                                        style={{ width: "20%" }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Below Average (&lt;70%)
                                    </span>
                                    <Badge className="bg-red-100 text-red-800">
                                        5%
                                    </Badge>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-red-600 h-2 rounded-full"
                                        style={{ width: "5%" }}
                                    ></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Course Enrollment Trends */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-green-600" />
                                Course Enrollment Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        course: "JEE Advanced",
                                        enrolled: 45,
                                        trend: "+12%",
                                        color: "blue",
                                    },
                                    {
                                        course: "NEET Preparation",
                                        enrolled: 38,
                                        trend: "+8%",
                                        color: "green",
                                    },
                                    {
                                        course: "Class 12 Physics",
                                        enrolled: 32,
                                        trend: "+15%",
                                        color: "purple",
                                    },
                                    {
                                        course: "Class 11 Mathematics",
                                        enrolled: 28,
                                        trend: "+5%",
                                        color: "orange",
                                    },
                                    {
                                        course: "Foundation Course",
                                        enrolled: 22,
                                        trend: "+20%",
                                        color: "pink",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {item.course}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {item.enrolled} enrolled
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-green-100 text-green-800">
                                                <TrendingUp className="h-3 w-3 mr-1" />
                                                {item.trend}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Monthly Revenue */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                                Monthly Revenue
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatCurrency(850000)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        This Month
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-lg font-semibold text-green-900">
                                            {formatCurrency(320000)}
                                        </p>
                                        <p className="text-sm text-green-700">
                                            Course Fees
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <p className="text-lg font-semibold text-blue-900">
                                            {formatCurrency(530000)}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            Other Fees
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-green-600">
                                    <TrendingUp className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                        +18% from last month
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Teacher Performance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-yellow-600" />
                                Top Performing Teachers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    {
                                        name: "Dr. Rajesh Kumar",
                                        subject: "Physics",
                                        rating: 4.9,
                                        students: 45,
                                    },
                                    {
                                        name: "Prof. Priya Sharma",
                                        subject: "Mathematics",
                                        rating: 4.8,
                                        students: 42,
                                    },
                                    {
                                        name: "Dr. Amit Singh",
                                        subject: "Chemistry",
                                        rating: 4.7,
                                        students: 38,
                                    },
                                    {
                                        name: "Prof. Neha Gupta",
                                        subject: "Biology",
                                        rating: 4.6,
                                        students: 35,
                                    },
                                ].map((teacher, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {teacher.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {teacher.subject}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Award className="h-4 w-4 text-yellow-500" />
                                                <span className="font-medium">
                                                    {teacher.rating}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                {teacher.students} students
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activities */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-gray-600" />
                            Recent Activities
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    action: "New student enrollment",
                                    detail: "Rahul Sharma enrolled in JEE Advanced batch",
                                    time: "2 hours ago",
                                    type: "success",
                                },
                                {
                                    action: "Fee payment received",
                                    detail: "₹15,000 payment from Priya Patel for NEET course",
                                    time: "4 hours ago",
                                    type: "info",
                                },
                                {
                                    action: "Teacher rating updated",
                                    detail: "Dr. Rajesh Kumar received 5-star rating",
                                    time: "6 hours ago",
                                    type: "success",
                                },
                                {
                                    action: "Course completion",
                                    detail: "12th Physics batch completed Chapter 5",
                                    time: "8 hours ago",
                                    type: "neutral",
                                },
                                {
                                    action: "Attendance alert",
                                    detail: "Low attendance detected in Foundation batch",
                                    time: "1 day ago",
                                    type: "warning",
                                },
                            ].map((activity, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 border-l-4 border-l-blue-500 bg-blue-50"
                                >
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {activity.action}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {activity.detail}
                                        </p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminReportsPage;
