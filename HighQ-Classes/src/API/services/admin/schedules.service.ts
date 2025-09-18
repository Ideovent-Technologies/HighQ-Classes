/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "../../Axios";
import { Schedule, ScheduleFormData } from "../../../types/schedule.types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export class ScheduleService {
  async getAllSchedules(filters: { teacherId?: string; batchId?: string; day?: string }): Promise<ApiResponse<Schedule[]>> {
    try {
      const res = await api.get<ApiResponse<Schedule[]>>("/schedule/all", { params: filters });
      return res.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch schedules" };
    }
  }

  async createSchedule(scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      const res = await api.post<ApiResponse<null>>("/schedule", scheduleData);
      return res.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to create schedule" };
    }
  }

  async updateSchedule(scheduleId: string, scheduleData: ScheduleFormData): Promise<ApiResponse<null>> {
    try {
      const res = await api.put<ApiResponse<null>>(`/schedule/${scheduleId}`, scheduleData);
      return res.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update schedule" };
    }
  }

  async deleteSchedule(scheduleId: string): Promise<ApiResponse<null>> {
    try {
      const res = await api.delete<ApiResponse<null>>(`/schedule/${scheduleId}`);
      return res.data;
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete schedule" };
    }
  }
}
