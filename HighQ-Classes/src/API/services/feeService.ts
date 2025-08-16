// src/services/feeService.ts
import { FeeRecord, Payment } from "@/types/fee.types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

//  Hook-based service — you call `useFeeService()` inside React components
export const useFeeService = () => {
  const axiosPrivate = useAxiosPrivate();

  // Student Services
  // Get student's own fees
  const getMyFees = async () => {
    const response = await axiosPrivate.get("/fee/my-fees");
    return response.data;
  };

  // Generate payment receipt
  const generateReceipt = async (paymentId: string) => {
    const response = await axiosPrivate.get(`/fee/receipt/${paymentId}`);
    return response.data;
  };

  // Admin Services
  // Get all fees (admin)
  const getAllFees = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    student?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.student) queryParams.append('student', params.student);
    
    const response = await axiosPrivate.get(`/fee?${queryParams}`);
    return response.data;
  };

  // Get all fees for a specific student
  const getFeesByStudent = async (studentId: string) => {
    const response = await axiosPrivate.get(`/fee/student/${studentId}`);
    return response.data;
  };

  // Get a specific fee record by ID
  const getFeeById = async (id: string) => {
    const response = await axiosPrivate.get(`/fee/${id}`);
    return response.data;
  };

  // Create a new fee record (admin)
  const createFee = async (feeData: {
    studentId: string;
    courseId?: string;
    batchId?: string;
    amount: number;
    dueDate: string;
    feeType: string;
    month?: string;
    year?: number;
    description?: string;
  }) => {
    const response = await axiosPrivate.post("/fee", feeData);
    return response.data;
  };

  // Create bulk fees (admin)
  const createBulkFees = async (bulkFeeData: {
    studentIds: string[];
    courseId?: string;
    batchId?: string;
    amount: number;
    dueDate: string;
    feeType: string;
    month?: string;
    year?: number;
    description?: string;
  }) => {
    const response = await axiosPrivate.post("/fee/bulk", bulkFeeData);
    return response.data;
  };

  // Update an existing fee record (admin)
  const updateFee = async (id: string, updateData: {
    amount?: number;
    dueDate?: string;
    feeType?: string;
    month?: string;
    year?: number;
    description?: string;
    discount?: number;
  }) => {
    const response = await axiosPrivate.put(`/fee/${id}`, updateData);
    return response.data;
  };

  // Delete a fee record (admin)
  const deleteFee = async (id: string): Promise<void> => {
    await axiosPrivate.delete(`/fee/${id}`);
  };

  // Process payment for a fee (admin)
  const processPayment = async (feeId: string, paymentData: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    paymentDate?: string;
    remarks?: string;
  }) => {
    const response = await axiosPrivate.post(`/fee/${feeId}/pay`, paymentData);
    return response.data;
  };

  // Apply discount to fee (admin)
  const applyDiscount = async (feeId: string, discountData: {
    discount: number;
    reason?: string;
  }) => {
    const response = await axiosPrivate.patch(`/fee/${feeId}/discount`, discountData);
    return response.data;
  };

  // Send fee reminder (admin)
  const sendFeeReminder = async (feeId: string, message?: string) => {
    const response = await axiosPrivate.post(`/fee/${feeId}/remind`, { message });
    return response.data;
  };

  // Get fee analytics (admin)
  const getFeeAnalytics = async () => {
    const response = await axiosPrivate.get("/fee/analytics");
    return response.data;
  };

  // Get all fees for a batch (admin)
  const getFeesByBatch = async (batchId: string) => {
    const response = await axiosPrivate.get(`/fee/batch/${batchId}`);
    return response.data;
  };

  // Get upcoming due fees (admin)
  const getUpcomingDueFees = async () => {
    const response = await axiosPrivate.get("/fee/upcoming");
    return response.data;
  };

  // Get monthly fee report (admin)
  const getMonthlyFeeReport = async () => {
    const response = await axiosPrivate.get("/fee/monthly-report");
    return response.data;
  };

  return {
    // Student services
    getMyFees,
    generateReceipt,
    
    // Admin services
    getAllFees,
    getFeesByStudent,
    getFeeById,
    createFee,
    createBulkFees,
    updateFee,
    deleteFee,
    processPayment,
    applyDiscount,
    sendFeeReminder,
    getFeeAnalytics,
    getFeesByBatch,
    getUpcomingDueFees,
    getMonthlyFeeReport,
  };
};
