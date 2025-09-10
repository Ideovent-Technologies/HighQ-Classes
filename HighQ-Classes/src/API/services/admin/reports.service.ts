/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { DashboardData } from "../../../types/report.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ReportService {
  async getReportsData(): Promise<ApiResponse<DashboardData>> {
    try {
      const response = await api.get("/admin/dashboard");
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch reports data" };
    }
  }
}
