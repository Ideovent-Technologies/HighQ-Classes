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
      const response = await api.get('/student/dashboard');
      
      // Backend returns: { greeting, dashboardData }
      // We need to transform it to match our StudentDashboardData interface
      const backendData = response.data;
      
      if (!backendData || !backendData.dashboardData) {
        throw new Error('Invalid dashboard response format');
      }
      
      // Extract student name from greeting
      const studentName = backendData.greeting?.replace('Welcome, ', '') || 'Student';
      
      // Transform backend response to match frontend interface
      const transformedData: StudentDashboardData = {
        student: {
          _id: '', // Will be populated from auth context
          name: studentName,
          email: '',
          role: 'student' as const,
          courses: [],
          batch: { _id: '', name: '' },
          grade: '',
          parentName: '',
          parentContact: '',
          schoolName: '',
          mobile: '',
          status: 'active' as const
        },
        upcomingClasses: (backendData.dashboardData.todaySchedule || []).map((schedule: any) => ({
          _id: schedule._id || Math.random().toString(),
          subject: schedule.courseId?.name || schedule.subject || 'Unknown Subject',
          time: schedule.startTime || schedule.time || 'TBD',
          teacher: schedule.teacher || 'TBD',
          room: schedule.room || undefined
        })),
        recentGrades: [], // Not provided by current backend
        attendanceSummary: {
          percentage: backendData.dashboardData.attendanceSummary ? 
            Math.round((backendData.dashboardData.attendanceSummary.present / 
            Math.max(backendData.dashboardData.attendanceSummary.totalDays, 1)) * 100) : 0,
          totalClasses: backendData.dashboardData.attendanceSummary?.totalDays || 0,
          attendedClasses: backendData.dashboardData.attendanceSummary?.present || 0
        },
        notifications: (backendData.dashboardData.recentNotices || []).map((notice: any) => ({
          _id: notice._id || Math.random().toString(),
          title: notice.title || 'Notice',
          message: notice.content || notice.message || 'No content available',
          type: 'info' as const,
          date: notice.createdAt || new Date().toISOString(),
          read: false
        })),
        assignments: [] // Not provided by current backend - will show empty state
      };
      
      return transformedData;
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }

  /**
   * Get student assignments for their batch
   */
  async getStudentAssignments(): Promise<any[]> {
    try {
      // Use the general assignments endpoint - backend filters by student's batch automatically
      const response = await api.get('/assignments');
      return response.data.assignments || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }

  /**
   * Submit assignment
   */
  async submitAssignment(assignmentId: string, file: File, remarks?: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (remarks) {
        formData.append('remarks', remarks);
      }

      const response = await api.post(
        `/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to submit assignment');
    }
  }

  /**
   * Get student attendance with date range
   */
  async getStudentAttendance(startDate?: string, endDate?: string): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const response = await api.get(`/attendance/student?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }

  /**
   * Get student fee details
   * Note: Requires studentId parameter - backend security check ensures students can only view their own fees
   */
  async getStudentFees(studentId: string): Promise<any> {
    try {
      const response = await api.get(`/fee/student/${studentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch fee details');
    }
  }

  /**
   * Get student materials
   */
  async getStudentMaterials(studentId?: string): Promise<any[]> {
    try {
      // Use the correct endpoint - /materials/student (without studentId)
      const response = await api.get('/materials/student');
      return response.data.materials || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch materials');
    }
  }

  /**
   * Get student recordings
   */
  async getStudentRecordings(studentId?: string): Promise<any[]> {
    try {
      // Use the correct endpoint - /recordings/student (without studentId)
      const response = await api.get('/recordings/student');
      return response.data.recordings || response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recordings');
    }
  }
}

// Export singleton instance
export const studentService = new StudentService();
export default studentService;
