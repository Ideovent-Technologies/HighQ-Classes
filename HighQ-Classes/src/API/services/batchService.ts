/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../Axios';

// Types for batch operations
interface Batch {
    _id: string;
    name: string;
    courseId: string; //  match backend
    teacherId: string; //  match backend
    students: string[];
    startDate: Date;
    endDate: Date;
    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    capacity: number;
    enrolled: number;
    status: 'active' | 'inactive' | 'completed';
    description?: string;
}

// Student-specific batch interfaces
export interface BatchCourse {
    _id: string;
    name: string;
    description?: string;
    duration?: string;
    instructor?: string;
    topics?: string[];
}

export interface BatchTeacher {
    _id: string;
    name: string;
    email: string;
    employeeId: string;
    qualification?: string;
    specialization?: string;
    profilePicture?: string;
}

export interface BatchStudent {
    _id: string;
    name: string;
    email: string;
    grade: string;
    profilePicture?: string;
}

export interface StudentBatchInfo {
    _id: string;
    name: string;
    course: BatchCourse;
    teacher: BatchTeacher;
    students: BatchStudent[];
    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    startDate: string;
    endDate: string;
    totalStudents: number;
    isActive: boolean;
}

interface CreateBatchData {
    name: string;
    courseId: string;  //  match backend
    teacherId: string; //  match backend
    students: string[]; //  added
    startDate: Date;
    endDate: Date;
    schedule: {
        days: string[];
        startTime: string;
        endTime: string;
    };
    capacity: number;
    description?: string;
}

interface UpdateBatchData extends Partial<CreateBatchData> {
    status?: 'active' | 'inactive' | 'completed';
}

const batchService = {
    // Admin batch operations
    getAllBatches: async (): Promise<{ success: boolean; batches?: Batch[]; message?: string }> => {
        try {
            const response = await api.get('/batches');
            return { success: true, batches: response.data };
        } catch (error: any) {
            console.error('Get all batches error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch batches'
            };
        }
    },

    getBatchById: async (batchId: string): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.get(`/batches/${batchId}`);
            return { success: true, batch: response.data };
        } catch (error: any) {
            console.error('Get batch by ID error:', error);
            return {
                success: false,
                message: error.response?.data?.message || error.response?.data?.error || 'Failed to fetch batch'
            };
        }
    },

    createBatch: async (batchData: CreateBatchData): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.post('/batches', batchData);
            return { success: true, batch: response.data };
        } catch (error: any) {
            console.error('Create batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to create batch'
            };
        }
    },

    updateBatch: async (batchId: string, updateData: UpdateBatchData): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.put(`/batches/${batchId}`, updateData);
            return { success: true, batch: response.data };
        } catch (error: any) {
            console.error('Update batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to update batch'
            };
        }
    },

    deleteBatch: async (batchId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/batches/${batchId}`);
            return { success: true };
        } catch (error: any) {
            console.error('Delete batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to delete batch'
            };
        }
    },

    addStudentsToBatch: async (batchId: string, studentIds: string[]): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.post(`/batches/${batchId}/students`, { studentIds });
            return { success: true };
        } catch (error: any) {
            console.error('Add students to batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to add students to batch'
            };
        }
    },

    removeStudentFromBatch: async (batchId: string, studentId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/batches/${batchId}/students/${studentId}`);
            return { success: true };
        } catch (error: any) {
            console.error('Remove student from batch error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to remove student from batch'
            };
        }
    },

    // Student-specific batch operations
    /**
     * Get student's assigned batch information
     */
    getStudentBatch: async (): Promise<StudentBatchInfo | null> => {
        try {
            const response = await api.get('/student/batch');
            return response.data.success ? response.data.batch : null;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Student not assigned to any batch
            }
            console.error('Get student batch error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch batch information');
        }
    },

    /**
     * Get materials for student's batch
     */
    getBatchMaterials: async () => {
        try {
            console.log("🌐 Making API call to /materials/student");
            const response = await api.get('/materials/student');
            console.log("📡 API response received:", response);
            console.log("📊 Response data:", response.data);
            console.log("📈 Response status:", response.status);
            
            // Backend returns materials directly, not wrapped in a materials property
            const materials = response.data || [];
            console.log(" Processed materials:", materials);
            return materials;
        } catch (error: any) {
            console.error('❌ Get batch materials error:', error);
            console.error('❌ Error response:', error.response);
            console.error('❌ Error status:', error.response?.status);
            console.error('❌ Error data:', error.response?.data);
            throw new Error(error.response?.data?.message || 'Failed to fetch materials');
        }
    },

    /**
     * Get recordings for student's batch
     */
    getBatchRecordings: async () => {
        try {
            const response = await api.get('/recordings/student');
            return response.data.recordings || [];
        } catch (error: any) {
            console.error('Get batch recordings error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch recordings');
        }
    },

    /**
     * Get assignments for student's batch
     */
    getBatchAssignments: async () => {
        try {
            const response = await api.get('/assignments');
            return response.data.assignments || [];
        } catch (error: any) {
            console.error('Get batch assignments error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
        }
    },

    /**
     * Mark material as viewed by student
     */
    viewMaterial: async (materialId: string): Promise<void> => {
        try {
            await api.post(`/materials/view/${materialId}`);
        } catch (error: any) {
            console.error('View material error:', error);
            // Don't throw error for view tracking failures
        }
    },

    /**
     * Get student's attendance for the batch
     */
    getStudentAttendance: async () => {
        try {
            const response = await api.get('/attendance/student');
            return response.data;
        } catch (error: any) {
            console.error('Get student attendance error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
        }
    }
};

export default batchService;
