// src/hooks/useStudentDashboard.ts
//import { useState, useEffect, useCallback } from "react";

// ------- TypeScript interfaces for API response -------

/*export interface Topic {
  title: string;
  description: string;
  order: number;
}

export interface CourseContent {
  _id: string;
  name: string;
  topics: Topic[];
}

export interface ScheduleItem {
  _id: string;
  batchId: { _id: string };
  courseId: { _id: string; name: string };
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  teacherId: string | null;
  studentIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Notice {
  targetAudience: string;
  targetBatchIds: string[];
  scheduledAt: string | null;
  _id: string;
  title: string;
  message: string;
  batch: string;
  isActive: boolean;
  isScheduled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  leave: number;
  totalDays: number;
}

export interface MaterialsSummary {
  totalAvailable: number;
}

export interface RecordingsSummary {
  totalAvailable: number;
}

export interface DashboardData {
  todaySchedule: ScheduleItem[];
  recentNotices: Notice[];
  attendanceSummary: AttendanceSummary;
  materialsSummary: MaterialsSummary;
  recordingsSummary: RecordingsSummary;
  courseContent: CourseContent[];
  materialEngagement: unknown[];
recordingStats: unknown[];

}

export interface StudentDashboardResponse {
  greeting: string;
  dashboardData: DashboardData;
}

// ---------------- useStudentDashboard Hook --------------------

export function useStudentDashboard() {
  const [data, setData] = useState<StudentDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace the URL below with your actual student dashboard API endpoint
      const response = await fetch("/api/student/dashboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Assuming you have auth token stored locally:
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsonData: StudentDashboardResponse = await response.json();
      setData(jsonData);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refetch: fetchDashboard };
}*/
