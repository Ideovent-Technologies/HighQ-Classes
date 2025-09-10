/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { StudentUser, TeacherUser } from "../../../types/user.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class UserService {
  async getPendingApprovals(): Promise<ApiResponse<{ students: StudentUser[]; teachers: TeacherUser[] }>> {
    try {
      const response = await api.get("/admin/pending-approvals");
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch pending approvals" };
    }
  }

  async changeUserStatus(
    id: string,
    role: "student" | "teacher",
    status: string
  ): Promise<ApiResponse<StudentUser | TeacherUser>> {
    try {
      const response = await api.patch(`/admin/user/${id}/status`, { role, status });
      return { success: true, data: response.data.user, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to change user status" };
    }
  }

  async getActiveUsers(): Promise<ApiResponse<{ activeStudents: number; activeTeachers: number }>> {
    try {
      const response = await api.get("/admin/active-users");
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch active users" };
    }
  }
}
