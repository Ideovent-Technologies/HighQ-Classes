import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    CalendarDays,
    Download,
    Eye,
    AlertCircle,
    CheckCircle,
    Clock,
    DollarSign,
} from "lucide-react";
import { useFeeService } from "@/API/services/feeService";
import { Fee, FeeSummary, Payment, ReceiptData } from "@/types/fee.types";
import { format } from "date-fns";
import { toast } from "sonner";

const StudentFeeDashboard: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [summary, setSummary] = useState<FeeSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [showReceiptModal, setShowReceiptModal] = useState(false);

    const feeService = useFeeService();

    useEffect(() => {
        fetchMyFees();
    }, []);

    const fetchMyFees = async () => {
        try {
            setLoading(true);
            const response = await feeService.getMyFees();
            setFees(response.data.fees);
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error fetching fees:", error);
            toast.error("Failed to load fee information");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReceipt = async (paymentId: string) => {
        try {
            const response = await feeService.generateReceipt(paymentId);
            setReceiptData(response.data);
            setShowReceiptModal(true);
        } catch (error) {
            console.error("Error generating receipt:", error);
            toast.error("Failed to generate receipt");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-yellow-100 text-yellow-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "paid":
                return <CheckCircle className="h-4 w-4" />;
            case "partial":
                return <Clock className="h-4 w-4" />;
            case "overdue":
                return <AlertCircle className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Fee Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Track your fee payments and manage your financial
                        records
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Fee Summary Cards */}
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Fees
                                    </CardTitle>
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ₹
                                        {(
                                            summary.totalAmount || 0
                                        ).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Total amount due
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Paid Amount
                                    </CardTitle>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹
                                        {(
                                            summary.paidAmount || 0
                                        ).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Successfully paid
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Pending Amount
                                    </CardTitle>
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        ₹
                                        {(
                                            summary.pendingAmount || 0
                                        ).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Remaining balance
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Overdue Amount
                                    </CardTitle>
                                    <AlertCircle className="h-5 w-5 text-red-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-red-600">
                                        ₹
                                        {(
                                            summary.overdueAmount || 0
                                        ).toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Past due date
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Fee Details */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Fee Details
                            </CardTitle>
                            <CardDescription>
                                View and manage your fee records
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="all" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="all">
                                        All Fees
                                    </TabsTrigger>
                                    <TabsTrigger value="pending">
                                        Pending
                                    </TabsTrigger>
                                    <TabsTrigger value="paid">Paid</TabsTrigger>
                                    <TabsTrigger value="overdue">
                                        Overdue
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="all" className="space-y-4">
                                    <FeeList
                                        fees={fees}
                                        onGenerateReceipt={
                                            handleGenerateReceipt
                                        }
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="pending"
                                    className="space-y-4"
                                >
                                    <FeeList
                                        fees={fees.filter(
                                            (fee) => fee.status === "pending"
                                        )}
                                        onGenerateReceipt={
                                            handleGenerateReceipt
                                        }
                                    />
                                </TabsContent>

                                <TabsContent value="paid" className="space-y-4">
                                    <FeeList
                                        fees={fees.filter(
                                            (fee) => fee.status === "paid"
                                        )}
                                        onGenerateReceipt={
                                            handleGenerateReceipt
                                        }
                                    />
                                </TabsContent>

                                <TabsContent
                                    value="overdue"
                                    className="space-y-4"
                                >
                                    <FeeList
                                        fees={fees.filter(
                                            (fee) => fee.status === "overdue"
                                        )}
                                        onGenerateReceipt={
                                            handleGenerateReceipt
                                        }
                                    />
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* Receipt Modal */}
                {showReceiptModal && receiptData && (
                    <ReceiptModal
                        receiptData={receiptData}
                        onClose={() => setShowReceiptModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

const FeeList: React.FC<{
    fees: Fee[];
    onGenerateReceipt: (paymentId: string) => void;
}> = ({ fees, onGenerateReceipt }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "paid":
                return "bg-green-100 text-green-800";
            case "partial":
                return "bg-yellow-100 text-yellow-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            default:
                return "bg-blue-100 text-blue-800";
        }
    };

    if (fees.length === 0) {
        return (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">
                        No fees found for this category.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {fees.map((fee) => (
                <Card
                    key={fee.id}
                    className="hover:shadow-md transition-shadow duration-200"
                >
                    <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <CardTitle className="text-lg font-semibold text-gray-900">
                                    {fee.course?.name || "General Fee"} -{" "}
                                    {fee.feeType}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {fee.description}
                                    {fee.month && fee.year && (
                                        <span className="ml-2 text-blue-600">
                                            • {fee.month} {fee.year}
                                        </span>
                                    )}
                                    {fee.batch?.name && (
                                        <span className="ml-2 text-purple-600">
                                            • Batch: {fee.batch.name}
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                            <Badge className={getStatusColor(fee.status)}>
                                {fee.status.toUpperCase()}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Total Amount
                                </p>
                                <p className="text-lg font-bold text-gray-900 mt-1">
                                    ₹{(fee.amount || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Paid Amount
                                </p>
                                <p className="text-lg font-bold text-green-600 mt-1">
                                    ₹{(fee.paidAmount || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Pending Amount
                                </p>
                                <p className="text-lg font-bold text-red-600 mt-1">
                                    ₹
                                    {(fee.pendingAmount !== null &&
                                    fee.pendingAmount !== undefined
                                        ? fee.pendingAmount
                                        : (fee.amount || 0) -
                                          (fee.paidAmount || 0)
                                    ).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Due Date
                                </p>
                                <p className="text-lg font-bold text-gray-900 mt-1 flex items-center justify-center">
                                    <CalendarDays className="h-4 w-4 mr-1" />
                                    {format(
                                        new Date(fee.dueDate),
                                        "dd MMM yyyy"
                                    )}
                                </p>
                            </div>
                        </div>

                        {(fee.discount || 0) > 0 && (
                            <div className="mb-4">
                                <Badge variant="secondary">
                                    Discount Applied: ₹
                                    {(fee.discount || 0).toLocaleString()}
                                </Badge>
                            </div>
                        )}

                        {fee.payments.length > 0 && (
                            <div>
                                <h4 className="font-semibold mb-2">
                                    Payment History
                                </h4>
                                <div className="space-y-2">
                                    {fee.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                        >
                                            <div>
                                                <p className="font-medium">
                                                    ₹
                                                    {(
                                                        payment.amount || 0
                                                    ).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {format(
                                                        new Date(
                                                            payment.paymentDate
                                                        ),
                                                        "dd MMM yyyy"
                                                    )}{" "}
                                                    | {payment.paymentMethod}
                                                    {payment.receiptNumber &&
                                                        ` | Receipt: ${payment.receiptNumber}`}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onGenerateReceipt(
                                                        payment.id
                                                    )
                                                }
                                            >
                                                <Download className="h-4 w-4 mr-1" />
                                                Receipt
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

const ReceiptModal: React.FC<{
    receiptData: ReceiptData;
    onClose: () => void;
}> = ({ receiptData, onClose }) => {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4 max-h-screen overflow-y-auto">
                <div className="receipt-content">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold">HighQ Classes</h2>
                        <p className="text-muted-foreground">Payment Receipt</p>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b pb-2">
                            <div className="flex justify-between">
                                <span className="font-medium">Receipt No:</span>
                                <span>{receiptData.receiptNumber}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">Date:</span>
                                <span>
                                    {format(
                                        new Date(receiptData.paymentDate),
                                        "dd MMM yyyy"
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="border-b pb-2">
                            <h3 className="font-semibold mb-2">
                                Student Details
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <strong>Name:</strong>{" "}
                                    {receiptData.student.name}
                                </p>
                                <p>
                                    <strong>Email:</strong>{" "}
                                    {receiptData.student.email}
                                </p>
                                <p>
                                    <strong>Mobile:</strong>{" "}
                                    {receiptData.student.mobile}
                                </p>
                            </div>
                        </div>

                        <div className="border-b pb-2">
                            <h3 className="font-semibold mb-2">Fee Details</h3>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <strong>Type:</strong>{" "}
                                    {receiptData.fee.type}
                                </p>
                                {receiptData.fee.course && (
                                    <p>
                                        <strong>Course:</strong>{" "}
                                        {receiptData.fee.course}
                                    </p>
                                )}
                                {receiptData.fee.batch && (
                                    <p>
                                        <strong>Batch:</strong>{" "}
                                        {receiptData.fee.batch}
                                    </p>
                                )}
                                {receiptData.fee.description && (
                                    <p>
                                        <strong>Description:</strong>{" "}
                                        {receiptData.fee.description}
                                    </p>
                                )}
                                {receiptData.fee.month &&
                                    receiptData.fee.year && (
                                        <p>
                                            <strong>Period:</strong>{" "}
                                            {receiptData.fee.month}{" "}
                                            {receiptData.fee.year}
                                        </p>
                                    )}
                            </div>
                        </div>

                        <div className="border-b pb-2">
                            <h3 className="font-semibold mb-2">
                                Payment Details
                            </h3>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <strong>Amount:</strong> ₹
                                    {(receiptData.amount || 0).toLocaleString()}
                                </p>
                                <p>
                                    <strong>Method:</strong>{" "}
                                    {receiptData.paymentMethod}
                                </p>
                                {receiptData.transactionId && (
                                    <p>
                                        <strong>Transaction ID:</strong>{" "}
                                        {receiptData.transactionId}
                                    </p>
                                )}
                                <p>
                                    <strong>Processed By:</strong>{" "}
                                    {receiptData.processedBy}
                                </p>
                            </div>
                        </div>

                        {receiptData.notes && (
                            <div className="border-b pb-2">
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <p className="text-sm">{receiptData.notes}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 mt-6">
                    <Button onClick={handlePrint} className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StudentFeeDashboard;
