/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../Axios";
import { DashboardData } from "../../types/admin.types";
import { StudentUser, CreateStudentData } from "../../types/student.types";
import { TeacherUser, CreateTeacherData } from "../../types/teacher.types";
import { Notice } from "../../types/notice.types"; // Correctly importing Notice from the shared types file
import { AdminUser } from "../../types/admin.types";

// Define generic API response structure
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Batch {
  _id: string;
  name: string;
}

interface Course {
  _id: string;
  name: string;
}

interface Schedule {
  _id: string;
  batchId: { _id: string; name: string };
  teacherId: { _id: string; name: string };
  courseId: { _id: string; name: string };
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface ScheduleFormData {
  teacherId: string;
  batchId: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

// REMOVED THE DUPLICATE AND INCOMPLETE NOTICE INTERFACE FROM THIS FILE.

class AdminService {
  // ---------------- NOTICES ----------------

  async getAllNotices(): Promise<ApiResponse<Notice[]>> {
    try {
      const response = await api.get("/admin/notices");
      console.log("Notices API response:", response.data);
      // Ensure the response data structure matches the expected API response
      return { success: true, data: response.data.data, message: "Notices fetched successfully" };
    } catch (error: any) {
      console.error("Get all notices error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notices",
      };
    }
  }

  async createNotice(noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.post("/admin/notices", noticeData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Create notice error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create notice',
      };
    }
  }

  async updateNotice(noticeId: string, noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.put(`/admin/notices/${noticeId}`, noticeData);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error("Update notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update notice",
      };
    }
  }

  async deleteNotice(noticeId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/notices/${noticeId}`);
      return {
        success: true,
        message: response.data.message || "Notice deleted successfully",
      };
    } catch (error: any) {
      console.error("Delete notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete notice",
      };
    }
  }

  // ---------------- STUDENTS ----------------

  async addStudent(studentData: CreateStudentData): Promise<ApiResponse<StudentUser>> {
    try {
      const response = await api.post('/admin/students', studentData);
      return { success: true, data: response.data.student, message: response.data.message };
    } catch (error: any) {
      console.error('Add student error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add student',
      };
    }
  }

  async updateStudent(studentId: string, studentData: Partial<StudentUser>): Promise<ApiResponse<StudentUser>> {
    try {
      const response = await api.put(`/admin/students/${studentId}`, studentData);
      return { success: true, data: response.data.student, message: response.data.message };
    } catch (error: any) {
      console.error('Update student error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
      };
    }
  }

  async deleteStudent(studentId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/students/${studentId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Delete student error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete student',
      };
    }
  }

  // ---------------- TEACHERS ----------------

  async addTeacher(teacherData: CreateTeacherData): Promise<ApiResponse<TeacherUser>> {
    try {
      const response = await api.post('/admin/teachers', teacherData);
      return { success: true, data: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      console.error('Add teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add teacher',
      };
    }
  }


  async updateTeacher(teacherId: string, teacherData: Partial<TeacherUser>): Promise<ApiResponse<TeacherUser>> {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
      return { success: true, data: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      console.error('Update teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update teacher',
      };
    }
  }

  async deleteTeacher(teacherId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/teachers/${teacherId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Delete teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete teacher',
      };
    }
  }

  // ---------------- REPORTS & BATCHES ----------------

  async getReportsData(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await api.get('/admin/dashboard');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get reports data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reports data',
      };
    }
  }

  async getAllBatches(): Promise<ApiResponse<Batch[]>> {
    try {
      const response = await api.get('/batches');
      return { success: true, data: response.data.batches };
    } catch (error: any) {
      console.error('Get all batches error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch batches',
      };
    }
  }

  async createBatch(batchData: Batch): Promise<ApiResponse<Batch>> {
    try {
      const response = await api.post('/batches', batchData);
      return { success: true, data: response.data.batch, message: response.data.message };
    } catch (error: any) {
      console.error('Create batch error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create batch',
      };
    }
  }

  // ---------------- USER APPROVALS & STATUS ----------------

  async getPendingApprovals(): Promise<ApiResponse<{ students: StudentUser[], teachers: TeacherUser[] }>> {
    try {
      const response = await api.get('/admin/pending-approvals');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get pending approvals error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending approvals',
      };
    }
  }

  async changeUserStatus(
    id: string,
    role: "student" | "teacher",
    status: string
  ): Promise<ApiResponse<StudentUser | TeacherUser>> {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, { role, status });
      return {
        success: true,
        data: response.data.user,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error('Change user status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to change user status',
      };
    }
  }

  async getActiveUsers(): Promise<ApiResponse<{ activeStudents: number, activeTeachers: number }>> {
    try {
      const response = await api.get('/admin/active-users');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get active users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active users',
      };
    }
  }

  // ---------------- SCHEDULES ----------------

  async getAllSchedules(filters: { teacherId?: string; batchId?: string; day?: string }): Promise<ApiResponse<Schedule[]>> {
    try {
      const res = await api.get<ApiResponse<Schedule[]>>("/schedule/all", { params: filters });
      return res.data;
    } catch (error: any) {
      console.error("Error fetching schedules:", error);
      return { success: false, message: error.response?.data?.message || "Failed to fetch schedules" };
    }
  }

  async createSchedule(scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      const res = await api.post<ApiResponse<null>>("/schedule", scheduleData);
      return res.data;
    } catch (error: any) {
      console.error("Error creating schedule:", error);
      return { success: false, message: error.response?.data?.message || "Failed to create schedule" };
    }
  }

  async updateSchedule(scheduleId: string, scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      const res = await api.put<ApiResponse<null>>(`/schedule/${scheduleId}`, scheduleData);
      return res.data;
    } catch (error: any) {
      console.error("Error updating schedule:", error);
      return { success: false, message: error.response?.data?.message || "Failed to update schedule" };
    }
  }

  async deleteSchedule(scheduleId: string): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete<ApiResponse<null>>(`/schedule/${scheduleId}`);
      return res.data;
    } catch (error: any) {
      console.error("Error deleting schedule:", error);
      return { success: false, message: error.response?.data?.message || "Failed to delete schedule" };
    }
  }

  // ---------------- COURSES ----------------

  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const response = await api.get('/courses');
      return { success: true, data: response.data.courses };
    } catch (error: any) {
      console.error('Get all courses error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch courses',
      };
    }
  }
}

export default new AdminService();
