import { useState } from 'react';
import contactService, { ContactMessage, StudentTeacherMessage, ContactResponse } from '@/API/services/contactService';

export const useContact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendContactMessage = async (contactData: ContactMessage): Promise<ContactResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactService.sendContactMessage(contactData);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendStudentTeacherMessage = async (messageData: StudentTeacherMessage): Promise<ContactResponse> => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactService.sendStudentTeacherMessage(messageData);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loading,
    error,
    sendContactMessage,
    sendStudentTeacherMessage,
    clearError
  };
};

// For admin functionality
export const useContactAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getContactMessages = async (page = 1, limit = 10, status = 'all') => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactService.getContactMessages(page, limit, status);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudentTeacherMessages = async (page = 1, limit = 10, status = 'all', role = 'all') => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactService.getStudentTeacherMessages(page, limit, status, role);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, status: string, adminReply?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await contactService.updateMessageStatus(messageId, status, adminReply);
      return response;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getContactMessages,
    getStudentTeacherMessages,
    updateMessageStatus
  };
};
