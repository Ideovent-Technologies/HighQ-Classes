import React from "react";
import StudentFeeTable from "./StudentFeeTable";
import FeeStructureForm from "./FeeStructureForm";
import FeePaymentForm from "./FeePaymentForm";


const AdminFeeDashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Fee Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <FeeStructureForm />
        <FeePaymentForm />
      </div>
      <StudentFeeTable />
    </div>
  );
};

export default AdminFeeDashboard;
