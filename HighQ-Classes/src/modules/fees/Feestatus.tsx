import React from "react";

type FeeStatusProps = {
  status: "paid" | "pending" | "overdue" | string;
};

const FeeStatus: React.FC<FeeStatusProps> = ({ status }) => {
  let statusColor: string;

  switch (status.toLowerCase()) {
    case "paid":
      statusColor = "green";
      break;
    case "pending":
      statusColor = "orange";
      break;
    case "overdue":
      statusColor = "red";
      break;
    default:
      statusColor = "gray";
  }
}