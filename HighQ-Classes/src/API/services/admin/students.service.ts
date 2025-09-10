import api from "../../Axios";
import { StudentUser, CreateStudentData } from "../../../types/student.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class StudentService {
  async addStudent(studentData: CreateStudentData): Promise<ApiResponse<StudentUser>> {
    try {
      const response = await api.post("/admin/students", studentData);
      return { success: true, data: response.data.student, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to add student" };
    }
  }

  async updateStudent(studentId: string, studentData: Partial<StudentUser>): Promise<ApiResponse<StudentUser>> {
    try {
      const response = await api.put(`/admin/students/${studentId}`, studentData);
      return { success: true, data: response.data.student, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update student" };
    }
  }

  async deleteStudent(studentId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/students/${studentId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete student" };
    }
  }

  async getAllStudents(): Promise<ApiResponse<StudentUser[]>> {
    try {
      const response = await api.get("/admin/students");
      return { success: true, data: response.data.students, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch students" };
    }
  }
}
