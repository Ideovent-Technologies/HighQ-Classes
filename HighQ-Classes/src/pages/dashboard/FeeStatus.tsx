
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Download } from "lucide-react";

const FeeStatus = () => {
  const { user } = useAuth();
  const studentData = user as any; // Cast to access student-specific fields
  
  const feeStatus = studentData?.feeStatus || {
    totalFee: 0,
    paidAmount: 0,
    pendingAmount: 0,
    lastPaymentDate: '',
  };
  
  // Helper to calculate percentage
  const calculateFeePercentage = () => {
    if (!feeStatus || feeStatus.totalFee === 0) return 0;
    return Math.round((feeStatus.paidAmount / feeStatus.totalFee) * 100);
  };
  
  // Sample payment history
  const paymentHistory = [
    {
      date: '2023-06-10',
      amount: 4000,
      mode: 'Online Transfer',
      receipt: 'RCPT-2023-06-001',
    },
    {
      date: '2023-04-15',
      amount: 4000,
      mode: 'Credit Card',
      receipt: 'RCPT-2023-04-002',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Fee Status</h1>
        <p className="text-gray-600">View your fee payment status and history</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Fee Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Fee</span>
                  <span className="font-semibold">₹{feeStatus.totalFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid Amount</span>
                  <span className="font-semibold text-green-600">₹{feeStatus.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending Amount</span>
                  <span className="font-semibold text-red-600">₹{feeStatus.pendingAmount.toLocaleString()}</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Payment Progress</p>
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-100">
                          {calculateFeePercentage()}% Paid
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                      <div
                        style={{ width: `${calculateFeePercentage()}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                          calculateFeePercentage() === 100
                            ? 'bg-green-500'
                            : calculateFeePercentage() > 50
                            ? 'bg-teal-500'
                            : 'bg-coral-500'
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">First Installment</p>
                    <p className="text-sm text-gray-600">Due: April 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹4,000</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Second Installment</p>
                    <p className="text-sm text-gray-600">Due: June 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹4,000</p>
                    <p className="text-xs text-green-600">Paid</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Third Installment</p>
                    <p className="text-sm text-gray-600">Due: August 15, 2023</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹4,000</p>
                    <p className="text-xs text-red-600">Pending</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button>Pay Now</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Amount</th>
                    <th className="pb-2 font-medium">Payment Mode</th>
                    <th className="pb-2 font-medium">Receipt No.</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((payment, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="py-4">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4">₹{payment.amount.toLocaleString()}</td>
                      <td className="py-4">{payment.mode}</td>
                      <td className="py-4">{payment.receipt}</td>
                      <td className="py-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Receipt
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default FeeStatus;
