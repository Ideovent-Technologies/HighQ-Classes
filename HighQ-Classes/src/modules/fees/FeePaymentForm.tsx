import React, { useState } from "react";

const FeePaymentForm: React.FC = () => {
  const [student, setStudent] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Payment recorded for ${student}, ${month}, ₹${amount}`);
    setStudent("");
    setMonth("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow space-y-3">
      <h2 className="text-xl font-semibold">Record Fee Payment</h2>
      <input
        type="text"
        placeholder="Student Name"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="text"
        placeholder="Month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded p-2"
        required
      />
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Record Payment
      </button>
    </form>
  );
};

export default FeePaymentForm;
