import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Users,
    Calendar as CalendarIconLucide,
    CalendarIcon,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    TrendingUp,
    User,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

interface AttendanceRecord {
    _id: string;
    studentId: string;
    date: string;
    status: "present" | "absent" | "leave";
    batchId: {
        _id: string;
        name: string;
    };
    markedBy: {
        _id: string;
        name: string;
    };
    createdAt: string;
}

interface AttendanceStatistics {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
    attendancePercentage: number;
}

interface AttendanceApiResponse {
    success: boolean;
    data: {
        attendance: AttendanceRecord[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalRecords: number;
            limit: number;
        };
        statistics: AttendanceStatistics;
    };
}

const StudentAttendance: React.FC = () => {
    const { state } = useAuth();
    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >([]);
    const [statistics, setStatistics] = useState<AttendanceStatistics | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        new Date()
    );
    const [dateRange, setDateRange] = useState({
        startDate: startOfMonth(new Date()),
        endDate: endOfMonth(new Date()),
    });

    useEffect(() => {
        fetchAttendanceData();
    }, [dateRange]);

    const fetchAttendanceData = async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                startDate: format(dateRange.startDate, "yyyy-MM-dd"),
                endDate: format(dateRange.endDate, "yyyy-MM-dd"),
            });

            const token = localStorage.getItem("authToken");
            const response = await fetch(`/api/attendance/student?${params}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            const data: AttendanceApiResponse = await response.json();

            if (data.success && data.data) {
                setAttendanceRecords(data.data.attendance || []);
                setStatistics(data.data.statistics);
            } else {
                throw new Error("Failed to fetch attendance data");
            }
        } catch (err: any) {
            console.error("Attendance fetch error:", err);
            setError(err.message || "Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present":
                return (
                    <Badge className="bg-green-100 text-green-800">
                        Present
                    </Badge>
                );
            case "absent":
                return (
                    <Badge className="bg-red-100 text-red-800">Absent</Badge>
                );
            case "leave":
                return (
                    <Badge className="bg-blue-100 text-blue-800">Leave</Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "present":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "absent":
                return <XCircle className="h-5 w-5 text-red-500" />;
            case "leave":
                return <AlertCircle className="h-5 w-5 text-blue-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const handleDateRangeChange = (
        type: "startDate" | "endDate",
        date: Date | undefined
    ) => {
        if (date) {
            setDateRange((prev) => ({
                ...prev,
                [type]: date,
            }));
        }
    };

    const setQuickDateRange = (days: number) => {
        const endDate = new Date();
        const startDate = subDays(endDate, days);
        setDateRange({ startDate, endDate });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            My Attendance
                        </h1>
                        <p className="text-gray-600">
                            Track your attendance records and statistics
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    <User className="h-4 w-4 mr-2" />
                    {state.user?.name}
                </Badge>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Date Range Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <CalendarIconLucide className="h-5 w-5 mr-2" />
                        Date Range
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Quick Date Buttons */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setQuickDateRange(7)}
                            >
                                Last 7 Days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setQuickDateRange(30)}
                            >
                                Last 30 Days
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const now = new Date();
                                    setDateRange({
                                        startDate: startOfMonth(now),
                                        endDate: endOfMonth(now),
                                    });
                                }}
                            >
                                This Month
                            </Button>
                        </div>

                        {/* Custom Date Range */}
                        <div className="flex items-center gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[150px] justify-start text-left font-normal",
                                            !dateRange.startDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.startDate ? (
                                            format(
                                                dateRange.startDate,
                                                "MMM dd, yyyy"
                                            )
                                        ) : (
                                            <span>Start date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.startDate}
                                        onSelect={(date) =>
                                            handleDateRangeChange(
                                                "startDate",
                                                date
                                            )
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>

                            <span className="text-gray-500">to</span>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-[150px] justify-start text-left font-normal",
                                            !dateRange.endDate &&
                                                "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.endDate ? (
                                            format(
                                                dateRange.endDate,
                                                "MMM dd, yyyy"
                                            )
                                        ) : (
                                            <span>End date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={dateRange.endDate}
                                        onSelect={(date) =>
                                            handleDateRangeChange(
                                                "endDate",
                                                date
                                            )
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Statistics */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100">
                                        Present Days
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {statistics.presentDays}
                                    </p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-green-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100">Absent Days</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.absentDays}
                                    </p>
                                </div>
                                <XCircle className="h-8 w-8 text-red-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Leave Days</p>
                                    <p className="text-2xl font-bold">
                                        {statistics.leaveDays}
                                    </p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-blue-200" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100">
                                        Attendance %
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {statistics.attendancePercentage}%
                                    </p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-200" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Attendance Records */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Attendance Records
                        <Badge variant="secondary" className="ml-2">
                            {attendanceRecords.length} records
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {attendanceRecords.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarIconLucide className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Attendance Records
                            </h3>
                            <p className="text-gray-600">
                                No attendance records found for the selected
                                date range.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {attendanceRecords.map((record) => (
                                <div
                                    key={record._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        {getStatusIcon(record.status)}
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {format(
                                                    new Date(record.date),
                                                    "EEEE, MMMM dd, yyyy"
                                                )}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                {record.markedBy && (
                                                    <span>
                                                        Marked by:{" "}
                                                        {record.markedBy.name}
                                                    </span>
                                                )}
                                                {record.batchId && (
                                                    <span>
                                                        Batch:{" "}
                                                        {record.batchId.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {getStatusBadge(record.status)}
                                        <p className="text-xs text-gray-500 mt-1">
                                            {format(
                                                new Date(record.createdAt),
                                                "HH:mm"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default StudentAttendance;
