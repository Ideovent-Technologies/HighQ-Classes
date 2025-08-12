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

  // Small helper: accept multiple possible response shapes
  const parseList = (res: any, keys: string[] = []) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (res.success) {
      // common keys
      for (const k of ["batches", "data", "payload", ...keys]) {
        if (Array.isArray(res[k])) return res[k];
      }
      // sometimes res.data is the list directly
      if (Array.isArray(res.data)) return res.data;
    }
    // fallback
    for (const k of keys) {
      if (Array.isArray(res[k])) return res[k];
    }
    return [];
  };

  useEffect(() => {
    fetchBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // whenever selectedBatch or date changes, fetch the batch attendance for that date
  useEffect(() => {
    if (selectedBatch && selectedDate) {
      fetchBatchAttendanceData(selectedBatch, selectedDate);
    } else {
      // clear current attendance when no batch selected
      setBatchAttendance(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBatch, selectedDate]);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await batchService.getAllBatches();
      const list = parseList(res, ["batches"]);
      setBatches(list);

      // if no batch is selected, auto-select the first batch to speed up flow
      if ((!selectedBatch || selectedBatch === "") && list.length > 0) {
        const first = list[0];
        const id = first._id || first.id || first.batchId || "";
        if (id) setSelectedBatch(id);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
      setMessage({ type: "error", text: "Failed to load batches" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

 const fetchBatchAttendanceData = async (batchId?: string, date?: Date) => {
  if (!batchId) return;
  setLoading(true);
  try {
    const day = date ? format(date, "yyyy-MM-dd") : format(selectedDate, "yyyy-MM-dd");

    // treat raw response as any and extract inner payload
    const raw: any = await AttendanceService.getBatchAttendanceData(batchId, day);
    const payload = raw?.data ?? raw;

    // try common locations for students list
    const studentsSrc =
      payload?.students ||
      payload?.batchAttendance?.students ||
      payload?.data?.students ||
      [];

    // normalize students
    const normalizedStudents = Array.isArray(studentsSrc)
      ? studentsSrc.map((s: any) => ({
          studentId: s.studentId ?? s._id ?? s.id ?? s.student?._id ?? s.student?.id ?? "",
          studentName:
            s.studentName ?? s.name ?? s.student?.name ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
          email: s.email ?? s.student?.email ?? "",
          attendanceStatus: (s.attendanceStatus ?? s.status ?? "present") as any,
          notes: s.notes ?? "",
          _id: s._id,
          id: s.id,
          __raw: s,
        }))
      : [];

    const normalized: BatchAttendanceData = {
      batchId: payload?.batchId ?? payload?.batch?.batchId ?? batchId,
      batchName: payload?.batchName ?? payload?.batch?.batchName ?? payload?.batch?.name ?? "",
      date: day,
      students: normalizedStudents,
    };

    setBatchAttendance(normalized);
  } catch (err) {
    console.error("Error fetching batch attendance data:", err);
    setBatchAttendance(null);
    setMessage({ type: "error", text: "Failed to fetch batch attendance data" });
    setTimeout(() => setMessage(null), 3000);
  } finally {
    setLoading(false);
  }
};


  const fetchAttendanceRecords = async () => {
  if (!selectedBatch) {
    setMessage({ type: "error", text: "Please select a batch first." });
    setTimeout(() => setMessage(null), 2500);
    return;
  }

  setLoading(true);
  try {
    const raw: any = await AttendanceService.getAttendanceRecords({
      batchId: selectedBatch,
      ...filters,
      page: 1,
      limit: 50,
    });

    // common shapes: { success, data: { records: [...] } } || { data: [...] } || [...]
    const records = raw?.data?.records ?? raw?.data ?? raw?.records ?? raw ?? [];
    setAttendanceRecords(Array.isArray(records) ? records : []);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    setAttendanceRecords([]);
    setMessage({ type: "error", text: "Failed to load attendance records" });
    setTimeout(() => setMessage(null), 3000);
  } finally {
    setLoading(false);
  }
};


  const fetchAttendanceSummary = async () => {
    if (!selectedBatch) {
      setMessage({ type: "error", text: "Please select a batch first." });
      setTimeout(() => setMessage(null), 2500);
      return;
    }
    setLoading(true);
    try {
      const result = await AttendanceService.getAttendanceSummary({
        batchId: selectedBatch,
        ...filters,
      });
      // some APIs return { success, data: [summary] } or directly array
      const data = result?.data || [];
      setAttendanceSummary(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching attendance summary:", err);
      setAttendanceSummary([]);
      setMessage({ type: "error", text: "Failed to load summary" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
  if (!batchAttendance || !selectedDate || !selectedBatch) {
    setMessage({ type: "error", text: "Select batch & date first" });
    setTimeout(() => setMessage(null), 2500);
    return;
  }

  setSaving(true);
  try {
    const attendanceData: AttendanceMarkingData[] = batchAttendance.students.map((student) => ({
      studentId: student.studentId || student._id || student.id,
      batchId: selectedBatch,
      date: format(selectedDate, "yyyy-MM-dd"),
      status: student.attendanceStatus || "present",
      notes: student.notes || "",
    }));

    const raw: any = await AttendanceService.markAttendance(attendanceData);

    // Accept multiple possible success shapes
    const ok =
      (raw && raw.success === true) ||
      raw?.status === "ok" ||
      raw?.updated === true ||
      raw?.data?.updated === true;

    if (ok) {
      setMessage({ type: "success", text: "Attendance marked successfully!" });
      await fetchBatchAttendanceData(selectedBatch, selectedDate);
      await fetchAttendanceRecords();
    } else {
      console.error("markAttendance result:", raw);
      setMessage({ type: "error", text: raw?.message || "Failed to mark attendance" });
    }
  } catch (err) {
    console.error("Error marking attendance:", err);
    setMessage({ type: "error", text: "Failed to mark attendance" });
  } finally {
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  }
};


  const updateStudentAttendance = (
    studentId: string,
    field: "status" | "notes",
    value: string
  ) => {
    if (!batchAttendance) return;

    setBatchAttendance((prev) =>
      prev
        ? {
            ...prev,
            students: prev.students.map((student) =>
              (student.studentId === studentId ||
                student._id === studentId ||
                student.id === studentId) // accept multiple id keys
                ? {
                    ...student,
                    ...(field === "status"
                      ? { attendanceStatus: value }
                      : { notes: value }),
                  }
                : student
            ),
          }
        : prev
    );
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
          className={message.type === "success" ? "border-green-500" : "border-red-500"}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                  <label className="block text-sm font-medium mb-2">Select Batch</label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a batch..." />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem
                          key={batch._id || batch.id}
                          value={batch._id || batch.id || ""}
                        >
                          {(batch.batchName || batch.name || batch.displayName || "").trim() +
                            (batch.course?.courseName
                              ? ` - ${batch.course.courseName}`
                              : batch.course?.name
                              ? ` - ${batch.course.name}`
                              : "")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Select Date</label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {!batchAttendance && (
                <div className="text-sm text-gray-500">
                  {selectedBatch ? "No attendance data for the selected date." : "Select a batch to load students."}
                </div>
              )}

              {batchAttendance && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Students in {batchAttendance.batchName || "Selected Batch"}</h3>
                    <Badge variant="outline">{batchAttendance.students.length} students</Badge>
                  </div>

                  <div className="space-y-3">
                    {batchAttendance.students.map((student) => (
                      <Card key={student.studentId || student._id || student.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <Users className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="font-medium">{student.studentName || "Unknown"}</p>
                                <p className="text-sm text-gray-500">{student.email || ""}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Select
                                value={student.attendanceStatus || "present"}
                                onValueChange={(value) =>
                                  updateStudentAttendance(student.studentId || student._id || student.id, "status", value)
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="present">Present</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                  <SelectItem value="excused">Excused</SelectItem>
                                </SelectContent>
                              </Select>
                              <Input
                                placeholder="Notes..."
                                value={student.notes || ""}
                                onChange={(e) =>
                                  updateStudentAttendance(student.studentId || student._id || student.id, "notes", e.target.value)
                                }
                                className="w-40"
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleMarkAttendance} disabled={saving} className="min-w-32">
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Batch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch) => (
                      <SelectItem key={batch._id || batch.id} value={batch._id || batch.id || ""}>
                        {batch.batchName || batch.name || ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
                <Button onClick={fetchAttendanceRecords} className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left">Student</th>
                      <th className="border border-gray-300 p-3 text-left">Date</th>
                      <th className="border border-gray-300 p-3 text-left">Status</th>
                      <th className="border border-gray-300 p-3 text-left">Notes</th>
                      <th className="border border-gray-300 p-3 text-left">Marked By</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((record) => (
                      <tr key={record._id}>
                        <td className="border border-gray-300 p-3">{record.student?.name || "Unknown Student"}</td>
                        <td className="border border-gray-300 p-3">{format(new Date(record.date), "MMM dd, yyyy")}</td>
                        <td className="border border-gray-300 p-3">
                          <Badge className={getStatusColor(record.status)}>
                            {getStatusIcon(record.status)}
                            <span className="ml-1 capitalize">{record.status}</span>
                          </Badge>
                        </td>
                        <td className="border border-gray-300 p-3">{record.notes || "-"}</td>
                        <td className="border border-gray-300 p-3">{record.markedBy?.name || "System"}</td>
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
                <Button onClick={fetchAttendanceSummary} className="mb-4">
                  Generate Summary
                </Button>
              </div>

              {attendanceSummary.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left">Student</th>
                        <th className="border border-gray-300 p-3 text-left">Total Classes</th>
                        <th className="border border-gray-300 p-3 text-left">Present</th>
                        <th className="border border-gray-300 p-3 text-left">Absent</th>
                        <th className="border border-gray-300 p-3 text-left">Late</th>
                        <th className="border border-gray-300 p-3 text-left">Attendance %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceSummary.map((summary) => (
                        <tr key={summary.studentId}>
                          <td className="border border-gray-300 p-3">{summary.studentName}</td>
                          <td className="border border-gray-300 p-3">{summary.totalClasses}</td>
                          <td className="border border-gray-300 p-3 text-green-600">{summary.presentCount}</td>
                          <td className="border border-gray-300 p-3 text-red-600">{summary.absentCount}</td>
                          <td className="border border-gray-300 p-3 text-yellow-600">{summary.lateCount}</td>
                          <td className="border border-gray-300 p-3">
                            <Badge
                              className={
                                summary.attendancePercentage >= 75
                                  ? "bg-green-100 text-green-800"
                                  : summary.attendancePercentage >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {summary.attendancePercentage.toFixed(1)}%
                            </Badge>
                          </td>
                        </tr>
                      ))}
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
