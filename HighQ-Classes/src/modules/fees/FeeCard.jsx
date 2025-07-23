
// src/modules/fees/FeeCard.jsx

import React from "react";

export default function FeeCard({ month, status, amount }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <h3 className="text-lg font-semibold">{month}</h3>
      <p>Status: <span className={status === "Paid" ? "text-green-600" : "text-red-600"}>{status}</span></p>
      <p>Amount: ₹{amount}</p>
    </div>
  );
}
