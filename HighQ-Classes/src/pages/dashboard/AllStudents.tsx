import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Search,
    Filter,
    Download,
    Edit,
    Trash,
    User,
    ChevronDown,
    ChevronUp,
    Loader2,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AdminService from "@/API/services/AdminService";
import { useToast } from "@/hooks/use-toast";

interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    batch?: {
        _id: string;
        name: string;
    };
    joiningDate: string;
    isActive: boolean;
    createdAt: string;
    feeStatus?: {
        totalFee: number;
        paidAmount: number;
        pendingAmount: number;
    };
}

const AllStudents = () => {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [batchFilter, setBatchFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [sortConfig, setSortConfig] = useState({
        key: "name",
        direction: "asc",
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await AdminService.getAllStudents();
            if (response.success && response.students) {
                // Transform the API response to match our interface
                const transformedStudents: Student[] = response.students.map(
                    (student: any) => ({
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        phone: student.phone,
                        batch: student.batch,
                        joiningDate: student.createdAt,
                        isActive: student.isActive !== false, // Default to true if not specified
                        createdAt: student.createdAt,
                        feeStatus: {
                            totalFee: 12000, // Default values - these should come from API
                            paidAmount: 0,
                            pendingAmount: 12000,
                        },
                    })
                );
                setStudents(transformedStudents);
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch students",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to fetch students data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort students
    const getFilteredStudents = () => {
        let filtered = [...students];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(
                (student) =>
                    student.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    student.email
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            if (statusFilter === "paid") {
                filtered = filtered.filter(
                    (student) => student.feeStatus.pendingAmount === 0
                );
            } else if (statusFilter === "pending") {
                filtered = filtered.filter(
                    (student) => student.feeStatus.pendingAmount > 0
                );
            } else if (statusFilter === "unpaid") {
                filtered = filtered.filter(
                    (student) => student.feeStatus.paidAmount === 0
                );
            }
        }

        // Apply batch filter
        if (batchFilter !== "all") {
            filtered = filtered.filter(
                (student) => student.batch?.name === batchFilter
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;

            if (sortConfig.key === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortConfig.key === "joiningDate") {
                comparison =
                    new Date(a.joiningDate).getTime() -
                    new Date(b.joiningDate).getTime();
            } else if (sortConfig.key === "pendingAmount") {
                comparison =
                    (a.feeStatus?.pendingAmount || 0) -
                    (b.feeStatus?.pendingAmount || 0);
            }

            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return filtered;
    };

    // Handle sort
    const requestSort = (key: string) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Get unique batches
    const batches = Array.from(
        new Set(students.map((student) => student.batch?.name).filter(Boolean))
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">All Students</h1>
                    <p className="text-gray-600">
                        Manage and view all students information
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <CardTitle>Students List</CardTitle>
                            <Button>
                                <User className="h-4 w-4 mr-2" />
                                Add New Student
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-grow">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                    <Input
                                        type="search"
                                        placeholder="Search by name or ID..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="w-full sm:w-40">
                                        <Select
                                            value={statusFilter}
                                            onValueChange={setStatusFilter}
                                        >
                                            <SelectTrigger>
                                                <div className="flex items-center">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    <SelectValue placeholder="Fee Status" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Status
                                                </SelectItem>
                                                <SelectItem value="paid">
                                                    Fully Paid
                                                </SelectItem>
                                                <SelectItem value="pending">
                                                    Partially Paid
                                                </SelectItem>
                                                <SelectItem value="unpaid">
                                                    Unpaid
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="w-full sm:w-48">
                                        <Select
                                            value={batchFilter}
                                            onValueChange={setBatchFilter}
                                        >
                                            <SelectTrigger>
                                                <div className="flex items-center">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    <SelectValue placeholder="All Batches" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    All Batches
                                                </SelectItem>
                                                {batches.map((batch) => (
                                                    <SelectItem
                                                        key={batch}
                                                        value={batch}
                                                    >
                                                        {batch}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Button variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-md border overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">
                                                    <button
                                                        className="flex items-center"
                                                        onClick={() =>
                                                            requestSort("name")
                                                        }
                                                    >
                                                        Student Name
                                                        {sortConfig.key ===
                                                        "name" ? (
                                                            sortConfig.direction ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 ml-1 opacity-30" />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">
                                                    Email
                                                </th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">
                                                    Batch
                                                </th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">
                                                    <button
                                                        className="flex items-center"
                                                        onClick={() =>
                                                            requestSort(
                                                                "joiningDate"
                                                            )
                                                        }
                                                    >
                                                        Joining Date
                                                        {sortConfig.key ===
                                                        "joiningDate" ? (
                                                            sortConfig.direction ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 ml-1 opacity-30" />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-3 px-4 text-left font-medium text-gray-600">
                                                    <button
                                                        className="flex items-center"
                                                        onClick={() =>
                                                            requestSort(
                                                                "pendingAmount"
                                                            )
                                                        }
                                                    >
                                                        Fee Status
                                                        {sortConfig.key ===
                                                        "pendingAmount" ? (
                                                            sortConfig.direction ===
                                                            "asc" ? (
                                                                <ChevronUp className="h-4 w-4 ml-1" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 ml-1" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 ml-1 opacity-30" />
                                                        )}
                                                    </button>
                                                </th>
                                                <th className="py-3 px-4 text-center font-medium text-gray-600">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading ? (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="py-8 text-center"
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                                            Loading students...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : getFilteredStudents().length >
                                              0 ? (
                                                getFilteredStudents().map(
                                                    (student) => (
                                                        <tr
                                                            key={student._id}
                                                            className="border-t"
                                                        >
                                                            <td className="py-4 px-4">
                                                                {student.name}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {student.email}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {student.batch
                                                                    ?.name ||
                                                                    "No Batch"}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                {new Date(
                                                                    student.joiningDate
                                                                ).toLocaleDateString()}
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center">
                                                                    <div
                                                                        className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                                                            (student
                                                                                .feeStatus
                                                                                ?.pendingAmount ||
                                                                                0) ===
                                                                            0
                                                                                ? "bg-green-500"
                                                                                : (student
                                                                                      .feeStatus
                                                                                      ?.paidAmount ||
                                                                                      0) ===
                                                                                  0
                                                                                ? "bg-red-500"
                                                                                : "bg-yellow-500"
                                                                        }`}
                                                                    ></div>
                                                                    <span>
                                                                        {(student
                                                                            .feeStatus
                                                                            ?.pendingAmount ||
                                                                            0) ===
                                                                        0
                                                                            ? "Paid"
                                                                            : (student
                                                                                  .feeStatus
                                                                                  ?.paidAmount ||
                                                                                  0) ===
                                                                              0
                                                                            ? "Unpaid"
                                                                            : "Partial"}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex justify-center space-x-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-red-500"
                                                                    >
                                                                        <Trash className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={6}
                                                        className="py-8 text-center text-gray-500"
                                                    >
                                                        No students found
                                                        matching your search
                                                        criteria.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600">
                                    Showing {getFilteredStudents().length} of{" "}
                                    {students.length} students
                                </p>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AllStudents;
