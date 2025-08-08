import api from "../Axios";
import { StudentUser, StudentDashboardData } from '@/types/student.types';

// Interface for API responses
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface ProfileUpdateData {
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class StudentService {
  /**
   * Get student profile
   */
  async getProfile(studentId: string): Promise<StudentUser> {
    try {
      const response = await api.get<ApiResponse<StudentUser>>(
        `/student/${studentId}/profile`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch profile');
    }
  }

  /**
   * Update student profile (email, phone, address, etc.)
   */
  async updateProfile(studentId: string, profileData: ProfileUpdateData): Promise<StudentUser> {
    try {
      const response = await api.patch<ApiResponse<StudentUser>>(
        `/student/${studentId}/profile`,
        profileData
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(studentId: string, file: File): Promise<StudentUser> {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await api.post<ApiResponse<StudentUser>>(
        `/student/${studentId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to upload profile picture');
    }
  }

  /**
   * Change password
   */
  async changePassword(studentId: string, passwordData: PasswordChangeData): Promise<void> {
    try {
      await api.patch<ApiResponse<null>>(
        `/student/${studentId}/change-password`,
        passwordData
      );
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  /**
   * Get student dashboard stats and overview
   */
  async getDashboard(): Promise<StudentDashboardData> {
    try {
      const response = await api.get<ApiResponse<StudentDashboardData>>(
        '/student/dashboard'
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }

  /**
   * Get student courses
   */
  async getStudentCourses(studentId: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/courses/student/${studentId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  }

  /**
   * Get student assignments
   */
  async getStudentAssignments(studentId: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/assignments/student/${studentId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }

  /**
   * Get student attendance
   */
  async getStudentAttendance(studentId: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/attendance/student/${studentId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }

  /**
   * Get student materials
   */
  async getStudentMaterials(studentId: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/materials/student/${studentId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch materials');
    }
  }

  /**
   * Get student recordings
   */
  async getStudentRecordings(studentId: string): Promise<any[]> {
    try {
      const response = await api.get<ApiResponse<any[]>>(
        `/recordings/student/${studentId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recordings');
    }
  }
}

// Export singleton instance
export const studentService = new StudentService();
export default studentService;
