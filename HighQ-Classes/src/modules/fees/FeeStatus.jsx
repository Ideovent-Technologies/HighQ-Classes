// src/modules/fees/FeeStatus.jsx

import React from "react";
import { feeData } from "./dummyData";
import FeeCard from "./FeeCard";

export default function FeeStatus() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {feeData.map((fee) => (
        <FeeCard
          key={fee.month}
          month={fee.month}
          status={fee.status}
          amount={fee.amount}
        />
      ))}
    </div>
  );
}

