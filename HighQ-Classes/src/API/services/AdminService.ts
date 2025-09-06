/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../Axios";
import { DashboardData } from "../../types/admin.types";
import { StudentUser, CreateStudentData } from "../../types/student.types";
import { TeacherUser } from "../../types/teacher.types";
import { AdminUser } from "../../types/admin.types";

// Define a consistent ApiResponse interface for all data-fetching methods
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Batch {
  _id: string;
  name: string;
  // Add other properties as needed
}

interface Course {
  _id: string;
  name: string;
  // Add other properties as needed
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

// Data transfer objects for creating and updating schedules
interface ScheduleFormData {
  teacherId: string;
  batchId: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface AnnouncementData {
  title: string;
  description: string;
  targetAudience: 'all' | 'students' | 'teachers' | 'batch';
  targetBatchIds?: string[];
  scheduledAt?: Date | null;
  isScheduled?: boolean;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  mobile: string;
  role: 'student' | 'teacher';
  [key: string]: any;
}

class AdminService {
  // GET /api/admin/dashboard - Get dashboard data
  async getAdminData(): Promise<ApiResponse<DashboardData>> {
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

  // GET /api/admin/profile - Get admin profile
  async getAdminProfile(): Promise<ApiResponse<AdminUser>> {
    try {
      const response = await api.get('/admin/profile');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get admin profile error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch admin profile',
      };
    }
  }

  // GET /api/admin/students - Get all students
  async getAllStudents(): Promise<ApiResponse<StudentUser[]>> {
    try {
      const response = await api.get('/admin/students');
      return { success: true, data: response.data.students };
    } catch (error: any) {
      console.error('Get all students error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch students',
      };
    }
  }

  // GET /api/admin/teachers - Get all teachers
  async getAllTeachers(): Promise<ApiResponse<TeacherUser[]>> {
    try {
      const response = await api.get('/admin/teachers');
      return { success: true, data: response.data.teachers };
    } catch (error: any) {
      console.error('Get all teachers error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch teachers',
      };
    }
  }

  // POST /api/admin/user - Create new user
  async createUser(userData: CreateUserData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/admin/user', userData);
      return { success: true, data: response.data.user, message: response.data.message };
    } catch (error: any) {
      console.error('Create user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
      };
    }
  }

  // PUT /api/admin/user/:id - Update user
  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<ApiResponse<any>> {
    try {
      const response = await api.put(`/admin/user/${userId}`, userData);
      return { success: true, data: response.data.user, message: response.data.message };
    } catch (error: any) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  }

  // DELETE /api/admin/user/:id - Delete user
  async deleteUser(userId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/user/${userId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Delete user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
      };
    }
  }

  // POST /api/admin/announcement - Create announcement
  async createAnnouncement(announcementData: AnnouncementData): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/admin/announcement', announcementData);
      return {
        success: true,
        data: response.data.notice,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Create announcement error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create announcement',
      };
    }
  }

  // POST /api/admin/students - Add student
  async addStudent(studentData: any): Promise<ApiResponse<CreateStudentData>> {
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

  // PUT /api/admin/students/:id - Update student
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

  // DELETE /api/admin/students/:id - Delete student
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

  // POST /api/admin/teachers - Add teacher
  async addTeacher(teacherData: any): Promise<ApiResponse<TeacherUser>> {
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

  // PUT /api/admin/teachers/:id - Update teacher
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

  // DELETE /api/admin/teachers/:id - Delete teacher
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

  // GET /api/teacher/notices - Get all notices (admin can access all)
  async getAllNotices(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/teacher/notices');
      return { success: true, data: response.data.notices || response.data };
    } catch (error: any) {
      console.error('Get all notices error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch notices',
      };
    }
  }

  // POST /api/teacher/notices - Create a new notice
  async createNotice(noticeData: {
    title: string;
    content: string;
    isImportant?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      const response = await api.post('/teacher/notices', noticeData);
      return {
        success: true,
        data: response.data.notice || response.data,
        message: response.data.message || 'Notice created successfully'
      };
    } catch (error: any) {
      console.error('Create notice error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create notice',
      };
    }
  }

  // GET /api/admin/reports - Get admin reports data
  async getReportsData(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/admin/reports');
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error('Get reports data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reports data',
      };
    }
  }

  // GET /api/batches - Get all batches
  async getAllBatches(): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get('/batches');
      return { success: true, data: response.data.batches || response.data };
    } catch (error: any) {
      console.error('Get all batches error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch batches',
      };
    }
  }

  // POST /api/batches - Create batch
  async createBatch(batchData: any): Promise<ApiResponse<any>> {
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

  // GET /api/admin/pending-approvals - Get all pending students and teachers with details
  async getPendingApprovals(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/admin/pending-approvals');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Get pending approvals error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch pending approvals',
      };
    }
  }

  // PATCH /api/admin/user/:id/status - Change user (student/teacher) status
  async changeUserStatus(
    id: string,
    role: "student" | "teacher",
    status: string
  ): Promise<ApiResponse<any>> {
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

  // GET /api/admin/active-users - Get all students and teachers active in the last 24 hours
  async getActiveUsers(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get('/admin/active-users');
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error('Get active users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active users',
      };
    }
  }
  
  // GET /api/schedule/all - Fetches all schedules with optional filters
  async getAllSchedules(filters: { teacherId?: string; batchId?: string; day?: string }): Promise<ApiResponse<Schedule[]>> {
    try {
      // The API endpoint is '/schedule/all', not '/api/schedule/all'
      const res = await api.get<ApiResponse<Schedule[]>>("/schedule/all", { params: filters });
      return res.data;
    } catch (error) {
      console.error("Error fetching schedules:", error);
      return { success: false, message: "Failed to fetch schedules" };
    }
  }

  // POST /api/schedule - Creates a new schedule
  async createSchedule(scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      // The API endpoint is '/schedule', not '/api/schedule'
      const res = await api.post<ApiResponse<null>>("/schedule", scheduleData);
      return res.data;
    } catch (error) {
      console.error("Error creating schedule:", error);
      return { success: false, message: "Failed to create schedule" };
    }
  }

  // PUT /api/schedule/:id - Updates an existing schedule
  async updateSchedule(scheduleId: string, scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      // The API endpoint is '/schedule/:id', not '/api/schedule/:id'
      const res = await api.put<ApiResponse<null>>(`/schedule/${scheduleId}`, scheduleData);
      return res.data;
    } catch (error) {
      console.error("Error updating schedule:", error);
      return { success: false, message: "Failed to update schedule" };
    }
  }

  // DELETE /api/schedule/:id - Deletes a schedule
  async deleteSchedule(scheduleId: string): Promise<ApiResponse<null>> {
    try {
      // The API endpoint is '/schedule/:id', not '/api/schedule/:id'
      const res = await api.delete<ApiResponse<null>>(`/schedule/${scheduleId}`);
      return res.data;
    } catch (error) {
      console.error("Error deleting schedule:", error);
      return { success: false, message: "Failed to delete schedule" };
    }
  }
  // GET /api/courses - Fetches all courses
  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const response = await api.get('/courses');
      return { success: true, data: response.data.courses || response.data };
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
