// src/modules/fees/AdminFeeDashboard.jsx

import React from "react";
import StudentFeeTable from "./StudentFeeTable";
import FeeStructureForm from "./FeeStructureForm";
import FeePaymentForm from "./FeePaymentForm";

export default function AdminFeeDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Admin Fee Dashboard</h2>

      {/* Stats placeholder */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-100 p-4 rounded">Total Collected: ₹6000</div>
        <div className="bg-red-100 p-4 rounded">Total Pending: ₹3000</div>
        {/* Add more stats or graphs if needed */}
      </div>

      <StudentFeeTable />
      <FeeStructureForm />
      <FeePaymentForm />
    </div>
  );
}
