import React, { useState } from "react";
import { Payment } from "@/types/fee.types";
import { useFeeService } from "@/API/services/feeService";
const { getAllFees, recordPayment } = useFeeService();

interface FeePaymentFormProps {
  studentId: string;
  studentName: string;
  onPaymentSuccess?: () => void;
}

const FeePaymentForm: React.FC<FeePaymentFormProps> = ({
  studentId,
  studentName,
  onPaymentSuccess,
}) => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<Payment["method"]>("Cash");
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await recordPayment(studentId, {
      amount: Number(amount),
      method,
      date: new Date().toISOString().split("T")[0],
      note: note || `Month: ${month}`,
    });

    alert(`Payment recorded for ${studentName}, ${month}, ₹${amount}`);
    setMonth("");
    setAmount("");
    setMethod("Cash");
    setNote("");
    onPaymentSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="text-xl font-semibold">Record Fee Payment</h2>

      <div>
        <label className="block text-sm mb-1">Student</label>
        <input
          type="text"
          value={studentName}
          disabled
          className="w-full border rounded p-2 bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Month</label>
        <input
          type="text"
          placeholder="e.g. July 2025"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Amount (₹)</label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Payment Method</label>
        <select
          className="w-full border rounded p-2"
          value={method}
          onChange={(e) => setMethod(e.target.value as Payment["method"])}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      <div>
        <label className="block text-sm mb-1">Note (optional)</label>
        <input
          type="text"
          placeholder="e.g. Paid in full"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Record Payment
      </button>
    </form>
  );
};

export default FeePaymentForm;
