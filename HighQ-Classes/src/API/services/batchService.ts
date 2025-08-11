/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../Axios';

// Types for batch operations
interface Batch {
    _id: string;
    name: string;
    courseId: string; // ✅ match backend
    teacherId: string; // ✅ match backend
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

interface CreateBatchData {
    name: string;
    courseId: string;  // ✅ match backend
    teacherId: string; // ✅ match backend
    students: string[]; // ✅ added
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
    }
};

export default batchService;
