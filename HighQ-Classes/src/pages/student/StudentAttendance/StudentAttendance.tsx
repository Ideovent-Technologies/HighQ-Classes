import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import AttendanceHeader from "./AttendanceHeader";
import AttendanceFilters from "./AttendanceFilters";
import AttendanceStats from "./AttendanceStats";
import AttendanceRecords from "./AttendanceRecords";
import { AttendanceRecord, AttendanceStatistics, AttendanceApiResponse } from "./types";

const StudentAttendance: React.FC = () => {
  const { state } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [statistics, setStatistics] = useState<AttendanceStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleDateRangeChange = (type: "startDate" | "endDate", date: Date | undefined) => {
    if (date) {
      setDateRange((prev) => ({ ...prev, [type]: date }));
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
      <AttendanceHeader userName={state.user?.name} />

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AttendanceFilters
        dateRange={dateRange}
        setQuickDateRange={setQuickDateRange}
        handleDateRangeChange={handleDateRangeChange}
      />

      {statistics && <AttendanceStats stats={statistics} />}

      <AttendanceRecords records={attendanceRecords} />
    </div>
  );
};

export default StudentAttendance;
