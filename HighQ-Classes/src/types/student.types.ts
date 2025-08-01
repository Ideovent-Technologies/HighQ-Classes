// Student-specific type definitions

import { BaseUser, Address, UserPreferences } from './admin.types';

// Batch information for students
export interface StudentBatch {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

// Course enrollment information
export interface CourseEnrollment {
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'dropped';
}

// Attendance record for individual classes
export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  subject?: string;
}

// Student attendance summary
export interface StudentAttendance {
  percentage: number;
  totalClasses: number;
  attendedClasses: number;
  records?: AttendanceRecord[];
}

// Exam/test history
export interface ExamRecord {
  examName: string;
  date: string;
  marks: number;
  totalMarks: number;
  grade: string;
}

// Main student user interface
export interface StudentUser extends BaseUser {
  role: 'student';
  
  // Personal Information
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  
  // Family Information
  parentName: string;
  parentContact: string;
  
  // Academic Information
  grade: string;
  schoolName: string;
  batch?: StudentBatch;
  joinDate?: string;
  
  // Course Information
  courses?: string[];
  enrolledCourses?: CourseEnrollment[];
  totalCourses?: number;
  activeCourses?: number;
  
  // Attendance Data
  attendance?: StudentAttendance;
  
  // Academic Performance
  examHistory?: ExamRecord[];
  
  // User Preferences
  preferences?: UserPreferences;
  
  // Resources & Payments
  resources?: string[];
  paymentHistory?: string[];
}

// Student search and filter interfaces
export interface StudentSearchFilters {
  name?: string;
  email?: string;
  grade?: string;
  batch?: string;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  schoolName?: string;
  dateRange?: {
    from: string;
    to: string;
  };
}

// Student performance metrics for reporting
export interface StudentPerformanceMetrics {
  studentId: string;
  averageGrade: number;
  attendancePercentage: number;
  completedAssignments: number;
  totalAssignments: number;
  coursesCompleted: number;
  activeCourses: number;
  lastExamScore?: number;
  improvementTrend: 'improving' | 'declining' | 'stable';
}

// Student dashboard summary data
export interface StudentDashboardData {
  student: StudentUser;
  upcomingClasses: Array<{
    _id: string;
    subject: string;
    time: string;
    teacher: string;
    room?: string;
  }>;
  recentGrades: ExamRecord[];
  attendanceSummary: StudentAttendance;
  notifications: Array<{
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    date: string;
    read: boolean;
  }>;
  assignments: Array<{
    _id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    marks?: number;
    totalMarks?: number;
  }>;
}

// Student creation/update form data
export interface CreateStudentData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  parentName: string;
  parentContact: string;
  grade: string;
  schoolName: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  batchId?: string;
}

export interface UpdateStudentData {
  name?: string;
  email?: string;
  mobile?: string;
  parentName?: string;
  parentContact?: string;
  grade?: string;
  schoolName?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  batchId?: string;
  profilePicture?: string;
}

// API response types for student operations
export interface StudentApiResponse {
  success: boolean;
  message?: string;
  student?: StudentUser;
  students?: StudentUser[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface StudentAttendanceApiResponse {
  success: boolean;
  message?: string;
  attendance?: StudentAttendance;
  records?: AttendanceRecord[];
}

export interface StudentPerformanceApiResponse {
  success: boolean;
  message?: string;
  performance?: StudentPerformanceMetrics;
  examHistory?: ExamRecord[];
}
