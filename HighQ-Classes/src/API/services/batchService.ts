import api from '../Axios';

// Types for batch operations (will be moved to types/batch.types.ts by Sumit)
interface Batch {
    _id: string;
    name: string;
    course: string;
    teacher: string;
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
    course: string;
    teacher: string;
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

// Batch service for admin dashboard - maps to Server/routes/batchRoutes.js
const batchService = {
    // GET /api/batch - Get all batches
    getAllBatches: async (): Promise<{ success: boolean; batches?: Batch[]; message?: string }> => {
        try {
            const response = await api.get('/batch');
            return { success: true, batches: response.data.batches };
        } catch (error: any) {
            console.error('Get all batches error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch batches' 
            };
        }
    },

    // GET /api/batch/:id - Get batch by ID  
    getBatchById: async (batchId: string): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.get(`/batch/${batchId}`);
            return { success: true, batch: response.data.batch };
        } catch (error: any) {
            console.error('Get batch by ID error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to fetch batch' 
            };
        }
    },

    // POST /api/batch - Create new batch
    createBatch: async (batchData: CreateBatchData): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.post('/batch', batchData);
            return { success: true, batch: response.data.batch };
        } catch (error: any) {
            console.error('Create batch error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to create batch' 
            };
        }
    },

    // PUT /api/batch/:id - Update batch
    updateBatch: async (batchId: string, updateData: UpdateBatchData): Promise<{ success: boolean; batch?: Batch; message?: string }> => {
        try {
            const response = await api.put(`/batch/${batchId}`, updateData);
            return { success: true, batch: response.data.batch };
        } catch (error: any) {
            console.error('Update batch error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to update batch' 
            };
        }
    },

    // DELETE /api/batch/:id - Delete batch
    deleteBatch: async (batchId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/batch/${batchId}`);
            return { success: true };
        } catch (error: any) {
            console.error('Delete batch error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to delete batch' 
            };
        }
    },

    // POST /api/batch/:id/students - Add students to batch
    addStudentsToBatch: async (batchId: string, studentIds: string[]): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.post(`/batch/${batchId}/students`, { studentIds });
            return { success: true };
        } catch (error: any) {
            console.error('Add students to batch error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Failed to add students to batch' 
            };
        }
    },

    // DELETE /api/batch/:id/students/:studentId - Remove student from batch
    removeStudentFromBatch: async (batchId: string, studentId: string): Promise<{ success: boolean; message?: string }> => {
        try {
            await api.delete(`/batch/${batchId}/students/${studentId}`);
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
