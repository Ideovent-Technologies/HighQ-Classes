import api from "../../Axios";
import { StudentUser, CreateStudentData } from "../../../types/student.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class StudentService {
  // Create student
  async addStudent(studentData: CreateStudentData): Promise<ApiResponse<StudentUser>> {
    try {
      // ✅ Ensure role is included in payload
      const payload = { ...studentData, role: "student" };
      const response = await api.post("/admin/user", payload);
      return { success: true, data: response.data.user, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to add student" };
    }
  }

  // Update student
  async updateStudent(studentId: string, studentData: Partial<StudentUser>): Promise<ApiResponse<StudentUser>> {
    try {
      const response = await api.put(`/admin/user/${studentId}`, studentData);
      return { success: true, data: response.data.user, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update student" };
    }
  }

  // Delete student
  async deleteStudent(studentId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/user/${studentId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete student" };
    }
  }

  // Get all students
  async getAllStudents(): Promise<ApiResponse<StudentUser[]>> {
    try {
      const response = await api.get("/admin/students");
      return { success: true, data: response.data.students, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch students" };
    }
  }
}

export const studentService = new StudentService();
