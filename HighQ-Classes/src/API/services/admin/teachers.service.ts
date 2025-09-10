/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { TeacherUser, CreateTeacherData } from "../../../types/teacher.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class TeacherService {
  async addTeacher(teacherData: CreateTeacherData): Promise<ApiResponse<TeacherUser>> {
    try {
      const response = await api.post("/admin/teachers", teacherData);
      return { success: true, data: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to add teacher" };
    }
  }

  async updateTeacher(teacherId: string, teacherData: Partial<TeacherUser>): Promise<ApiResponse<TeacherUser>> {
    try {
      const response = await api.put(`/admin/teachers/${teacherId}`, teacherData);
      return { success: true, data: response.data.teacher, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update teacher" };
    }
  }

  async deleteTeacher(teacherId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/teachers/${teacherId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete teacher" };
    }
  }

  async getAllTeachers(): Promise<ApiResponse<TeacherUser[]>> {
    try {
      const response = await api.get("/admin/teachers");
      return { success: true, data: response.data.teachers, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch teachers" };
    }
  }
}
