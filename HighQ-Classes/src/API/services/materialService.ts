// /src/API/services/materialService.ts
import api from "../Axios";
import { MaterialUploadData, UploadProgressCallback } from "@/types/material.types";

const materialService = {
  /**
   * Fetches materials for Admins or Teachers (all materials)
   */
  getAdminTeacherMaterials: async () => {
    try {
      const response = await api.get('/materials');
      return { success: true, materials: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch materials" };
    }
  },

  /**
   * Fetches materials for the logged-in Student's batch or specific student
   */
  getStudentMaterials: async (studentId?: string) => {
    try {
      const endpoint = studentId ? `/materials/student/${studentId}` : '/materials/student';
      const response = await api.get(endpoint);
      return response.data.materials || response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch student materials");
    }
  },

  
  uploadMaterial: async (data: MaterialUploadData, onUploadProgress: UploadProgressCallback) => {
    try {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('courseId', data.courseId);
      formData.append('batchIds', JSON.stringify(data.batchIds));
      formData.append('fileType', data.file.type || data.file.name.split('.').pop() || 'unknown');

      const response = await api.post('/materials', formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
      });

      return { success: true, material: response.data.material };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Upload failed" };
    }
  },
  
  
  deleteMaterial: async (materialId: string) => {
    try {
      const response = await api.delete(`/materials/${materialId}`);
      return { success: true, message: response.data.message };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Deletion failed" };
    }
  },


  trackMaterialView: async (materialId: string) => {
    try {
      await api.post(`/materials/view/${materialId}`);
      return { success: true };
    } catch (error) {
      // Don't bother the user if this fails, just log it.
      console.error("Failed to track material view:", error);
      return { success: false };
    }
  },

  /**
   * Track material download for analytics
   */
  trackDownload: async (materialId: string) => {
    try {
      await api.post(`/materials/download/${materialId}`);
      return { success: true };
    } catch (error) {
      console.error("Failed to track material download:", error);
      return { success: false };
    }
  },
};

export default materialService;