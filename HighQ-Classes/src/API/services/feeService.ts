// src/services/feeService.ts
import { FeeRecord, Payment } from "@/types/fee.types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

//  Hook-based service — you call `useFeeService()` inside React components
export const useFeeService = () => {
  const axiosPrivate = useAxiosPrivate();

  // Get all fees (admin)
  const getAllFees = async (): Promise<FeeRecord[]> => {
    const response = await axiosPrivate.get("/fees");
    return response.data;
  };

  // Get all fees for a specific student
  const getFeesByStudent = async (studentId: string): Promise<FeeRecord[]> => {
    const response = await axiosPrivate.get(`/fees/student/${studentId}`);
    return response.data;
  };

  // Get a specific fee record by ID
  const getFeeById = async (id: string): Promise<FeeRecord> => {
    const response = await axiosPrivate.get(`/fees/${id}`);
    return response.data;
  };

  // Create a new fee record (admin)
  const createFee = async (fee: Partial<FeeRecord>): Promise<FeeRecord> => {
    const response = await axiosPrivate.post("/fees", fee);
    return response.data;
  };

  // Update an existing fee record (admin)
  const updateFee = async (id: string, fee: Partial<FeeRecord>): Promise<FeeRecord> => {
    const response = await axiosPrivate.put(`/fees/${id}`, fee);
    return response.data;
  };

  // Delete a fee record (admin)
  const deleteFee = async (id: string): Promise<void> => {
    await axiosPrivate.delete(`/fees/${id}`);
  };

  // Record a payment for a student (admin)
  const recordPayment = async (
    feeId: string,
    payment: Omit<Payment, "id">
  ): Promise<boolean> => {
    try {
      await axiosPrivate.post(`/fees/${feeId}/pay`, payment);
      return true;
    } catch (error) {
      console.error("Payment submission failed:", error);
      return false;
    }
  };

  // Get all fees for a batch (admin)
  const getFeesByBatch = async (batchId: string): Promise<FeeRecord[]> => {
    const response = await axiosPrivate.get(`/fees/batch/${batchId}`);
    return response.data;
  };

  // Get upcoming due fees (admin)
  const getUpcomingDueFees = async (): Promise<FeeRecord[]> => {
    const response = await axiosPrivate.get("/fees/upcoming");
    return response.data;
  };

  // Get monthly fee report (admin)
  const getMonthlyFeeReport = async (): Promise<any> => {
    const response = await axiosPrivate.get("/fees/monthly-report");
    return response.data;
  };

  return {
    getAllFees,
    getFeesByStudent,
    getFeeById,
    createFee,
    updateFee,
    deleteFee,
    recordPayment,
    getFeesByBatch,
    getUpcomingDueFees,
    getMonthlyFeeReport,
  };
};
