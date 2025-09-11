/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { Batch } from "@/types/batch.types";

/**
 * A generic response interface for API calls.
 * @template T The type of data expected in a successful response.
 */
export interface BatchServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  batch?: Batch;
}

export class BatchService {
  // ---------------- GET ALL BATCHES ----------------
  async getAllBatches(): Promise<BatchServiceResponse<Batch[]>> {
    try {
      const response = await api.get("/batches?populate=courseId,teacherId,students");
      const batches = Array.isArray(response.data.batches)
        ? response.data.batches.map((b: any) => ({
            _id: b._id,
            name: b.name,
            description: b.description,
            courseId: b.courseId,
            teacherId: b.teacherId || { _id: "", name: "" },
            students: b.students || [],
            schedule: b.schedule,
            capacity: b.capacity,
            startDate: b.startDate,
            endDate: b.endDate,
            status: b.status,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
          }))
        : [];
      return { success: true, data: batches };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch batches" };
    }
  }

  // ---------------- GET SINGLE BATCH ----------------
  async getBatchById(batchId: string): Promise<BatchServiceResponse<Batch>> {
    try {
      const response = await api.get(`/batches/${batchId}`);
      return { success: true, data: response.data }; // ✔ return actual batch
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch batch"
      };
    }
  }

  // ---------------- CREATE BATCH ----------------
  async createBatch(batchData: any): Promise<BatchServiceResponse<Batch>> {
    try {
      const response = await api.post("/batches", batchData);
      return { success: true, batch: response.data.batch, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create batch" };
    }
  }

  // ---------------- UPDATE BATCH ----------------
  async updateBatch(batchId: string, batchData: any): Promise<BatchServiceResponse<Batch>> {
    try {
      const response = await api.put(`/batches/${batchId}`, batchData);
      return { success: true, batch: response.data, message: "Batch updated successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update batch" };
    }
  }

  // ---------------- DELETE BATCH ----------------
  async deleteBatch(batchId: string): Promise<BatchServiceResponse<any>> {
    try {
      const response = await api.delete(`/batches/${batchId}`);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete batch" };
    }
  }

  // ---------------- STUDENT-SPECIFIC OPERATIONS ----------------
  public static async getStudentBatch(): Promise<any | null> {
    try {
      const response = await api.get('/student/batch');
      return response.data.success && response.data.batches.length > 0
        ? response.data.batches[0]
        : null;
    } catch (error: any) {
      if (error.response?.status === 404) return null;
      console.error('Get student batch error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch batch information');
    }
  }

  public static async getBatchMaterials() {
    try {
      const response = await api.get('/materials/student');
      return response.data || [];
    } catch (error: any) {
      console.error('❌ Get batch materials error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch materials');
    }
  }

  public static async getBatchRecordings() {
    try {
      const response = await api.get('/recordings/student');
      return response.data.recordings || [];
    } catch (error: any) {
      console.error('Get batch recordings error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch recordings');
    }
  }

  public static async getBatchAssignments() {
    try {
      const response = await api.get('/assignments');
      return response.data.assignments || [];
    } catch (error: any) {
      console.error('Get batch assignments error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
    }
  }

  public static async viewMaterial(materialId: string): Promise<void> {
    try {
      await api.post(`/materials/view/${materialId}`);
    } catch (error: any) {
      console.error('View material error:', error);
    }
  }

  public static async getStudentAttendance() {
    try {
      const response = await api.get('/attendance/student');
      return response.data;
    } catch (error: any) {
      console.error('Get student attendance error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
}

export default BatchService;
