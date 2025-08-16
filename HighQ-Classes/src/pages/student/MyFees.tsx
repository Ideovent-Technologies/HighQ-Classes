import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard,
    Calendar,
    DollarSign,
    FileText,
    Download,
    AlertCircle,
    CheckCircle,
    Clock,
    Receipt,
    History,
    User,
    GraduationCap,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
import { studentService } from "@/API/services/studentService";

interface PaymentRecord {
    _id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    remarks?: string;
    transactionId?: string;
    receiptUrl?: string;
}

interface FeeDetails {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
        batch?: {
            _id: string;
            name: string;
        };
    };
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: string;
    type: string;
    status: "paid" | "pending" | "overdue" | "partial";
    description?: string;
    payments: PaymentRecord[];
    createdAt: string;
    lastPaymentDate?: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    fees?: FeeDetails[];
    fee?: FeeDetails;
    totalPending?: number;
    totalPaid?: number;
}

const MyFees: React.FC = () => {
    const { state } = useAuth();
    const [feeDetails, setFeeDetails] = useState<FeeDetails[]>([]);
    const [summary, setSummary] = useState({
        totalPending: 0,
        totalPaid: 0,
        totalAmount: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchFeeDetails();
    }, []);

    const fetchFeeDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            if (!state.user?._id) {
                throw new Error("User ID not available");
            }

            const data = await studentService.getStudentFees(state.user._id);

            if (data.success) {
                const fees = data.fees || [];
                setFeeDetails(fees);

                // Calculate summary
                const totalPending = fees.reduce(
                    (sum: number, fee: FeeDetails) => sum + fee.pendingAmount,
                    0
                );
                const totalPaid = fees.reduce(
                    (sum: number, fee: FeeDetails) => sum + fee.paidAmount,
                    0
                );
                const totalAmount = totalPending + totalPaid;

                setSummary({ totalPending, totalPaid, totalAmount });
            } else {
                throw new Error(data.message || "Failed to fetch fee details");
            }
        } catch (err: any) {
            console.error("Fee fetch error:", err);
            setError(err.message || "Failed to load fee details");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return (
                    <Badge className="bg-green-100 text-green-800">Paid</Badge>
                );
            case "pending":
                return (
                    <Badge className="bg-yellow-100 text-yellow-800">
                        Pending
                    </Badge>
                );
            case "overdue":
                return (
                    <Badge className="bg-red-100 text-red-800">Overdue</Badge>
                );
            case "partial":
                return (
                    <Badge className="bg-blue-100 text-blue-800">Partial</Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid":
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case "overdue":
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            case "partial":
                return <CreditCard className="h-5 w-5 text-blue-500" />;
            default:
                return <FileText className="h-5 w-5 text-gray-500" />;
        }
    };

    const downloadReceipt = (receiptUrl: string) => {
        window.open(receiptUrl, "_blank");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <CreditCard className="h-8 w-8 text-blue-600" />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Fee Management
                        </h1>
                        <p className="text-gray-600">
                            View your fee details and payment history
                        </p>
                    </div>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-2">
                    <User className="h-4 w-4 mr-2" />
                    {state.user?.name}
                </Badge>
            </div>

            {/* Error Alert */}
            {error && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Fee Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Total Amount</p>
                                <p className="text-2xl font-bold">
                                    ₹{summary.totalAmount.toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Paid Amount</p>
                                <p className="text-2xl font-bold">
                                    ₹{summary.totalPaid.toLocaleString()}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100">Pending Amount</p>
                                <p className="text-2xl font-bold">
                                    ₹{summary.totalPending.toLocaleString()}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-red-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fee Details */}
            <div className="space-y-6">
                {feeDetails.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No Fee Records Found
                            </h3>
                            <p className="text-gray-600">
                                No fee records have been created for your
                                account yet.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    feeDetails.map((fee) => (
                        <Card
                            key={fee._id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        {getStatusIcon(fee.status)}
                                        <div>
                                            <CardTitle className="text-xl">
                                                {fee.type
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    fee.type.slice(1)}{" "}
                                                Fee
                                            </CardTitle>
                                            <p className="text-gray-600 text-sm">
                                                Created:{" "}
                                                {format(
                                                    new Date(fee.createdAt),
                                                    "MMM dd, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(fee.status)}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Fee Description */}
                                {fee.description && (
                                    <p className="text-gray-700">
                                        {fee.description}
                                    </p>
                                )}

                                {/* Fee Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Total Amount
                                        </h4>
                                        <p className="text-2xl font-bold text-blue-600">
                                            ₹{fee.totalAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Paid Amount
                                        </h4>
                                        <p className="text-2xl font-bold text-green-600">
                                            ₹{fee.paidAmount.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-900 mb-1">
                                            Pending Amount
                                        </h4>
                                        <p className="text-2xl font-bold text-red-600">
                                            ₹
                                            {fee.pendingAmount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="flex items-center space-x-2 text-sm">
                                    <Calendar className="h-4 w-4 text-orange-500" />
                                    <span className="font-medium">
                                        Due Date:
                                    </span>
                                    <span
                                        className={`font-semibold ${
                                            new Date(fee.dueDate) < new Date()
                                                ? "text-red-600"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {format(
                                            new Date(fee.dueDate),
                                            "MMMM dd, yyyy"
                                        )}
                                    </span>
                                </div>

                                {/* Payment History */}
                                {fee.payments && fee.payments.length > 0 && (
                                    <>
                                        <Separator />
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                                                <History className="h-4 w-4 mr-2" />
                                                Payment History
                                            </h4>
                                            <div className="space-y-3">
                                                {fee.payments.map(
                                                    (payment, index) => (
                                                        <div
                                                            key={
                                                                payment._id ||
                                                                index
                                                            }
                                                            className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <Receipt className="h-4 w-4 text-green-600" />
                                                                <div>
                                                                    <p className="font-semibold text-green-800">
                                                                        ₹
                                                                        {payment.amount.toLocaleString()}
                                                                    </p>
                                                                    <p className="text-sm text-green-600">
                                                                        {format(
                                                                            new Date(
                                                                                payment.paymentDate
                                                                            ),
                                                                            "MMM dd, yyyy"
                                                                        )}
                                                                        {payment.paymentMethod &&
                                                                            ` • ${payment.paymentMethod}`}
                                                                    </p>
                                                                    {payment.remarks && (
                                                                        <p className="text-xs text-green-600 mt-1">
                                                                            {
                                                                                payment.remarks
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                {payment.transactionId && (
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            payment.transactionId
                                                                        }
                                                                    </Badge>
                                                                )}
                                                                {payment.receiptUrl && (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() =>
                                                                            downloadReceipt(
                                                                                payment.receiptUrl!
                                                                            )
                                                                        }
                                                                    >
                                                                        <Download className="h-3 w-3 mr-1" />
                                                                        Receipt
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Contact Info for Payment */}
                                {fee.pendingAmount > 0 && (
                                    <>
                                        <Separator />
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-blue-900 mb-2">
                                                Payment Information
                                            </h4>
                                            <p className="text-sm text-blue-800 mb-3">
                                                For fee payment assistance,
                                                please contact the
                                                administration office or your
                                                batch coordinator.
                                            </p>
                                            <div className="flex items-center space-x-2 text-sm text-blue-700">
                                                <GraduationCap className="h-4 w-4" />
                                                <span>
                                                    Batch:{" "}
                                                    {fee.student.batch?.name ||
                                                        "Not assigned"}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyFees;
