// src/types/attendance.types.ts
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  _id?: string;
  student?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  date: string; // yyyy-MM-dd
  status: AttendanceStatus | string;
  notes?: string;
  markedBy?: {
    _id?: string;
    name?: string;
  };
  [k: string]: any;
}

export interface BatchStudent {
  // normalized student object used by UI
  studentId: string; // canonical id we will use in UI
  studentName?: string;
  email?: string;
  admissionId?: string;
  attendanceStatus?: AttendanceStatus | string; // API might send string, so allow string
  notes?: string;
  // keep optional raw id fields in case API uses them
  _id?: string;
  id?: string;
  // store raw object when needed
  __raw?: any;
  todayAttendance?: AttendanceRecord;
  [k: string]: any;
}

export interface BatchAttendanceData {
  batchId: string;
  batchName?: string;
  course?: {
    _id?: string;
    courseName?: string;
    name?: string;
  };
  date?: string;
  students: BatchStudent[];
  [k: string]: any;
}

export interface AttendanceMarkingData {
  studentId: string;
  batchId: string;
  date: string; // yyyy-MM-dd
  status: AttendanceStatus | string;
  notes?: string;
  [k: string]: any;
}

export interface AttendanceSummary {
  studentId: string;
  studentName?: string;
  totalClasses?: number;
  presentCount?: number;
  absentCount?: number;
  lateCount?: number;
  attendancePercentage?: number;
  [k: string]: any;
}
