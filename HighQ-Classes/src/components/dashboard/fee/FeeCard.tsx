import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FeeCard = ({ fee }) => {
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {fee.student?.name ?? "Unknown Student"} - {fee.feeType ?? "No Fee Type"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>
          <strong>Course:</strong>{" "}
          {fee.course?.name ?? "Unknown Course"}
        </p>
        <p>
          <strong>Amount:</strong>{" "}
          {fee.amount != null ? `₹${fee.amount}` : "Not Specified"}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {fee.status ?? "Not Available"}
        </p>
        <p>
          <strong>Due Date:</strong>{" "}
          {fee.dueDate ? new Date(fee.dueDate).toLocaleDateString() : "Not Set"}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeeCard;
