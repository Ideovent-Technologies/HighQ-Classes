// src/API/services/assignmentService.ts
import api from "../Axios";

export interface AssignmentFormData {
  title: string;
  description?: string;
  courseId: string;
  batchId?: string;
  dueDate: string;
  totalMarks: number;
  attachments?: File[];
  instructions?: string;
  assignmentType?: string;
  isPublished?: boolean;
  allowLateSubmission?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const AssignmentService = {
  createAssignment: async (formData: AssignmentFormData): Promise<ApiResponse<any>> => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.description) data.append("description", formData.description);
      data.append("courseId", formData.courseId);
      if (formData.batchId) data.append("batchId", formData.batchId);
      data.append("dueDate", formData.dueDate);
      data.append("totalMarks", String(formData.totalMarks));
      if (formData.instructions) data.append("instructions", formData.instructions);
      if (formData.assignmentType) data.append("assignmentType", formData.assignmentType);
      if (formData.isPublished !== undefined) data.append("isPublished", String(formData.isPublished));
      if (formData.allowLateSubmission !== undefined) data.append("allowLateSubmission", String(formData.allowLateSubmission));
      if (formData.attachments?.length) {
        formData.attachments.forEach((file) => data.append("attachments", file));
      }

      const res = await api.post("/assignments", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: res.data.assignment, message: "Assignment created successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error creating assignment" };
    }
  },

  getAssignments: async (): Promise<ApiResponse<any>> => {
    try {
      const res = await api.get("/assignments");
      return { success: true, data: res.data.assignments };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error fetching assignments" };
    }
  },

  deleteAssignment: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const res = await api.delete(`/assignments/${id}`);
      return { success: true, message: res.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error deleting assignment" };
    }
  },

  updateAssignment: async (id: string, formData: AssignmentFormData): Promise<ApiResponse<any>> => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      if (formData.description) data.append("description", formData.description);
      if (formData.courseId) data.append("courseId", formData.courseId);
      if (formData.batchId) data.append("batchId", formData.batchId);
      data.append("dueDate", formData.dueDate);
      data.append("totalMarks", String(formData.totalMarks));
      if (formData.instructions) data.append("instructions", formData.instructions);
      if (formData.assignmentType) data.append("assignmentType", formData.assignmentType);
      if (formData.isPublished !== undefined) data.append("isPublished", String(formData.isPublished));
      if (formData.allowLateSubmission !== undefined) data.append("allowLateSubmission", String(formData.allowLateSubmission));
      if (formData.attachments?.length) {
        formData.attachments.forEach((file) => data.append("attachments", file));
      }

      const res = await api.put(`/assignments/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, data: res.data.assignment, message: "Assignment updated successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error updating assignment" };
    }
  },

  getSubmissions: async (assignmentId: string): Promise<ApiResponse<any>> => {
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions`);
      return { success: true, data: res.data.submissions };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error fetching submissions" };
    }
  },

  gradeSubmission: async (
    assignmentId: string,
    submissionId: string,
    marks: number,
    feedback?: string
  ): Promise<ApiResponse<any>> => {
    try {
      const res = await api.put(`/assignments/${assignmentId}/grade/${submissionId}`, { marks, feedback });
      return { success: true, data: res.data.submission, message: "Submission graded successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Error grading submission" };
    }
  },
};

export default AssignmentService;
