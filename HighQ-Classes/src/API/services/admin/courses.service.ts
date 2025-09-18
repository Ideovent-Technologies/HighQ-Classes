/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { Course } from "../../../types/course.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class CourseService {


  async createCourse(courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    try {
      const response = await api.post("/courses", courseData);
      return { success: true, data: response.data.course, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create course" };
    }
  }

  async updateCourse(courseId: string, courseData: Partial<Course>): Promise<ApiResponse<Course>> {
    try {
      const response = await api.put(`/courses/${courseId}`, courseData);
      return { success: true, data: response.data.course, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update course" };
    }
  }

  async deleteCourse(courseId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/courses/${courseId}`);
      return { success: true, message: response.data.message || "Course deleted successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete course" };
    }
  }

  async getAllCourses(): Promise<ApiResponse<Course[]>> {
    try {
      const response = await api.get("/courses");
      return { success: true, data: response.data, message: undefined };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch courses" };
    }
  }
}

