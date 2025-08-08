import axios from 'axios';
import { 
  Assignment, 
  AssignmentFormData, 
  AssignmentSubmission, 
  SubmissionFormData,
  GradingData,
  AssignmentSummary,
  StudentAssignmentSummary,
  AssignmentStats,
  AssignmentFilters,
  SubmissionFilters,
  BulkGradingData,
  AssignmentDashboardData,
  StudentAssignmentDashboard
} from '@/types/assignment.types';

const API_BASE_URL = '/api/assignments';

class AssignmentService {
  // Assignment CRUD operations
  async createAssignment(assignmentData: AssignmentFormData): Promise<{
    success: boolean;
    message: string;
    data?: Assignment;
  }> {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.entries(assignmentData).forEach(([key, value]) => {
        if (key !== 'attachments' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Append files
      if (assignmentData.attachments) {
        assignmentData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await axios.post(API_BASE_URL, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        message: 'Assignment created successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Create assignment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create assignment'
      };
    }
  }

  async getAssignments(filters: AssignmentFilters & {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: {
      assignments: Assignment[];
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

      const response = await axios.get(`${API_BASE_URL}?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Assignments retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get assignments error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignments'
      };
    }
  }

  async getAssignmentById(assignmentId: string): Promise<{
    success: boolean;
    message: string;
    data?: Assignment;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${assignmentId}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Assignment retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get assignment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignment'
      };
    }
  }

  async updateAssignment(assignmentId: string, updateData: Partial<AssignmentFormData>): Promise<{
    success: boolean;
    message: string;
    data?: Assignment;
  }> {
    try {
      const formData = new FormData();
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (key !== 'attachments' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      if (updateData.attachments) {
        updateData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await axios.put(`${API_BASE_URL}/${assignmentId}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        message: 'Assignment updated successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Update assignment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update assignment'
      };
    }
  }

  async deleteAssignment(assignmentId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await axios.delete(`${API_BASE_URL}/${assignmentId}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Assignment deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete assignment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete assignment'
      };
    }
  }

  // Submission operations
  async submitAssignment(assignmentId: string, submissionData: SubmissionFormData): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentSubmission;
  }> {
    try {
      const formData = new FormData();
      
      if (submissionData.submissionText) {
        formData.append('submissionText', submissionData.submissionText);
      }

      if (submissionData.attachments) {
        submissionData.attachments.forEach((file) => {
          formData.append('attachments', file);
        });
      }

      const response = await axios.post(`${API_BASE_URL}/${assignmentId}/submit`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return {
        success: true,
        message: 'Assignment submitted successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Submit assignment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit assignment'
      };
    }
  }

  async getSubmissions(filters: SubmissionFilters & {
    page?: number;
    limit?: number;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: {
      submissions: AssignmentSubmission[];
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

      const response = await axios.get(`${API_BASE_URL}/submissions?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Submissions retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get submissions error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch submissions'
      };
    }
  }

  async gradeSubmission(submissionId: string, gradingData: GradingData): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentSubmission;
  }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/submissions/${submissionId}/grade`, gradingData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Submission graded successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Grade submission error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to grade submission'
      };
    }
  }

  async bulkGrade(gradingData: BulkGradingData): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentSubmission[];
  }> {
    try {
      const response = await axios.put(`${API_BASE_URL}/submissions/bulk-grade`, gradingData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        message: 'Submissions graded successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Bulk grade error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to grade submissions'
      };
    }
  }

  // Statistics and summaries
  async getAssignmentSummary(assignmentId: string): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentSummary;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${assignmentId}/summary`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Assignment summary retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get assignment summary error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignment summary'
      };
    }
  }

  async getStudentSummary(filters: {
    batchId?: string;
    courseId?: string;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: StudentAssignmentSummary[];
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_BASE_URL}/student-summary?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Student summary retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get student summary error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch student summary'
      };
    }
  }

  async getAssignmentStats(filters: {
    courseId?: string;
    batchId?: string;
    teacherId?: string;
  } = {}): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentStats;
  }> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get(`${API_BASE_URL}/stats?${params.toString()}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Assignment statistics retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get assignment stats error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch assignment statistics'
      };
    }
  }

  // Dashboard data
  async getTeacherDashboard(): Promise<{
    success: boolean;
    message: string;
    data?: AssignmentDashboardData;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/teacher`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Teacher dashboard data retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get teacher dashboard error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard data'
      };
    }
  }

  async getStudentDashboard(): Promise<{
    success: boolean;
    message: string;
    data?: StudentAssignmentDashboard;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/dashboard/student`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Student dashboard data retrieved successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Get student dashboard error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch dashboard data'
      };
    }
  }

  // File operations
  async downloadAttachment(attachmentId: string): Promise<{
    success: boolean;
    message: string;
    data?: Blob;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/attachments/${attachmentId}/download`, {
        withCredentials: true,
        responseType: 'blob'
      });

      return {
        success: true,
        message: 'File downloaded successfully',
        data: response.data
      };
    } catch (error: any) {
      console.error('Download attachment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to download file'
      };
    }
  }

  async deleteAttachment(attachmentId: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      await axios.delete(`${API_BASE_URL}/attachments/${attachmentId}`, {
        withCredentials: true
      });

      return {
        success: true,
        message: 'Attachment deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete attachment error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete attachment'
      };
    }
  }
}

export default new AssignmentService();
