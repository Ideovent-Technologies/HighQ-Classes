import React from "react";

interface FeeCardProps {
  month: string;
  status: string;
  amount: number;
}

const FeeCard: React.FC<FeeCardProps> = ({ month, status, amount }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border">
      <h3 className="text-lg font-semibold">{month}</h3>
      <p className={`text-sm font-medium ${status === "Paid" ? "text-green-600" : "text-red-600"}`}>
        {status}
      </p>
      <p className="text-gray-700">₹{amount}</p>
    </div>
  );
};

export default FeeCard;
