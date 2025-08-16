import api from '../Axios';
import { AttendanceRecord, AttendanceMarkingData, AttendanceSummary, BatchAttendanceData } from '@/types/attendance.types';

const API_BASE_URL = '/attendance';

class AttendanceService {
  // Mark attendance for students
  async markAttendance(attendanceData: AttendanceMarkingData[]): Promise<{
    success: boolean;
    message: string;
    data?: AttendanceRecord[];
  }> {
    try {
      // Extract common data from first record
      const batchId = attendanceData[0]?.batchId;
      const date = attendanceData[0]?.date;
      
      if (!batchId || !date) {
        throw new Error('Missing batchId or date in attendance data');
      }

      // Transform data to match backend expectation
      const attendance = attendanceData.map(record => ({
        studentId: record.studentId,
        status: record.status,
        notes: record.notes
      }));

      const response = await api.post(API_BASE_URL, {
        batchId,
        date,
        attendance
      });

      return {
        success: true,
        message: 'Attendance marked successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Mark attendance error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to mark attendance'
      };
    }
  }

  // Get attendance records with filters
  async getAttendanceRecords(filters: {
    batchId?: string;
    courseId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: {
      records: AttendanceRecord[];
      pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
      };
    };
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`${API_BASE_URL}/records?${params.toString()}`);

      return {
        success: true,
        message: 'Attendance records retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get attendance records error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch attendance records'
      };
    }
  }

  // Get attendance summary for students
  async getAttendanceSummary(filters: {
    batchId?: string;
    courseId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: AttendanceSummary[];
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`${API_BASE_URL}/summary?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Attendance summary retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get attendance summary error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch attendance summary'
      };
    }
  }

  // Get batch attendance data for marking
  async getBatchAttendanceData(batchId: string, date: string): Promise<{
    success: boolean;
    message: string;
    data?: BatchAttendanceData;
  }> {
    try {
      const response = await api.get(API_BASE_URL, {
        params: { 
          batchId: batchId,
          date: date 
        },
        withCredentials: true
      });

      // The backend now returns the full structure with students
      return {
        success: true,
        message: 'Batch attendance data retrieved successfully',
        data: response.data.data // response.data.data contains the BatchAttendanceData
      };
    } catch (error: any) {
      console.error('Get batch attendance data error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch batch attendance data'
      };
    }
  }

  // Update attendance record
  async updateAttendance(recordId: string, updateData: {
    status?: 'present' | 'absent' | 'late' | 'excused';
    notes?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data?: AttendanceRecord;
  }> {
    try {
      const response = await api.put(`${API_BASE_URL}/${recordId}`, updateData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Attendance updated successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Update attendance error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update attendance'
      };
    }
  }

  // Delete attendance record
  async deleteAttendance(recordId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await api.delete(`${API_BASE_URL}/${recordId}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Attendance record deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete attendance error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete attendance record'
      };
    }
  }

  // Get attendance statistics
  async getAttendanceStats(filters: {
    batchId?: string;
    courseId?: string;
    date?: string;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await api.get(`${API_BASE_URL}/stats?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Attendance statistics retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get attendance stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch attendance statistics'
      };
    }
  }
}

export default new AttendanceService();
