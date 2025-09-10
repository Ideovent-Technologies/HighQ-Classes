// Common fields across all user types
export interface BaseUser {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  profilePicture?: string;
  status: "pending" | "active" | "suspended" | "inactive";
  role: "student" | "teacher" | "admin";
  lastLogin?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Admin
export interface AdminUser extends BaseUser {
  role: "admin";
}

// Teacher
export interface TeacherUser extends BaseUser {
  role: "teacher";
  subjects?: string[];   // example extra field
  experience?: number;   // years of experience
}

// Student
export interface StudentUser extends BaseUser {
  role: "student";
  batchId?: string;
  courses?: string[];
}

// When creating a new student
export interface CreateStudentData {
  name: string;
  email: string;
  mobile: string;
  batchId: string;
  courses?: string[];
}

// When creating a new teacher
export interface CreateTeacherData {
  name: string;
  email: string;
  mobile: string;
  subjects?: string[];
  experience?: number;
}
