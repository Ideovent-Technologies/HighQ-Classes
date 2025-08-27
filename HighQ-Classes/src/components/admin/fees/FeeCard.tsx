// src/modules/fees/FeeCard.tsx
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, CreditCard, Send, Percent } from "lucide-react";
import { format } from "date-fns";
import { Fee } from "@/types/fee.types";

interface FeeCardProps {
  fee: Fee;
  onProcessPayment: (fee: Fee) => void;
  onApplyDiscount: (feeId: string, discount: number, reason?: string) => void;
  onSendReminder: (feeId: string) => void;
}

const FeeCard: React.FC<FeeCardProps> = ({ fee, onProcessPayment, onApplyDiscount, onSendReminder }) => {
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discount, setDiscount] = useState("");
  const [discountReason, setDiscountReason] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800";
      case "partial": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const handleApplyDiscount = () => {
    if (discount && parseFloat(discount) > 0) {
      onApplyDiscount(fee.id, parseFloat(discount), discountReason || undefined);
      setShowDiscountForm(false);
      setDiscount("");
      setDiscountReason("");
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold">
              {fee.student?.name} - {fee.feeType}
            </CardTitle>
            <CardDescription>
              {fee.course?.name || "General Fee"}
              {fee.month && fee.year && ` | ${fee.month} ${fee.year}`}
              {fee.batch?.name && ` | Batch: ${fee.batch.name}`}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(fee.status)}>{fee.status.toUpperCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Amounts Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</p>
            <p className="text-lg font-bold text-gray-900 mt-1">₹{fee.amount?.toLocaleString() || "0"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Paid Amount</p>
            <p className="text-lg font-bold text-green-600 mt-1">₹{fee.paidAmount?.toLocaleString() || "0"}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Pending Amount</p>
            <p className="text-lg font-bold text-red-600 mt-1">₹{(fee.pendingAmount || (fee.amount || 0) - (fee.paidAmount || 0)).toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Due Date</p>
            <p className="text-lg font-bold text-gray-900 mt-1 flex items-center justify-center">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(fee.dueDate), "dd MMM yyyy")}
            </p>
          </div>
        </div>

        {/* Discount Section */}
        {(fee.discount || 0) > 0 && (
          <div className="mb-4">
            <Badge variant="secondary">Discount Applied: ₹{(fee.discount || 0).toLocaleString()}</Badge>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {fee.status !== "paid" && (
            <Button onClick={() => onProcessPayment(fee)} size="sm">
              <CreditCard className="h-4 w-4 mr-1" /> Process Payment
            </Button>
          )}

          {!showDiscountForm ? (
            <Button variant="outline" size="sm" onClick={() => setShowDiscountForm(true)}>
              <Percent className="h-4 w-4 mr-1" /> Apply Discount
            </Button>
          ) : (
            <div className="flex gap-2 items-center">
              <Input type="number" placeholder="Discount amount" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-32" />
              <Input placeholder="Reason (optional)" value={discountReason} onChange={(e) => setDiscountReason(e.target.value)} className="w-40" />
              <Button size="sm" onClick={handleApplyDiscount}>Apply</Button>
              <Button variant="outline" size="sm" onClick={() => setShowDiscountForm(false)}>Cancel</Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => onSendReminder(fee.id)}>
            <Send className="h-4 w-4 mr-1" /> Send Reminder
          </Button>
        </div>

        {/* Payment History */}
        {fee.payments?.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Payment History</h4>
            <div className="space-y-2">
              {fee.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">₹{(payment.amount || 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(payment.paymentDate), "dd MMM yyyy")} | {payment.paymentMethod}
                      {payment.receiptNumber && ` | Receipt: ${payment.receiptNumber}`}
                    </p>
                  </div>
                  <Badge variant="outline">{payment.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeeCard;
