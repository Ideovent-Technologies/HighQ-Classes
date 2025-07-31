import { Payment } from "@/types/fee.types";

export function PaymentHistory({ payments }: { payments: Payment[] }) {
  return (
    <ul className="mt-2 space-y-1">
      {payments.map((p) => (
        <li key={p.id} className="text-sm">
          ₹{p.amount} on {p.date} via {p.method}
        </li>
      ))}
    </ul>
  );
}
