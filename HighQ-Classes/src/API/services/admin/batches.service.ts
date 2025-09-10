/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface Teacher {
  _id: string;
  name: string;
  // Add other teacher properties as needed
}

interface Student {
  _id: string;
  name: string;
  // Add other student properties as needed
}

export interface Batch {
  _id: string;
  name: string;
  courseId: string | { _id: string; name: string };
   teacherId: Teacher; // single teacher
  students: Student[];
  createdAt?: string;
  updatedAt?: string;
}

export class BatchService {
  async getAllBatches(): Promise<ApiResponse<Batch[]>> {
    try {
      // Add ?populate=teachers,students to the API call to get detailed data
      const response = await api.get("/batches?populate=teachers,students");
      const batches = Array.isArray(response.data.batches)
        ? response.data.batches.map((b: any) => ({
            _id: b._id,
            name: b.name,
            courseId: b.courseId,
            teacherId: b.teacherId || { _id: "", name: "" }, // single teacher
            students: b.students || [],
          }))
        : [];
      return { success: true, data: batches };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch batches" };
    }
  }

  async createBatch(batchData: Batch): Promise<ApiResponse<Batch>> {
    try {
      const response = await api.post("/batches", batchData);
    return { success: true, data: response.data.batch, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create batch" };
    }
  }

  async deleteBatch(batchId: string): Promise<ApiResponse<void>> {
    try {
      const response = await api.delete(`/batches/${batchId}`);
      return { success: true, message: response.data.message || "Batch deleted successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete batch" };
    }
  }
}
