import axios from 'axios';

export interface Recording {
  _id: string;
  title: string;
  description?: string;
  subject: string;
  fileUrl: string;
  thumbnailUrl?: string;
  duration?: number;
  course: {
    _id: string;
    name: string;
  };
  batch: {
    _id: string;
    name: string;
  };
  views: number;
  accessExpires?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordingUploadData {
  title: string;
  description?: string;
  courseId: string;
  batchId?: string;
  recordingDate?: string;
  duration?: string;
  file: File;
  teacherId?: string;
}

class RecordingService {
  private API_BASE_URL = '/api/recordings';

  // Upload recording
  async uploadRecording(data: RecordingUploadData): Promise<{
    success: boolean;
    message: string;
    recording?: Recording;
  }> {
    try {
      const formData = new FormData();
      formData.append('video', data.file);
      formData.append('title', data.title);
      if (data.description) {
        formData.append('description', data.description);
      }
      formData.append('courseId', data.courseId);
      if (data.batchId) {
        formData.append('batchId', data.batchId);
      }
      if (data.recordingDate) {
        formData.append('recordingDate', data.recordingDate);
      }
      if (data.duration) {
        formData.append('duration', data.duration);
      }
      if (data.teacherId) {
        formData.append('teacherId', data.teacherId);
      }

      const response = await axios.post(this.API_BASE_URL, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        message: response.data.message || 'Recording uploaded successfully',
        recording: response.data.data,
      };
    } catch (error: any) {
      console.error('Upload recording error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload recording',
      };
    }
  }

  // Get recordings for teacher
  async getTeacherRecordings(teacherId?: string): Promise<{
    success: boolean;
    message: string;
    recordings?: Recording[];
  }> {
    try {
      const url = teacherId 
        ? `${this.API_BASE_URL}/teacher/${teacherId}`
        : `${this.API_BASE_URL}/teacher`;
        
      const response = await axios.get(url, {
        withCredentials: true,
      });

      return {
        success: true,
        message: 'Recordings fetched successfully',
        recordings: response.data.data || [],
      };
    } catch (error: any) {
      console.error('Get teacher recordings error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recordings',
      };
    }
  }

  // Get recordings for student
  async getStudentRecordings(): Promise<{
    success: boolean;
    message: string;
    recordings?: Recording[];
  }> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/student`, {
        withCredentials: true,
      });

      return {
        success: true,
        message: 'Recordings fetched successfully',
        recordings: response.data.data || [],
      };
    } catch (error: any) {
      console.error('Get student recordings error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recordings',
      };
    }
  }

  // Get recording by ID
  async getRecordingById(recordingId: string): Promise<{
    success: boolean;
    message: string;
    recording?: Recording;
  }> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/${recordingId}`, {
        withCredentials: true,
      });

      return {
        success: true,
        message: 'Recording fetched successfully',
        recording: response.data.data,
      };
    } catch (error: any) {
      console.error('Get recording by ID error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch recording',
      };
    }
  }

  // Delete recording
  async deleteRecording(recordingId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await axios.delete(`${this.API_BASE_URL}/${recordingId}`, {
        withCredentials: true,
      });

      return {
        success: true,
        message: response.data.message || 'Recording deleted successfully',
      };
    } catch (error: any) {
      console.error('Delete recording error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete recording',
      };
    }
  }

  // Track recording view
  async trackRecordingView(recordingId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await axios.post(`${this.API_BASE_URL}/${recordingId}/view`, {}, {
        withCredentials: true,
      });

      return {
        success: true,
        message: 'View tracked successfully',
      };
    } catch (error: any) {
      console.error('Track recording view error:', error);
      return {
        success: false,
        message: 'Failed to track view',
      };
    }
  }

  // Update recording
  async updateRecording(recordingId: string, data: Partial<RecordingUploadData>): Promise<{
    success: boolean;
    message: string;
    recording?: Recording;
  }> {
    try {
      const response = await axios.put(`${this.API_BASE_URL}/${recordingId}`, data, {
        withCredentials: true,
      });

      return {
        success: true,
        message: response.data.message || 'Recording updated successfully',
        recording: response.data.data,
      };
    } catch (error: any) {
      console.error('Update recording error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update recording',
      };
    }
  }

  // Get recording statistics
  async getRecordingStats(teacherId?: string): Promise<{
    success: boolean;
    message: string;
    stats?: {
      totalRecordings: number;
      totalViews: number;
      averageViews: number;
      recentRecordings: Recording[];
    };
  }> {
    try {
      const url = teacherId 
        ? `${this.API_BASE_URL}/stats/${teacherId}`
        : `${this.API_BASE_URL}/stats`;
        
      const response = await axios.get(url, {
        withCredentials: true,
      });

      return {
        success: true,
        message: 'Stats fetched successfully',
        stats: response.data.data,
      };
    } catch (error: any) {
      console.error('Get recording stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch stats',
      };
    }
  }
}

export default new RecordingService();
