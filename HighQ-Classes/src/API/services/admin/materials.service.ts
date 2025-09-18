// src/API/services/admin/materials.service.ts
import api from "../../Axios";

export interface Material {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  originalFileName: string;
  uploadedBy?: any;
  batchIds: string[];
  courseId?: any;
  viewedBy: Array<{ user: string; viewedAt: string; _id: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetMaterialsResponse {
  success: boolean;
  data?: Material[];
  message?: string;
}

export interface DeleteMaterialResponse {
  success: boolean;
  message?: string;
}

// ---------------- GET ALL MATERIALS ----------------
const getAdminTeacherMaterials = async (): Promise<GetMaterialsResponse> => {
  try {
    const { data } = await api.get("/materials");
    // data is already an array
    return { success: true, data };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch materials" };
  }
};

// ---------------- DELETE MATERIAL ----------------
const deleteMaterial = async (materialId: string): Promise<DeleteMaterialResponse> => {
  try {
    const { data } = await api.delete(`/materials/${materialId}`);
    return { success: true, message: data.message };
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to delete material" };
  }
};

// ---------------- TRACK MATERIAL VIEW ----------------
const trackMaterialView = async (materialId: string): Promise<void> => {
  try {
    await api.post(`/materials/view/${materialId}`);
  } catch (error: any) {
    console.error("Failed to track material view:", error.response?.data?.message || error);
  }
};

// ---------------- UPLOAD MATERIAL ----------------
const uploadMaterial = async (formData: FormData): Promise<GetMaterialsResponse> => {
  try {
    const { data } = await api.post("/materials/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { success: true, data: [data] }; // return array to match getAdminTeacherMaterials
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to upload material" };
  }
};

export default {
  getAdminTeacherMaterials,
  deleteMaterial,
  trackMaterialView,
  uploadMaterial,
};
