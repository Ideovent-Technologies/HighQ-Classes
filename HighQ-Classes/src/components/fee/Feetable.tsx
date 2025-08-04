import { FeeRecord } from "@/types/fee.types";

export function FeeTable({ records }: { records: FeeRecord[] }) {
  return (
    <table className="w-full border mt-4">
      <thead>
        <tr className="bg-gray-100">
          <th>Name</th>
          <th>Total</th>
          <th>Paid</th>
          <th>Due</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => (
          <tr key={r.studentId}>
            <td>{r.studentName}</td>
            <td>₹{r.totalFees}</td>
            <td>₹{r.paid}</td>
            <td>₹{r.due}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
