import React from "react";
import { feeData } from "./dummyData";
import FeeCard from "./FeeCard";

const FeeStatus: React.FC = () => {
  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {feeData.map((fee, index) => (
        <FeeCard key={index} month={fee.month} status={fee.status} amount={fee.amount} />
      ))}
    </div>
  );
};

export default FeeStatus;
