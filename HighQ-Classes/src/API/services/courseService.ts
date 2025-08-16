/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../Axios";
import { Course, CourseTopic } from "../../types/course.types"; // Ensure CourseTopic is imported if used in CreateCourseData

// Define CreateCourseData locally or import it if you define it globally in course.types.ts
// For this fix, we'll define it here to ensure the service knows its type.
interface CreateCourseData {
    name: string;
    description?: string;
    duration: string;
    fee: number;
    topics?: CourseTopic[]; // Include topics
    batches?: any[]; // Include batches
}

class CourseService {
    async getAllCourses(): Promise<{
        success: boolean;
        courses?: Course[];
        message?: string;
    }> {
        try {
            const response = await api.get('/courses/');
            return { success: true, courses: response.data };
        } catch (error: any) {
            console.error('Get all courses error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch courses',
            };
        }
    }

    // FIXED: Changed parameter type from 'Course' to 'CreateCourseData'
    async CreateCourse(courseData: CreateCourseData): Promise<{
        success: boolean;
        course?: Course;
        message?: string;
    }> {
        try {
            const response = await api.post('/courses/', courseData);
            return { success: true, course: response.data.course };
        } catch (error: any) {
            console.error('Create course error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create course',
            };
        }
    }

    async getCourseById(courseId: string): Promise<{
        success: boolean;
        course?: Course;
        message?: string;
    }> {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return { success: true, course: response.data };
        } catch (error: any) {
            console.error('Get course by ID error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch course',
            };
        }
    }

    async UpdateCourse(courseId: string, updateData: Partial<Course>): Promise<{
        success: boolean;
        course?: Course;
        message?: string;
    }> {
        try {
            const response = await api.patch(`/courses/${courseId}`, updateData);
            return { success: true, course: response.data };
        } catch (error: any) {
            console.error('Update course error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update course',
            };
        }
    }

    // FIXED: Changed method name from 'DeleteCourse' to 'deleteCourse' (camelCase)
    // This aligns with the error message you received.
    async deleteCourse(id: string): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const response = await api.delete(`/courses/${id}`);
            return { success: true, message: response.data.message || 'Course deleted successfully' };
        } catch (error: any) {
            console.error('Delete course error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete course',
            };
        }
    }

    async AddbatchtoCourse(courseId: string, batchId: string): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            const response = await api.post(`/courses/${courseId}/batches`, { batchId });
            return { success: true, message: response.data.message };
        } catch (error: any) {
            console.error('Add batch to course error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add batch to course',
            };
        }
    }

    async updatebatch(courseId: string, batchId: string, updateData: Partial<Course>): Promise<{
        success: boolean;
        course?: Course;
        message?: string;
    }> {
        try {
            const response = await api.put(`/courses/${courseId}/batches/${batchId}`, updateData);
            return { success: true, course: response.data.course };
        } catch (error: any) {
            console.error('Update batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update batch',
            };
        }
    }

    async updatestudentinBatch(courseId: string, batchId: string, studentIds: string[]): Promise<{
        success: boolean;
        message?: string;
    }> {
        try {
            await api.post(`/courses/${courseId}/batches/${batchId}/students`, { studentIds });
            return { success: true, message: 'Students updated successfully' };
        } catch (error: any) {
            console.error('Update students in batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update students in batch',
            };
        }
    }
}
export default new CourseService();
