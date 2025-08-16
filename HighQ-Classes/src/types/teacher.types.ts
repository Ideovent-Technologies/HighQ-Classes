// teacher.types.ts

export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive' | 'on-leave';
  role: 'student' | 'teacher' | 'admin';
  lastLogin?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Common address interface used across all user types
export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Common preferences interface
export interface UserPreferences {
  notifications?: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  theme?: 'light' | 'dark';
  language?: string;
}

// Department types for teachers
export type DepartmentType = 
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Hindi'
  | 'Social Science'
  | 'Computer Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Other';

// Teacher status type
export type TeacherStatus =
  | 'pending'
  | 'active'
  | 'suspended'
  | 'inactive'
  | 'on-leave';

// Batch interface for teacher relationships
export interface TeacherBatch {
  _id: string;
  name: string;
  startDate?: string;
  endDate?: string;
}

// Course interface for teacher relationships
export interface TeacherCourse {
  _id: string;
  name: string;
  subject?: string;
}

// Permissions interface for teachers
export interface TeacherPermissions {
  canCreateCourse: boolean;
  canManageBatch: boolean;
  canUploadMaterial: boolean;
  canViewAllStudents: boolean;
  canManageAttendance: boolean;
  canCreateAssignment: boolean;
}

//  Main Teacher Interface
export interface TeacherUser extends BaseUser {
  role: 'teacher';
  employeeId?: string;
  password?: string; // Only used for creation/editing
  qualification: string;
  experience: number;
  specialization: string;
  bio?: string;
  subjects?: string[];
  department: DepartmentType;
  joinDate?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  batches?: TeacherBatch[];
  courses?: TeacherCourse[];
  permissions?: TeacherPermissions;
  preferences?: UserPreferences;
}

// Teacher dashboard data interface
export interface TeacherDashboardData {
  teacher: TeacherUser;
  upcomingClasses: Array<{
    _id: string;
    subject: string;
    time: string;
    batch: string;
    room?: string;
  }>;
  recentActivities: Array<{
    _id: string;
    title: string;
    description: string;
    date: string;
    type: 'assignment' | 'material' | 'announcement';
  }>;
  performanceOverview: {
    totalCourses: number;
    totalBatches: number;
    totalStudents: number;
    avgAttendance: number;
  };
  notifications: Array<{
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    date: string;
    read: boolean;
  }>;
}

// Interface for teacher creation
export interface CreateTeacherData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  employeeId: string;
  qualification: string;
  experience: number;
  specialization: string;
  department: DepartmentType;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  address?: Address;
  subjects?: string[];
  bio?: string;
}

// Interface for teacher updates
export interface UpdateTeacherData extends Partial<CreateTeacherData> {
  status?: TeacherStatus;
  profilePicture?: string;
  preferences?: UserPreferences;
}

// API Response interface
export interface TeacherApiResponse {
  success: boolean;
  message?: string;
  teacher?: TeacherUser;
  teachers?: TeacherUser[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}

export default TeacherUser;