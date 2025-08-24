// src/services/feeService.ts
import { FeeRecord, Payment } from "@/types/fee.types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

// Hook-based service — call useFeeService() inside React components
export const useFeeService = () => {
  const axiosPrivate = useAxiosPrivate();

  // ---------------- STUDENT SERVICES ----------------

  // Get student's own fees
  const getMyFees = async () => {
    const response = await axiosPrivate.get("/fee/my-fees");
    return response.data.data; 
    // unwrap to { fees, stats }
  };

  // Generate payment receipt
  const generateReceipt = async (paymentId: string) => {
    const response = await axiosPrivate.get(`/fee/receipt/${paymentId}`);
    return response.data.data; 
  };

  // ---------------- ADMIN SERVICES ----------------

  // Get all fees (admin) with filters + pagination
  const getAllFees = async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    student?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.student) queryParams.append("student", params.student);

    const response = await axiosPrivate.get(`/fee?${queryParams}`);
    console.log(response.data);
    return response.data.data; 
    
    // unwrap → { fees, pagination, stats }
  };

  // Get all fees for a specific student
  const getFeesByStudent = async (studentId: string) => {
    const response = await axiosPrivate.get(`/fee/student/${studentId}`);
    return response.data.data; 
  };

  // Get a specific fee record by ID
  const getFeeById = async (id: string) => {
    const response = await axiosPrivate.get(`/fee/${id}`);
    return response.data.data; 
  };

  // Create a new fee record
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
    return response.data.data; 
  };

  // Create bulk fees
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
    return response.data.data; 
  };

  // Update an existing fee record
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
    return response.data.data; 
  };

  // Delete a fee record
  const deleteFee = async (id: string): Promise<void> => {
    await axiosPrivate.delete(`/fee/${id}`);
  };

  // Process payment for a fee
  const processPayment = async (feeId: string, paymentData: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
    paymentDate?: string;
    remarks?: string;
  }) => {
    const response = await axiosPrivate.post(`/fee/${feeId}/pay`, paymentData);
    return response.data.data; 
  };

  // Apply discount to fee
  const applyDiscount = async (feeId: string, discountData: {
    discount: number;
    reason?: string;
  }) => {
    const response = await axiosPrivate.patch(`/fee/${feeId}/discount`, discountData);
    return response.data.data; 
  };

  // Send fee reminder
  const sendFeeReminder = async (feeId: string, message?: string) => {
    const response = await axiosPrivate.post(`/fee/${feeId}/remind`, { message });
    return response.data.data; 
  };

  // Get fee analytics
  const getFeeAnalytics = async () => {
    const response = await axiosPrivate.get("/fee/analytics");
    return response.data.data; 
  };

  // Get all fees for a batch
  const getFeesByBatch = async (batchId: string) => {
    const response = await axiosPrivate.get(`/fee/batch/${batchId}`);
    return response.data.data; 
  };

  // Get upcoming due fees
  const getUpcomingDueFees = async () => {
    const response = await axiosPrivate.get("/fee/upcoming");
    return response.data.data; 
  };

  // Get monthly fee report
  const getMonthlyFeeReport = async () => {
    const response = await axiosPrivate.get("/fee/monthly-report");
    return response.data.data; 
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
