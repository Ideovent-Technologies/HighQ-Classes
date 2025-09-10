import api from "../Axios";
import { Notice, CreateNoticeDto, UpdateNoticeDto } from "../../types/notice.types";

const getBaseUrl = () => {
  // Corrected to use a single endpoint that matches the backend's server.js file.
  // The backend handles the role-based logic for notice access.
  return "/notices";
};

const noticeService = {
  getAllNotices: async () => {
    try {
      const response = await api.get(getBaseUrl());
      return { success: true, notices: response.data as Notice[] };
    } catch (error: any) {
      console.error("Get all notices error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notices",
      };
    }
  },

  getNoticeById: async (id: string) => {
    try {
      const response = await api.get(`${getBaseUrl()}/${id}`);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Get notice by ID error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch notice",
      };
    }
  },

  createNotice: async (data: CreateNoticeDto) => {
    try {
      const response = await api.post(getBaseUrl(), data);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Create notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create notice",
      };
    }
  },

  updateNotice: async (id: string, updates: UpdateNoticeDto) => {
    try {
      const response = await api.put(`${getBaseUrl()}/${id}`, updates);
      return { success: true, notice: response.data as Notice };
    } catch (error: any) {
      console.error("Update notice error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update notice",
      };
    }
  },

  deleteNotice: async (id: string) => {
    try {
      const response = await api.delete(`${getBaseUrl()}/${id}`);
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
