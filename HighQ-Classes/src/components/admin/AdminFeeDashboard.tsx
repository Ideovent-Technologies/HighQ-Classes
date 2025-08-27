import React, { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus,
    Search,
    Filter,
    Download,
    DollarSign,
    Users,
    AlertCircle,
    TrendingUp,
    Calendar,
    CreditCard,
    MoreHorizontal,
    Send,
    Percent,
} from "lucide-react";
import { useFeeService } from "@/API/services/feeService";
import { Fee, FeeAnalytics, BulkFeeData, PaymentData } from "@/types/fee.types";
import { format } from "date-fns";
import { toast } from "sonner";

const AdminFeeDashboard: React.FC = () => {
    const [fees, setFees] = useState<Fee[]>([]);
    const [analytics, setAnalytics] = useState<FeeAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showCreateFeeModal, setShowCreateFeeModal] = useState(false);
    const [showBulkFeeModal, setShowBulkFeeModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const feeService = useFeeService();

    useEffect(() => {
        fetchFees();
        fetchAnalytics();
    }, [currentPage, statusFilter, searchTerm]);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(statusFilter !== "all" && { status: statusFilter }),
                ...(searchTerm && { student: searchTerm }),
            };

            const response = await feeService.getAllFees(params);
            setFees(response.data.fees);
            setTotalPages(response.data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching fees:", error);
            toast.error("Failed to load fees");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await feeService.getFeeAnalytics();
            setAnalytics(response.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        }
    };

    const handleCreateFee = async (feeData: any) => {
        try {
            await feeService.createFee(feeData);
            toast.success("Fee created successfully");
            setShowCreateFeeModal(false);
            fetchFees();
            fetchAnalytics();
        } catch (error) {
            console.error("Error creating fee:", error);
            toast.error("Failed to create fee");
        }
    };

    const handleBulkCreateFees = async (bulkData: BulkFeeData) => {
        try {
            await feeService.createBulkFees(bulkData);
            toast.success("Bulk fees created successfully");
            setShowBulkFeeModal(false);
            fetchFees();
            fetchAnalytics();
        } catch (error) {
            console.error("Error creating bulk fees:", error);
            toast.error("Failed to create bulk fees");
        }
    };

    const handleProcessPayment = async (paymentData: PaymentData) => {
        try {
            if (!selectedFee) return;

            await feeService.processPayment(selectedFee.id, paymentData);
            toast.success("Payment processed successfully");
            setShowPaymentModal(false);
            setSelectedFee(null);
            fetchFees();
            fetchAnalytics();
        } catch (error) {
            console.error("Error processing payment:", error);
            toast.error("Failed to process payment");
        }
    };

    const handleApplyDiscount = async (
        feeId: string,
        discount: number,
        reason?: string
    ) => {
        try {
            await feeService.applyDiscount(feeId, { discount, reason });
            toast.success("Discount applied successfully");
            fetchFees();
            fetchAnalytics();
        } catch (error) {
            console.error("Error applying discount:", error);
            toast.error("Failed to apply discount");
        }
    };

    const handleSendReminder = async (feeId: string) => {
        try {
            // await feeService.sendPaymentReminder(feeId);
            toast.success("Payment reminder sent successfully");
        } catch (error) {
            console.error("Error sending reminder:", error);
            toast.error("Failed to send reminder");
        }
    };

    const handleExportReport = async () => {
        try {
            // const response = await feeService.exportFeeReport({
            //     ...(statusFilter !== "all" && { status: statusFilter }),
            //     ...(searchTerm && { student: searchTerm }),
            // });

            // Create download link
            // const url = window.URL.createObjectURL(new Blob([response.data]));
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute('download', `fee_report_${format(new Date(), 'yyyy-MM-dd')}.csv`);
            // document.body.appendChild(link);
            // link.click();
            // link.remove();

            toast.success("Export feature coming soon");
        } catch (error) {
            console.error("Error exporting report:", error);
            toast.error("Failed to export report");
        }
    };

    if (loading && !analytics) {
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
                        Fee Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Manage student fees, payments, and financial records
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Analytics Cards */}
                    {analytics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Total Collection
                                    </CardTitle>
                                    <DollarSign className="h-5 w-5 text-blue-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ₹
                                        {analytics.overview.totalPaid.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        out of ₹
                                        {analytics.overview.totalFees.toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        Pending Amount
                                    </CardTitle>
                                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        ₹
                                        {analytics.overview.totalPending.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {analytics.overview.totalRecords} total
                                        records
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
                                        {analytics.overview.overdueAmount.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {analytics.overview.overdueCount}{" "}
                                        overdue records
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-600">
                                        This Month
                                    </CardTitle>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-green-600">
                                        ₹
                                        {analytics.overview.monthlyCollection.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {analytics.overview.monthlyTransactions}{" "}
                                        transactions
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Fee Management Actions
                            </CardTitle>
                            <CardDescription>
                                Create fees, process payments, and manage
                                records
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <Dialog
                                    open={showCreateFeeModal}
                                    onOpenChange={setShowCreateFeeModal}
                                >
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Fee
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <CreateFeeForm
                                            onSubmit={handleCreateFee}
                                            onCancel={() =>
                                                setShowCreateFeeModal(false)
                                            }
                                        />
                                    </DialogContent>
                                </Dialog>

                                <Dialog
                                    open={showBulkFeeModal}
                                    onOpenChange={setShowBulkFeeModal}
                                >
                                    <DialogTrigger asChild>
                                        <Button variant="outline">
                                            <Users className="h-4 w-4 mr-2" />
                                            Bulk Create
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <BulkFeeForm
                                            onSubmit={handleBulkCreateFees}
                                            onCancel={() =>
                                                setShowBulkFeeModal(false)
                                            }
                                        />
                                    </DialogContent>
                                </Dialog>

                                <Button
                                    variant="outline"
                                    onClick={handleExportReport}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export Report
                                </Button>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search by student name or ID..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="max-w-sm"
                                    />
                                </div>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Status
                                        </SelectItem>
                                        <SelectItem value="pending">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="partial">
                                            Partial
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="overdue">
                                            Overdue
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fee List */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-xl">
                                Fee Records
                            </CardTitle>
                            <CardDescription>
                                Manage individual student fee records
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {fees.map((fee) => (
                                    <FeeCard
                                        key={fee.id}
                                        fee={fee}
                                        onProcessPayment={(fee) => {
                                            setSelectedFee(fee);
                                            setShowPaymentModal(true);
                                        }}
                                        onApplyDiscount={handleApplyDiscount}
                                        onSendReminder={handleSendReminder}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === 1}
                                        onClick={() =>
                                            setCurrentPage((prev) => prev - 1)
                                        }
                                    >
                                        Previous
                                    </Button>
                                    <span className="px-4 py-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        disabled={currentPage === totalPages}
                                        onClick={() =>
                                            setCurrentPage((prev) => prev + 1)
                                        }
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && selectedFee && (
                    <Dialog
                        open={showPaymentModal}
                        onOpenChange={setShowPaymentModal}
                    >
                        <DialogContent>
                            <PaymentForm
                                fee={selectedFee}
                                onSubmit={handleProcessPayment}
                                onCancel={() => setShowPaymentModal(false)}
                            />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

// Individual Fee Card Component
const FeeCard: React.FC<{
    fee: Fee;
    onProcessPayment: (fee: Fee) => void;
    onApplyDiscount: (feeId: string, discount: number, reason?: string) => void;
    onSendReminder: (feeId: string) => void;
}> = ({ fee, onProcessPayment, onApplyDiscount, onSendReminder }) => {
    const [showDiscountForm, setShowDiscountForm] = useState(false);
    const [discount, setDiscount] = useState("");
    const [discountReason, setDiscountReason] = useState("");

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

    const handleApplyDiscount = () => {
        if (discount && parseFloat(discount) > 0) {
            onApplyDiscount(
                fee.id,
                parseFloat(discount),
                discountReason || undefined
            );
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
                            {fee.student.name} - {fee.feeType}
                        </CardTitle>
                        <CardDescription>
                            {fee.course?.name || "General Fee"}
                            {fee.month &&
                                fee.year &&
                                ` | ${fee.month} ${fee.year}`}
                            {fee.batch?.name && ` | Batch: ${fee.batch.name}`}
                        </CardDescription>
                    </div>
                    <Badge className={getStatusColor(fee.status)}>
                        {fee.status.toUpperCase()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Amount
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                            ₹{fee.amount?.toLocaleString() || "0"}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Paid Amount
                        </p>
                        <p className="text-lg font-bold text-green-600 mt-1">
                            ₹{fee.paidAmount?.toLocaleString() || "0"}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Pending Amount
                        </p>
                        <p className="text-lg font-bold text-red-600 mt-1">
                            ₹
                            {(
                                fee.pendingAmount ||
                                (fee.amount || 0) - (fee.paidAmount || 0)
                            ).toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Due Date
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1 flex items-center justify-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(new Date(fee.dueDate), "dd MMM yyyy")}
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

                <div className="flex flex-wrap gap-2">
                    {fee.status !== "paid" && (
                        <Button onClick={() => onProcessPayment(fee)} size="sm">
                            <CreditCard className="h-4 w-4 mr-1" />
                            Process Payment
                        </Button>
                    )}

                    {!showDiscountForm ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDiscountForm(true)}
                        >
                            <Percent className="h-4 w-4 mr-1" />
                            Apply Discount
                        </Button>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <Input
                                type="number"
                                placeholder="Discount amount"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-32"
                            />
                            <Input
                                placeholder="Reason (optional)"
                                value={discountReason}
                                onChange={(e) =>
                                    setDiscountReason(e.target.value)
                                }
                                className="w-40"
                            />
                            <Button size="sm" onClick={handleApplyDiscount}>
                                Apply
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDiscountForm(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSendReminder(fee.id)}
                    >
                        <Send className="h-4 w-4 mr-1" />
                        Send Reminder
                    </Button>
                </div>

                {fee.payments?.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2">Payment History</h4>
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
                                                new Date(payment.paymentDate),
                                                "dd MMM yyyy"
                                            )}{" "}
                                            | {payment.paymentMethod}
                                            {payment.receiptNumber &&
                                                ` | Receipt: ${payment.receiptNumber}`}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        {payment.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// Create Fee Form Component
const CreateFeeForm: React.FC<{
    onSubmit: (data: any) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        studentId: "",
        courseId: "",
        batchId: "",
        amount: "",
        dueDate: "",
        feeType: "tuition",
        month: "",
        year: new Date().getFullYear(),
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount),
            year: parseInt(formData.year.toString()),
        });
    };

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Create New Fee</DialogTitle>
                <DialogDescription>
                    Create a fee record for a student
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                        id="studentId"
                        value={formData.studentId}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                studentId: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                dueDate: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select
                        value={formData.feeType}
                        onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, feeType: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admission">Admission</SelectItem>
                            <SelectItem value="tuition">Tuition</SelectItem>
                            <SelectItem value="examination">
                                Examination
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Create Fee</Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

// Bulk Fee Form Component
const BulkFeeForm: React.FC<{
    onSubmit: (data: BulkFeeData) => void;
    onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        studentIds: "",
        courseId: "",
        batchId: "",
        amount: "",
        dueDate: "",
        feeType: "tuition" as const,
        month: "",
        year: new Date().getFullYear(),
        description: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const studentIdsArray = formData.studentIds
            .split(",")
            .map((id) => id.trim())
            .filter((id) => id);

        onSubmit({
            studentIds: studentIdsArray,
            courseId: formData.courseId || undefined,
            batchId: formData.batchId || undefined,
            amount: parseFloat(formData.amount),
            dueDate: formData.dueDate,
            feeType: formData.feeType,
            month: formData.month || undefined,
            year: formData.year,
            description: formData.description || undefined,
        });
    };

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Create Bulk Fees</DialogTitle>
                <DialogDescription>
                    Create fee records for multiple students at once
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                    <Label htmlFor="studentIds">
                        Student IDs (comma-separated)
                    </Label>
                    <Textarea
                        id="studentIds"
                        value={formData.studentIds}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                studentIds: e.target.value,
                            }))
                        }
                        placeholder="student1,student2,student3..."
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                dueDate: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="feeType">Fee Type</Label>
                    <Select
                        value={formData.feeType}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                feeType: value as any,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admission">Admission</SelectItem>
                            <SelectItem value="tuition">Tuition</SelectItem>
                            <SelectItem value="examination">
                                Examination
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Create Bulk Fees</Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

// Payment Form Component
const PaymentForm: React.FC<{
    fee: Fee;
    onSubmit: (data: PaymentData) => void;
    onCancel: () => void;
}> = ({ fee, onSubmit, onCancel }) => {
    const pendingAmount =
        fee.pendingAmount || (fee.amount || 0) - (fee.paidAmount || 0);

    const [formData, setFormData] = useState({
        amount: pendingAmount.toString(),
        paymentMethod: "cash" as const,
        transactionId: "",
        paymentDate: format(new Date(), "yyyy-MM-dd"),
        remarks: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            amount: parseFloat(formData.amount),
            paymentMethod: formData.paymentMethod,
            transactionId: formData.transactionId || undefined,
            paymentDate: formData.paymentDate,
            remarks: formData.remarks || undefined,
        });
    };

    return (
        <div>
            <DialogHeader>
                <DialogTitle>Process Payment</DialogTitle>
                <DialogDescription>
                    Processing payment for {fee.student.name} - {fee.feeType}
                </DialogDescription>
            </DialogHeader>

            <div className="my-4 p-4 bg-gray-50 rounded">
                <p>
                    <strong>Pending Amount:</strong> ₹
                    {pendingAmount.toLocaleString()}
                </p>
                <p>
                    <strong>Total Amount:</strong> ₹
                    {(fee.amount || 0).toLocaleString()}
                </p>
                <p>
                    <strong>Paid Amount:</strong> ₹
                    {(fee.paidAmount || 0).toLocaleString()}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="amount">Payment Amount</Label>
                    <Input
                        id="amount"
                        type="number"
                        max={pendingAmount}
                        value={formData.amount}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                amount: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) =>
                            setFormData((prev) => ({
                                ...prev,
                                paymentMethod: value as any,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank_transfer">
                                Bank Transfer
                            </SelectItem>
                            <SelectItem value="upi">UPI</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="transactionId">
                        Transaction ID (Optional)
                    </Label>
                    <Input
                        id="transactionId"
                        value={formData.transactionId}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                transactionId: e.target.value,
                            }))
                        }
                    />
                </div>

                <div>
                    <Label htmlFor="paymentDate">Payment Date</Label>
                    <Input
                        id="paymentDate"
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                paymentDate: e.target.value,
                            }))
                        }
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="remarks">Remarks (Optional)</Label>
                    <Textarea
                        id="remarks"
                        value={formData.remarks}
                        onChange={(e) =>
                            setFormData((prev) => ({
                                ...prev,
                                remarks: e.target.value,
                            }))
                        }
                    />
                </div>

                <div className="flex gap-2">
                    <Button type="submit">Process Payment</Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AdminFeeDashboard;
