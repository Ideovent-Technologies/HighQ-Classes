/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../Axios";
import { DashboardData } from "../../types/admin.types";
import { StudentUser, CreateStudentData  } from "../../types/student.types";
import { TeacherUser } from "../../types/teacher.types";
import { AdminUser } from "../../types/admin.types";

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

  // GET /api/admin/profile - Get admin profile
  async getAdminProfile(): Promise<{
    success: boolean;
    admin?: AdminUser;
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

  // GET /api/admin/students - Get all students
  async getAllStudents(): Promise<{
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

  // GET /api/admin/teachers - Get all teachers
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

  // POST /api/admin/user - Create new user
  async createUser(userData: CreateUserData): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> {
    try {
      const response = await api.post('/admin/user', userData);
      return { success: true, user: response.data.user, message: response.data.message };
    } catch (error: any) {
      console.error('Create user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create user',
      };
    }
  }

  // PUT /api/admin/user/:id - Update user
  async updateUser(userId: string, userData: Partial<CreateUserData>): Promise<{
    success: boolean;
    user?: any;
    message?: string;
  }> {
    try {
      const response = await api.put(`/admin/user/${userId}`, userData);
      return { success: true, user: response.data.user, message: response.data.message };
    } catch (error: any) {
      console.error('Update user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user',
      };
    }
  }

  // DELETE /api/admin/user/:id - Delete user
  async deleteUser(userId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
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
  async createAnnouncement(announcementData: AnnouncementData): Promise<{
    success: boolean;
    announcement?: any;
    message?: string;
  }> {
    try {
      const response = await api.post('/admin/announcement', announcementData);
      return { 
        success: true, 
        announcement: response.data.notice, 
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
  async addStudent(studentData: any): Promise<{
    success: boolean;
    student?: CreateStudentData ;
    message?: string;
  }> {
    try {
      const response = await api.post('/admin/students', studentData);
      return { success: true, student: response.data.student, message: response.data.message };
    } catch (error: any) {
      console.error('Add student error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add student',
      };
    }
  }

  // PUT /api/admin/students/:id - Update student
  async updateStudent(studentId: string, studentData: Partial<StudentUser>): Promise<{
    success: boolean;
    student?: StudentUser;
    message?: string;
  }> {
    try {
      const response = await api.put(`/admin/students/${studentId}`, studentData);
      return { success: true, student: response.data.student, message: response.data.message };
    } catch (error: any) {
      console.error('Update student error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update student',
      };
    }
  }

  // DELETE /api/admin/students/:id - Delete student
  async deleteStudent(studentId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
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
  async addTeacher(teacherData: any): Promise<{
    success: boolean;
    teacher?: TeacherUser;
    message?: string;
  }> {
    try {
      const response = await api.post('/admin/teachers', teacherData);
      return { success: true, teacher: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      console.error('Add teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to add teacher',
      };
    }
  }

  // PUT /api/admin/teachers/:id - Update teacher
  async updateTeacher(teacherId: string, teacherData: Partial<TeacherUser>): Promise<{
    success: boolean;
    teacher?: TeacherUser;
    message?: string;
  }> {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
      return { success: true, teacher: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      console.error('Update teacher error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update teacher',
      };
    }
  }

  // DELETE /api/admin/teachers/:id - Delete teacher
  async deleteTeacher(teacherId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
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
  async getAllNotices(): Promise<{
    success: boolean;
    notices?: any[];
    message?: string;
  }> {
    try {
      const response = await api.get('/teacher/notices');
      return { success: true, notices: response.data.notices || response.data };
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
  }): Promise<{
    success: boolean;
    notice?: any;
    message?: string;
  }> {
    try {
      const response = await api.post('/teacher/notices', noticeData);
      return { 
        success: true, 
        notice: response.data.notice || response.data,
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
  async getReportsData(): Promise<{
    success: boolean;
    reports?: any;
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/reports');
      return { success: true, reports: response.data };
    } catch (error: any) {
      console.error('Get reports data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch reports data',
      };
    }
  }

  // GET /api/batches - Get all batches
  async getAllBatches(): Promise<{
    success: boolean;
    batches?: any[];
    message?: string;
  }> {
    try {
      const response = await api.get('/batches');
      return { success: true, batches: response.data.batches || response.data };
    } catch (error: any) {
      console.error('Get all batches error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch batches',
      };
    }
  }

  // POST /api/batches - Create batch
  async createBatch(batchData: any): Promise<{
    success: boolean;
    batch?: any;
    message?: string;
  }> {
    try {
      const response = await api.post('/batches', batchData);
      return { success: true, batch: response.data.batch, message: response.data.message };
    } catch (error: any) {
      console.error('Create batch error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create batch',
      };
    }
  }

  // GET /api/admin/pending-approvals - Get all pending students and teachers with details
  async getPendingApprovals(): Promise<{
    success: boolean;
    students?: StudentUser[];
    teachers?: TeacherUser[];
    total?: number;
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/pending-approvals');
      return {
        success: true,
        students: response.data.students,
        teachers: response.data.teachers,
        total: response.data.total,
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
  ): Promise<{
    success: boolean;
    user?: StudentUser | TeacherUser;
    message?: string;
  }> {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, { role, status });
      return {
        success: true,
        user: response.data.user,
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
  async getActiveUsers(): Promise<{
    success: boolean;
    students?: StudentUser[];
    teachers?: TeacherUser[];
    total?: number;
    message?: string;
  }> {
    try {
      const response = await api.get('/admin/active-users');
      return {
        success: true,
        students: response.data.students,
        teachers: response.data.teachers,
        total: response.data.total,
      };
    } catch (error: any) {
      console.error('Get active users error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch active users',
      };
    }
  }
}



//  Correct export after closing the class
export default new AdminService();
