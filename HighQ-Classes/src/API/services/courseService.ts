import api from "../Axios"
import { Course } from "../../types/course.types";

class CourseService {
    async getAllCourses(): Promise<{
        success: boolean;
        courses?: Course[];
        message?: string;
    }> {
        try {
            const response = await api.get('/courses/');
            return { success: true, courses: response.data.courses };
        } catch (error: any) {
            console.error('Get all courses error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch courses',
            };
        }
    }

    async CreateCourse(courseData: Course): Promise<{
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

    async UpdateCourse(courseId: string, updateData: Partial<Course>): Promise<{
        success: boolean;
        course?: Course;
        message?: string;
    }> {
        try {
            const response = await api.put(`/courses/${courseId}`, updateData);
            return { success: true, course: response.data.course };
        } catch (error: any) {
            console.error('Update course error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update course',
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