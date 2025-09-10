/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { Notice } from "../../../types/notice.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class NoticeService {
  async getAllNotices(): Promise<ApiResponse<Notice[]>> {
    try {
      const response = await api.get("/admin/notices");
      return { success: true, data: response.data.data, message: "Notices fetched successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch notices" };
    }
  }

  async createNotice(noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.post("/admin/notices", noticeData);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create notice" };
    }
  }

  async updateNotice(noticeId: string, noticeData: Partial<Notice>): Promise<ApiResponse<Notice>> {
    try {
      const response = await api.put(`/admin/notices/${noticeId}`, noticeData);
      return { success: true, data: response.data.data, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update notice" };
    }
  }

  async deleteNotice(noticeId: string): Promise<ApiResponse<null>> {
    try {
      const response = await api.delete(`/admin/notices/${noticeId}`);
      return { success: true, message: response.data.message || "Notice deleted successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete notice" };
    }
  }
}
