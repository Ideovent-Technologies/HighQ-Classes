import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Users,
    TrendingUp,
    Calendar,
    Search,
    Filter,
    Download,
    Eye,
    Edit3,
    CheckCircle,
    AlertCircle,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import AdminService from "@/API/services/AdminService";
import { useToast } from "@/hooks/use-toast";

interface Student {
    _id: string;
    name: string;
    email: string;
    batch?: {
        _id: string;
        name: string;
    };
    feeStatus: {
        totalFee: number;
        paidAmount: number;
        pendingAmount: number;
        status: "paid" | "pending" | "overdue";
        lastPaymentDate?: string;
    };
}

const FeeManagement: React.FC = () => {
    const { toast } = useToast();
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [batchFilter, setBatchFilter] = useState<string>("all");

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllStudents();
            if (response.success && response.students) {
                // Transform students data with fee information
                const studentsWithFees: Student[] = response.students.map(
                    (student: any) => ({
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        batch: student.batch,
                        feeStatus: student.feeStatus || {
                            totalFee: 0,
                            paidAmount: 0,
                            pendingAmount: 0,
                            status: "pending" as const,
                            lastPaymentDate: new Date().toISOString(),
                        },
                    })
                );

                // Calculate pending amounts and status
                studentsWithFees.forEach((student) => {
                    student.feeStatus.pendingAmount =
                        student.feeStatus.totalFee -
                        student.feeStatus.paidAmount;
                    if (student.feeStatus.pendingAmount === 0) {
                        student.feeStatus.status = "paid";
                    } else if (student.feeStatus.paidAmount === 0) {
                        student.feeStatus.status = "overdue";
                    } else {
                        student.feeStatus.status = "pending";
                    }
                });

                setStudents(studentsWithFees);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to fetch student fee data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === "all" || student.feeStatus.status === statusFilter;
        const matchesBatch =
            batchFilter === "all" || student.batch?.name === batchFilter;

        return matchesSearch && matchesStatus && matchesBatch;
    });

    const totalFees = students.reduce(
        (sum, student) => sum + student.feeStatus.totalFee,
        0
    );
    const collectedFees = students.reduce(
        (sum, student) => sum + student.feeStatus.paidAmount,
        0
    );
    const pendingFees = totalFees - collectedFees;
    const collectionRate =
        totalFees > 0 ? (collectedFees / totalFees) * 100 : 0;

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
            default:
                return <Badge variant="secondary">Unknown</Badge>;
        }
    };

    const batches = Array.from(
        new Set(students.map((s) => s.batch?.name).filter(Boolean))
    );

    return (
        <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <DollarSign className="h-8 w-8 text-green-600" />
                        Fee Management
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Monitor and manage student fee payments
                    </p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Record Payment
                    </Button>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100">Total Fees</p>
                                <p className="text-2xl font-bold">
                                    ₹{totalFees.toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100">Collected</p>
                                <p className="text-2xl font-bold">
                                    ₹{collectedFees.toLocaleString()}
                                </p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100">Pending</p>
                                <p className="text-2xl font-bold">
                                    ₹{pendingFees.toLocaleString()}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100">
                                    Collection Rate
                                </p>
                                <p className="text-2xl font-bold">
                                    {collectionRate.toFixed(1)}%
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-purple-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search students..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-48">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select
                            value={batchFilter}
                            onValueChange={setBatchFilter}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filter by batch" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Batches</SelectItem>
                                {batches.map((batch) => (
                                    <SelectItem key={batch} value={batch || ""}>
                                        {batch}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Students Fee Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Student Fee Status ({filteredStudents.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="text-center p-8">
                            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No students found
                            </h3>
                            <p className="text-gray-600">
                                Try adjusting your search or filter criteria
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Student
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Batch
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Total Fee
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Paid
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Pending
                                        </th>
                                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                                            Status
                                        </th>
                                        <th className="py-3 px-4 text-center font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((student) => (
                                        <tr
                                            key={student._id}
                                            className="border-t hover:bg-gray-50"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {student.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {student.batch?.name ||
                                                    "No Batch"}
                                            </td>
                                            <td className="py-4 px-4 font-medium">
                                                ₹
                                                {student.feeStatus.totalFee.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-green-600 font-medium">
                                                ₹
                                                {student.feeStatus.paidAmount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4 text-orange-600 font-medium">
                                                ₹
                                                {student.feeStatus.pendingAmount.toLocaleString()}
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(
                                                    student.feeStatus.status
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FeeManagement;
