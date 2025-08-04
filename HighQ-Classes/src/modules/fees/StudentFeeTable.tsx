import React from "react";
import { FeeRecord } from "@/types/fee.types"
import { studentFees } from "./dummyAdminFeeData";

interface Props {
  records: FeeRecord[];
}

const StudentFeeTable: React.FC<Props> = ({ records }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded-xl shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Batch</th>
            <th className="py-2 px-4 border-b">Month</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Amount</th>
          </tr>
        </thead>
        <tbody>
          {studentFees.map((fee, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{fee.name}</td>
              <td className="py-2 px-4 border-b">{fee.batch}</td>
              <td className="py-2 px-4 border-b">{fee.month}</td>
              <td className={`py-2 px-4 border-b ${fee.status === "Paid" ? "text-green-600" : "text-red-600"}`}>
                {fee.status}
              </td>
              <td className="py-2 px-4 border-b">₹{fee.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentFeeTable;
