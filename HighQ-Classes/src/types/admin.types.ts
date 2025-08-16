// Base user interface and admin-specific types

export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture?: string;
  status: 'pending' | 'active' | 'suspended' | 'inactive';
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

//  Admin-specific user profile
export interface AdminUser extends BaseUser {
  role: 'admin';

  // Administrative Information
  employeeId?: string;
  designation: string;
  department: string;
  accessLevel?: number;

  // Personal Information
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;

  // Administrative Data
  permissions?: string[];
  managedDepartments?: string[];
  joinDate?: string;

  // Dashboard-specific data — optional here
  systemStats?: {
    totalStudents: number;
    totalTeachers: number;
    totalCourses: number;
    totalBatches: number;
    activeUsers: number;
    pendingApprovals: number;
  };
}

//  New type for dashboard response
export interface DashboardData {
  totalStudents: number;
  feeCollection: number;
  pendingDues: number;
  totalTeachers: number;
  recentPayments: {
    name: string;
    amount: number;
    batch: string;
    time: string;
  }[];
  pendingStudents: {
    name: string;
    amount: number;
    dueDate: string;
  }[];
}
