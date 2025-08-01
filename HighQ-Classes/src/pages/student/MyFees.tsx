"use client";

import { useEffect, useState } from "react";
import { useFeeService } from "@/API/services/feeService";
import { FeeRecord } from "@/types/fee.types";
import { PaymentHistory } from "@/components/fee/PaymentHistory";

export default function MyFees() {
  const [fee, setFee] = useState<FeeRecord | null>(null);

  useEffect(() => {
    const { getAllFees } = useFeeService();

  getAllFees().then((res) => {
      setFee(res[0]); // Simulate logged-in student
    });
  }, []);

  if (!fee) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">My Fee Details</h2>
      <p>Total: ₹{fee.totalFees}</p>
      <p>Paid: ₹{fee.paid}</p>
      <p>Due: ₹{fee.due}</p>

      <h3 className="mt-4 font-semibold">Payment History</h3>
      <PaymentHistory payments={fee.payments} />
    </div>
  );
}
