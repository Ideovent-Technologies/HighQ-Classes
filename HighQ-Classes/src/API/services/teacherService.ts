/* eslint-disable @typescript-eslint/no-explicit-any */
import api from"../Axios";
import { TeacherUser, CreateTeacherData } from "../../types/teacher.types";

class TeacherService {
    // GET /api/admin/teachers
  async getAllTeachers(): Promise<{
    success: boolean;
    teachers?: TeacherUser[];
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/teachers');
      return { success: true, teachers: response.data.teachers };
    } catch (error: any) {
      console.error('Get all teachers error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teachers',
      };
    }
  }

  async UpdateTeacher(teacherId: string, teacherData: Partial<TeacherUser>): Promise<{
    success: boolean;
    teacher?: TeacherUser;
    message?: string;
    }> {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
      return { success: true, teacher: response.data.teacher };
    } catch (error: any) {
      console.error('Update teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update teacher',
      };
    }
}

async deleteTeacher(teacherId: string): Promise<{
    success: boolean;
    message?: string;
}> {
    try {
        await api.delete(`/admin/teachers/${teacherId}`);
        return { success: true };
    } catch (error: any) {
        console.error('Delete teacher error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete teacher',
        };
    }
  }

  async AddTeacher(teacherData: CreateTeacherData): Promise<{
    success: boolean;
    teacher?: TeacherUser;
    message?: string;
}> {
    try {
        const response = await api.post('/admin/teachers', teacherData);
        return { success: true, teacher: response.data.teacher };
    } catch (error: any) {
        console.error('Add teacher error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add teacher',
        };
    }
  }
}

const teacherServiceInstance = new TeacherService();
export default teacherServiceInstance;
