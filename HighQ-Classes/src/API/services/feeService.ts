// src/services/feeService.ts
import { FeeRecord, Payment } from "@/types/fee.types";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

// ✅ Hook-based service — you call `useFeeService()` inside React components
export const useFeeService = () => {
  const axiosPrivate = useAxiosPrivate();

  const getAllFees = async (): Promise<FeeRecord[]> => {
    try {
      const response = await axiosPrivate.get("/fees");
      return response.data;
    } catch (error) {
      console.warn("Falling back to mock fee data due to error:", error);

      // Fallback mock data
      return [
        {
          studentId: "S001",
          studentName: "Ankit Sharma",
          totalFees: 50000,
          paid: 30000,
          due: 20000,
          payments: [
            { id: "P1", amount: 15000, date: "2024-06-01", method: "UPI" },
            { id: "P2", amount: 15000, date: "2024-07-01", method: "Cash" },
          ],
        },
      ];
    }
  };

  const recordPayment = async (
    studentId: string,
    payment: Omit<Payment, "id">
  ): Promise<boolean> => {
    try {
      await axiosPrivate.post(`/fees/${studentId}/pay`, payment);
      return true;
    } catch (error) {
      console.error("Payment submission failed:", error);
      return false;
    }
  };

  return {
    getAllFees,
    recordPayment,
  };
};
