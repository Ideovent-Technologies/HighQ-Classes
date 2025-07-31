// Teacher-specific type definitions

import { BaseUser, Address, UserPreferences } from './admin.types';

// Teacher's batch information
export interface TeacherBatch {
  _id: string;
  name: string;
  subject: string;
  studentCount: number;
  schedule?: {
    day: string;
    time: string;
    duration: number;
  }[];
}

// Teacher's subject specialization
export interface SubjectSpecialization {
  subject: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  experience: number; // years of experience in this subject
}

// Teacher's class schedule
export interface ClassSchedule {
  _id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  time: string;
  duration: number; // in minutes
  subject: string;
  batch: {
    _id: string;
    name: string;
  };
  room?: string;
  type: 'regular' | 'makeup' | 'exam' | 'doubt-session';
}

// Teacher performance metrics
export interface TeacherPerformanceMetrics {
  studentsCount: number;
  batchesCount: number;
  pendingAssignments: number;
  completedAssignments: number;
  averageStudentScore: number;
  attendanceRate: number;
  studentFeedbackRating: number;
  coursesCompleted: number;
  totalClassesPlanned: number;
  totalClassesConducted: number;
}

// Main teacher user interface
export interface TeacherUser extends BaseUser {
  role: 'teacher';
  
  // Professional Information
  employeeId: string;
  qualification: string;
  experience: number; // total years of experience
  specialization: string;
  department: string;
  subjects?: string[];
  subjectSpecializations?: SubjectSpecialization[];
  bio?: string;
  
  // Personal Information
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  
  // Professional Data
  batches?: TeacherBatch[];
  courseIds?: string[];
  joinDate?: string;
  
  // Schedule & Performance
  schedule?: ClassSchedule[];
  performanceMetrics?: TeacherPerformanceMetrics;
  
  // User Preferences
  preferences?: UserPreferences;
}

// Teacher dashboard summary data
export interface TeacherDashboardData {
  teacher: TeacherUser;
  todayClasses: ClassSchedule[];
  upcomingClasses: ClassSchedule[];
  recentNotices: Array<{
    _id: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: string;
    targetAudience: string;
  }>;
  pendingTasks: Array<{
    _id: string;
    type: 'assignment' | 'attendance' | 'grading' | 'report';
    title: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  }>;
  performanceOverview: TeacherPerformanceMetrics;
  studentAttendanceAlerts: Array<{
    studentId: string;
    studentName: string;
    batchName: string;
    attendancePercentage: number;
    lastAttended: string;
  }>;
}

// Teacher search and filter interfaces
export interface TeacherSearchFilters {
  name?: string;
  email?: string;
  department?: string;
  specialization?: string;
  experience?: {
    min: number;
    max: number;
  };
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  subjects?: string[];
  employeeId?: string;
}

// Teacher creation/update form data
export interface CreateTeacherData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  employeeId: string;
  qualification: string;
  experience: number;
  specialization: string;
  department: string;
  subjects?: string[];
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
}

export interface UpdateTeacherData {
  name?: string;
  email?: string;
  mobile?: string;
  qualification?: string;
  experience?: number;
  specialization?: string;
  department?: string;
  subjects?: string[];
  bio?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  status?: 'pending' | 'active' | 'suspended' | 'inactive';
  profilePicture?: string;
}

// Assignment related types for teachers
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  subject: string;
  batchId: string;
  batchName: string;
  dueDate: string;
  totalMarks: number;
  attachments?: string[];
  createdAt: string;
  status: 'draft' | 'published' | 'completed';
}

export interface AssignmentSubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files?: string[];
  remarks?: string;
  marks?: number;
  feedback?: string;
  status: 'pending' | 'graded' | 'late';
}

// Notice related types for teachers
export interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'teachers' | 'parents' | 'specific';
  targetBatches?: string[];
  targetUsers?: string[];
  attachments?: string[];
  expiryDate?: string;
  createdBy: {
    _id: string;
    name: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'published' | 'expired';
}

// Schedule management types
export interface ScheduleTimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
}

export interface WeeklySchedule {
  monday: ClassSchedule[];
  tuesday: ClassSchedule[];
  wednesday: ClassSchedule[];
  thursday: ClassSchedule[];
  friday: ClassSchedule[];
  saturday: ClassSchedule[];
  sunday: ClassSchedule[];
}

// API response types for teacher operations
export interface TeacherApiResponse {
  success: boolean;
  message?: string;
  teacher?: TeacherUser;
  teachers?: TeacherUser[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export interface TeacherScheduleApiResponse {
  success: boolean;
  message?: string;
  schedule?: ClassSchedule[];
  weeklySchedule?: WeeklySchedule;
}

export interface TeacherPerformanceApiResponse {
  success: boolean;
  message?: string;
  performance?: TeacherPerformanceMetrics;
  analytics?: {
    monthlyStats: Array<{
      month: string;
      classesCompleted: number;
      averageAttendance: number;
      averageGrades: number;
    }>;
  };
}

export interface AssignmentApiResponse {
  success: boolean;
  message?: string;
  assignment?: Assignment;
  assignments?: Assignment[];
  submissions?: AssignmentSubmission[];
}

export interface NoticeApiResponse {
  success: boolean;
  message?: string;
  notice?: Notice;
  notices?: Notice[];
}
