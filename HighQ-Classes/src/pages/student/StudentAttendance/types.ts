export interface AttendanceRecord {
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

export interface AttendanceStatistics {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  attendancePercentage: number;
}

export interface AttendanceApiResponse {
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
