import api from '../Axios';

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

export interface StudentTeacherMessage {
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  messageId?: string;
}

class ContactService {
  // Send contact message
  async sendContactMessage(contactData: ContactMessage): Promise<ContactResponse> {
    try {
      const response = await api.post('/contact', contactData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  // Send student/teacher message to admin
  async sendStudentTeacherMessage(messageData: StudentTeacherMessage): Promise<ContactResponse> {
    try {
      const response = await api.post('/contact/student-teacher', messageData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  }

  // Get contact messages (Admin only)
  async getContactMessages(page: number = 1, limit: number = 10, status: string = 'all') {
    try {
      const response = await api.get('/contact/messages', {
        params: { page, limit, status }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  }

  // Get student/teacher messages (Admin only)
  async getStudentTeacherMessages(page: number = 1, limit: number = 10, status: string = 'all', role: string = 'all') {
    try {
      const response = await api.get('/contact/student-teacher-messages', {
        params: { page, limit, status, role }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
  }

  // Update message status (Admin only)
  async updateMessageStatus(messageId: string, status: string, adminReply?: string) {
    try {
      const response = await api.patch(`/contact/messages/${messageId}`, {
        status,
        adminReply
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update message');
    }
  }
}

export default new ContactService();
