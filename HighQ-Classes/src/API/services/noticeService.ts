import api from "../Axios";
import { Notice, CreateNoticeDto, UpdateNoticeDto } from "../../types/notice.types";

const noticeService = {
  /**
   * Fetches all notices created by the logged-in teacher
   */
  getAllNotices: async () => {
    try {
      const response = await api.get("/teacher/notices");
      return { success: true, notices: response.data as Notice[] };
    } catch (error: any) {
      console.error("Get all notices error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notices",
      };
    }
  },

  /**
   * Fetch a single notice by ID
   */
  getNoticeById: async (id: string) => {
    try {
      const response = await api.get(`/teacher/notices/${id}`);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Get notice by ID error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notice",
      };
    }
  },

  /**
   * Create a new notice
   */
  createNotice: async (data: CreateNoticeDto) => {
    try {
      const response = await api.post("/teacher/notices", data);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Create notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create notice",
      };
    }
  },

  /**
   * Update an existing notice
   */
  updateNotice: async (id: string, updates: UpdateNoticeDto) => {
    try {
      const response = await api.put(`/teacher/notices/${id}`, updates);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Update notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update notice",
      };
    }
  },

  /**
   * Delete a notice
   */
  deleteNotice: async (id: string) => {
    try {
      const response = await api.delete(`/teacher/notices/${id}`);
      return { success: true, message: response.data.message || "Notice deleted successfully" };
    } catch (error: any) {
      console.error("Delete notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete notice",
      };
    }
  },
};

export default noticeService;
