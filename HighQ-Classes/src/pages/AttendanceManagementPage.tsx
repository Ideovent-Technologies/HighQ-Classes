import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    CalendarIcon,
    Users,
    UserCheck,
    UserX,
    Clock,
    AlertCircle,
    Save,
    Eye,
    Filter,
    Download,
} from "lucide-react";
import { format } from "date-fns";
import AttendanceService from "@/API/services/attendanceService";
import batchService from "@/API/services/batchService";
import {
    AttendanceRecord,
    AttendanceMarkingData,
    BatchAttendanceData,
    AttendanceSummary,
} from "@/types/attendance.types";

interface AttendanceManagementPageProps {
    userRole: "teacher" | "admin";
}

const AttendanceManagementPage: React.FC<AttendanceManagementPageProps> = ({
    userRole,
}) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedBatch, setSelectedBatch] = useState<string>("");
    const [batches, setBatches] = useState<any[]>([]);
    const [batchAttendance, setBatchAttendance] =
        useState<BatchAttendanceData | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<
        AttendanceRecord[]
    >([]);
    const [attendanceSummary, setAttendanceSummary] = useState<
        AttendanceSummary[]
    >([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [activeTab, setActiveTab] = useState("mark");

    // Filters for viewing attendance
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        status: "",
        studentId: "",
    });

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        if (selectedBatch && selectedDate) {
            fetchBatchAttendanceData();
        }
    }, [selectedBatch, selectedDate]);

    const fetchBatches = async () => {
        setLoading(true);
        try {
            const result = await batchService.getAllBatches();
            if (result.success && result.batches) {
                setBatches(result.batches);
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBatchAttendanceData = async () => {
        if (!selectedBatch || !selectedDate) return;

        setLoading(true);
        try {
            const result = await AttendanceService.getBatchAttendanceData(
                selectedBatch,
                format(selectedDate, "yyyy-MM-dd")
            );
            if (result.success && result.data) {
                setBatchAttendance(result.data);
            }
        } catch (error) {
            console.error("Error fetching batch attendance data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceRecords = async () => {
        setLoading(true);
        try {
            const result = await AttendanceService.getAttendanceRecords({
                batchId: selectedBatch,
                ...filters,
                page: 1,
                limit: 50,
            });
            if (result.success && result.data) {
                setAttendanceRecords(result.data.records);
            }
        } catch (error) {
            console.error("Error fetching attendance records:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendanceSummary = async () => {
        setLoading(true);
        try {
            const result = await AttendanceService.getAttendanceSummary({
                batchId: selectedBatch,
                ...filters,
            });
            if (result.success && result.data) {
                setAttendanceSummary(result.data);
            }
        } catch (error) {
            console.error("Error fetching attendance summary:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAttendance = async () => {
        if (!batchAttendance || !selectedDate || !selectedBatch) return;

        setSaving(true);
        try {
            const attendanceData: AttendanceMarkingData[] =
                batchAttendance.students.map((student) => ({
                    studentId: student.studentId,
                    batchId: selectedBatch,
                    date: format(selectedDate, "yyyy-MM-dd"),
                    status: student.attendanceStatus || "present",
                    notes: student.notes || "",
                }));

            const result = await AttendanceService.markAttendance(
                attendanceData
            );

            if (result.success) {
                setMessage({
                    type: "success",
                    text: "Attendance marked successfully!",
                });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: "error", text: result.message });
                setTimeout(() => setMessage(null), 3000);
            }
        } catch (error) {
            setMessage({ type: "error", text: "Failed to mark attendance" });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    const updateStudentAttendance = (
        studentId: string,
        field: "status" | "notes",
        value: string
    ) => {
        if (!batchAttendance) return;

        setBatchAttendance({
            ...batchAttendance,
            students: batchAttendance.students.map((student) =>
                student.studentId === studentId
                    ? {
                          ...student,
                          [field === "status" ? "attendanceStatus" : field]:
                              value,
                      }
                    : student
            ),
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800";
            case "absent":
                return "bg-red-100 text-red-800";
            case "late":
                return "bg-yellow-100 text-yellow-800";
            case "excused":
                return "bg-blue-100 text-blue-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "present":
                return <UserCheck className="h-4 w-4" />;
            case "absent":
                return <UserX className="h-4 w-4" />;
            case "late":
                return <Clock className="h-4 w-4" />;
            case "excused":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Attendance Management</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                    </Button>
                </div>
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

            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
                    <TabsTrigger value="view">View Records</TabsTrigger>
                    <TabsTrigger value="summary">Summary & Reports</TabsTrigger>
                </TabsList>

                <TabsContent value="mark" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5" />
                                Mark Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select Batch
                                    </label>
                                    <Select
                                        value={selectedBatch}
                                        onValueChange={setSelectedBatch}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a batch..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {batches.map((batch) => (
                                                <SelectItem
                                                    key={batch._id}
                                                    value={batch._id}
                                                >
                                                    {batch.batchName} -{" "}
                                                    {batch.course?.courseName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Select Date
                                    </label>
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(date) =>
                                            date && setSelectedDate(date)
                                        }
                                        className="rounded-md border"
                                    />
                                </div>
                            </div>

                            {batchAttendance && (
                                <div className="mt-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-semibold">
                                            Students in{" "}
                                            {batchAttendance.batchName}
                                        </h3>
                                        <Badge variant="outline">
                                            {batchAttendance.students.length}{" "}
                                            students
                                        </Badge>
                                    </div>

                                    <div className="space-y-3">
                                        {batchAttendance.students.map(
                                            (student) => (
                                                <Card key={student.studentId}>
                                                    <CardContent className="p-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                                    <Users className="h-5 w-5" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {
                                                                            student.studentName
                                                                        }
                                                                    </p>
                                                                    <p className="text-sm text-gray-500">
                                                                        {
                                                                            student.email
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <Select
                                                                    value={
                                                                        student.attendanceStatus ||
                                                                        "present"
                                                                    }
                                                                    onValueChange={(
                                                                        value
                                                                    ) =>
                                                                        updateStudentAttendance(
                                                                            student.studentId,
                                                                            "status",
                                                                            value
                                                                        )
                                                                    }
                                                                >
                                                                    <SelectTrigger className="w-32">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="present">
                                                                            Present
                                                                        </SelectItem>
                                                                        <SelectItem value="absent">
                                                                            Absent
                                                                        </SelectItem>
                                                                        <SelectItem value="late">
                                                                            Late
                                                                        </SelectItem>
                                                                        <SelectItem value="excused">
                                                                            Excused
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                                <Input
                                                                    placeholder="Notes..."
                                                                    value={
                                                                        student.notes ||
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        updateStudentAttendance(
                                                                            student.studentId,
                                                                            "notes",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-40"
                                                                />
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Button
                                            onClick={handleMarkAttendance}
                                            disabled={saving}
                                            className="min-w-32"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-4 w-4 mr-2" />
                                                    Mark Attendance
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="view" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Attendance Records
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Select
                                    value={selectedBatch}
                                    onValueChange={setSelectedBatch}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Batch..." />
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
                                <Input
                                    type="date"
                                    placeholder="Start Date"
                                    value={filters.startDate}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            startDate: e.target.value,
                                        })
                                    }
                                />
                                <Input
                                    type="date"
                                    placeholder="End Date"
                                    value={filters.endDate}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            endDate: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    onClick={fetchAttendanceRecords}
                                    className="w-full"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 p-3 text-left">
                                                Student
                                            </th>
                                            <th className="border border-gray-300 p-3 text-left">
                                                Date
                                            </th>
                                            <th className="border border-gray-300 p-3 text-left">
                                                Status
                                            </th>
                                            <th className="border border-gray-300 p-3 text-left">
                                                Notes
                                            </th>
                                            <th className="border border-gray-300 p-3 text-left">
                                                Marked By
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceRecords.map((record) => (
                                            <tr key={record._id}>
                                                <td className="border border-gray-300 p-3">
                                                    {record.student?.name ||
                                                        "Unknown Student"}
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    {format(
                                                        new Date(record.date),
                                                        "MMM dd, yyyy"
                                                    )}
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    <Badge
                                                        className={getStatusColor(
                                                            record.status
                                                        )}
                                                    >
                                                        {getStatusIcon(
                                                            record.status
                                                        )}
                                                        <span className="ml-1 capitalize">
                                                            {record.status}
                                                        </span>
                                                    </Badge>
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    {record.notes || "-"}
                                                </td>
                                                <td className="border border-gray-300 p-3">
                                                    {record.markedBy?.name ||
                                                        "System"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="summary" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Summary & Reports</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-6">
                                <Button
                                    onClick={fetchAttendanceSummary}
                                    className="mb-4"
                                >
                                    Generate Summary
                                </Button>
                            </div>

                            {attendanceSummary.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Student
                                                </th>
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Total Classes
                                                </th>
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Present
                                                </th>
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Absent
                                                </th>
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Late
                                                </th>
                                                <th className="border border-gray-300 p-3 text-left">
                                                    Attendance %
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {attendanceSummary.map(
                                                (summary) => (
                                                    <tr key={summary.studentId}>
                                                        <td className="border border-gray-300 p-3">
                                                            {
                                                                summary.studentName
                                                            }
                                                        </td>
                                                        <td className="border border-gray-300 p-3">
                                                            {
                                                                summary.totalClasses
                                                            }
                                                        </td>
                                                        <td className="border border-gray-300 p-3 text-green-600">
                                                            {
                                                                summary.presentCount
                                                            }
                                                        </td>
                                                        <td className="border border-gray-300 p-3 text-red-600">
                                                            {
                                                                summary.absentCount
                                                            }
                                                        </td>
                                                        <td className="border border-gray-300 p-3 text-yellow-600">
                                                            {summary.lateCount}
                                                        </td>
                                                        <td className="border border-gray-300 p-3">
                                                            <Badge
                                                                className={
                                                                    summary.attendancePercentage >=
                                                                    75
                                                                        ? "bg-green-100 text-green-800"
                                                                        : summary.attendancePercentage >=
                                                                          50
                                                                        ? "bg-yellow-100 text-yellow-800"
                                                                        : "bg-red-100 text-red-800"
                                                                }
                                                            >
                                                                {summary.attendancePercentage.toFixed(
                                                                    1
                                                                )}
                                                                %
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AttendanceManagementPage;
