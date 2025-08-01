import api from "../Axios";
import { AdminUser } from "../../types/admin.types";
import { StudentUser } from "../../types/student.types";
import { TeacherUser } from "../../types/teacher.types";

class AdminService {
  // GET /api/admin/dashboard - Get all users
  async getAdminData(): Promise<{
    success: boolean;
    users?: AdminUser[];
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/dashboard');
      return { success: true, users: response.data };
    } catch (error: any) {
      console.error('Get admindata error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin data',
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
