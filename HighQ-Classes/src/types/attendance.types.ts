// Types for Attendance Management System

export interface AttendanceRecord {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    admissionId?: string;
  };
  batch: {
    _id: string;
    name: string;
  };
  course: {
    _id: string;
    name: string;
  };
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: {
    _id: string;
    name: string;
  };
  markedAt: string;
  notes?: string;
}

export interface AttendanceMarkingData {
  studentId: string;
  batchId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  totalClasses: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  attendancePercentage: number;
}

export interface AttendanceStats {
  totalStudents: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  excusedToday: number;
  averageAttendance: number;
}

export interface BatchAttendanceData {
  batchId: string;
  batchName: string;
  course: {
    _id: string;
    name: string;
  };
  students: {
    studentId: string;
    studentName: string;
    email: string;
    admissionId?: string;
    attendanceStatus?: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
    todayAttendance?: AttendanceRecord;
  }[];
  date: string;
}
