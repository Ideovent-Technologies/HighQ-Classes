/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../Axios";
import { DashboardData } from "../../types/admin.types";
import { StudentUser } from "../../types/student.types";
import { TeacherUser } from "../../types/teacher.types";
import { AdminUser} from "../../types/admin.types";

class AdminService {
  // GET /api/admin/dashboard - Get all users
   async getAdminData(): Promise<{
    success: boolean;
    data?: DashboardData;
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get admindata error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin data',
      };
    }
  }

  // get admin profile
async getAdminProfile(): Promise<{
  success: boolean;
  admin?: AdminUser; // <-- changed from BaseUser to AdminUser
  message?: string;
}> {
  try {
    const response = await api.get('/admin/profile');
    return { success: true, admin: response.data };
  } catch (error: any) {
    console.error('Get admin profile error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch admin profile',
    };
  }
}


  // GET /api/admin/students
  async getALLStudents(): Promise<{
    success: boolean;
    students?: StudentUser[];
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/students');
      return { success: true, students: response.data.students };
    } catch (error: any) {
      console.error('Get all students error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
      };
    }
  }

  
}

// ✅ Correct export after closing the class
export default new AdminService();
