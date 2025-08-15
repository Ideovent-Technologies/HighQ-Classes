import { useState, useEffect } from "react";
// Assuming DashboardLayout, Card, CardContent, CardHeader, CardTitle, Input, Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue are from Shadcn UI
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
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
    Users, // New: For total students icon
    CheckCircle, // New: For fully paid icon
    AlertTriangle, // New: For pending payments icon
    XCircle, // New: For unpaid icon
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

// Interface for Student data, consistent with the original code
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
    // Access the toast hook for notifications
    const { toast } = useToast();

    // State variables for search, filters, loading, student data, and sorting
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'paid', 'pending', 'unpaid'
    const [batchFilter, setBatchFilter] = useState("all"); // 'all' or specific batch name
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [students, setStudents] = useState<Student[]>([]); // Stores the list of students
    const [sortConfig, setSortConfig] = useState({
        key: "name", // Default sort key
        direction: "asc", // Default sort direction
    });

    // useEffect hook to fetch students data when the component mounts
    useEffect(() => {
        fetchStudents();
    }, []); // Empty dependency array means this runs once on mount

    /**
     * Fetches student data from the API and updates the state.
     * Handles loading state and error notifications.
     */
    const fetchStudents = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await AdminService.getAllStudents(); // API call
            if (response.success && response.students) {
                // Transform the API response to match our Student interface
                const transformedStudents: Student[] = response.students.map(
                    (student: any) => ({
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        phone: student.phone,
                        batch: student.batch,
                        joiningDate: student.createdAt, // Using createdAt as joiningDate
                        isActive: student.isActive !== false, // Default to true if not specified
                        createdAt: student.createdAt,
                        feeStatus: student.feeStatus || {
                            totalFee: 0,
                            paidAmount: 0,
                            pendingAmount: 0,
                        },
                    })
                );
                setStudents(transformedStudents);
                console.log("Fetched students:", transformedStudents);
                
            } else {
                // Show error toast if API call fails
                toast({
                    title: "Error",
                    description: response.message || "Failed to fetch students",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error fetching students:", error);
            // Show error toast for network or unexpected errors
            toast({
                title: "Error",
                description: "Failed to fetch students data",
                variant: "destructive",
            });
        } finally {
            setLoading(false); // Set loading to false after fetching ( चाहे success हो या error )
        }
    };

    /**
     * Filters and sorts the students array based on current search query, filters, and sort configuration.
     * @returns {Student[]} The filtered and sorted array of students.
     */
    const getFilteredStudents = () => {
        let filtered = [...students]; // Create a mutable copy of the students array

        // Apply search filter by name or email (case-insensitive)
        if (searchQuery) {
            filtered = filtered.filter(
                (student) =>
                    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    student.email.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply fee status filter
        if (statusFilter !== "all") {
            if (statusFilter === "paid") {
                // Fully paid: pending amount is 0
                filtered = filtered.filter(
                    (student) => (student.feeStatus?.pendingAmount || 0) === 0
                );
            } else if (statusFilter === "pending") {
                // Partially paid: pending amount is greater than 0
                filtered = filtered.filter(
                    (student) => (student.feeStatus?.pendingAmount || 0) > 0 && (student.feeStatus?.paidAmount || 0) > 0
                );
            } else if (statusFilter === "unpaid") {
                // Unpaid: paid amount is 0
                filtered = filtered.filter(
                    (student) => (student.feeStatus?.paidAmount || 0) === 0
                );
            }
        }

        // Apply batch filter
        if (batchFilter !== "all") {
            filtered = filtered.filter(
                (student) => student.batch?.name === batchFilter
            );
        }

        // Apply sorting based on the sortConfig
        filtered.sort((a, b) => {
            let comparison = 0;

            if (sortConfig.key === "name") {
                // Sort by student name
                comparison = a.name.localeCompare(b.name);
            } else if (sortConfig.key === "joiningDate") {
                // Sort by joining date
                comparison =
                    new Date(a.joiningDate).getTime() -
                    new Date(b.joiningDate).getTime();
            } else if (sortConfig.key === "pendingAmount") {
                // Sort by pending amount (for fee status)
                comparison =
                    (a.feeStatus?.pendingAmount || 0) -
                    (b.feeStatus?.pendingAmount || 0);
            }

            // Apply ascending or descending direction
            return sortConfig.direction === "asc" ? comparison : -comparison;
        });

        return filtered;
    };

    /**
     * Handles changing the sort key and direction.
     * If the same key is clicked, it toggles the direction. Otherwise, it sets a new key with 'asc' direction.
     * @param {string} key The key to sort by (e.g., 'name', 'joiningDate', 'pendingAmount').
     */
    const requestSort = (key: string) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Get unique batch names for the batch filter dropdown
    const batches = Array.from(
        new Set(students.map((student) => student.batch?.name).filter(Boolean))
    ) as string[]; // Explicitly type to string array

    // Calculate statistics for the overview cards
    const totalStudents = students.length;
    const fullyPaidStudents = students.filter(s => (s.feeStatus?.pendingAmount || 0) === 0).length;
    const pendingPaymentStudents = students.filter(s => (s.feeStatus?.pendingAmount || 0) > 0).length;
    const unpaidStudents = students.filter(s => (s.feeStatus?.paidAmount || 0) === 0).length;
    const navigate = useNavigate();


    const handleClick = () => {
        // Navigate to the Add Student page
        navigate("/dashboard/students/add");
        console.log("Navigating to Add Student page");
    }
    

    return (
        <DashboardLayout>
            <div className="space-y-6 p-4 md:p-6 lg:p-8">
                {/* Dashboard Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Student Management</h1>
                        <p className="text-lg text-muted-foreground">
                            Manage and view all students information effectively.
                        </p>
                    </div>
                    {/* Button to add new student */}
                    <Button onClick={handleClick} className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all duration-200 ease-in-out transform hover:scale-105 rounded-lg px-6 py-3">
                        <User className="h-5 w-5 mr-2" />
                        Add New Student
                    </Button>
                </div>

                {/* --- */}
                {/* Overview Statistics Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
                    {/* Total Students Card */}
                    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                            <Users className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{totalStudents}</div>
                            <p className="text-xs opacity-90 mt-1">Overall enrollment</p>
                        </CardContent>
                    </Card>

                    {/* Fully Paid Students Card */}
                    <Card className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Fully Paid</CardTitle>
                            <CheckCircle className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{fullyPaidStudents}</div>
                            <p className="text-xs opacity-90 mt-1">All dues cleared</p>
                        </CardContent>
                    </Card>

                    {/* Pending Payments Students Card */}
                    <Card className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                            <AlertTriangle className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{pendingPaymentStudents}</div>
                            <p className="text-xs opacity-90 mt-1">Requires follow-up</p>
                        </CardContent>
                    </Card>

                    {/* Unpaid Students Card */}
                    <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Unpaid</CardTitle>
                            <XCircle className="h-5 w-5 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{unpaidStudents}</div>
                            <p className="text-xs opacity-90 mt-1">Active students with no payment</p>
                        </CardContent>
                    </Card>
                </div>

                {/* --- */}
                {/* Main Content Card: Search, Filters, Table */}
                <Card className="mt-8 shadow-xl rounded-xl">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b">
                        <CardTitle className="text-xl font-semibold">Student Directory</CardTitle>
                        <CardDescription className="hidden sm:block">
                            View and manage all student records with advanced filtering.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {/* Filter and Search Controls */}
                            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                                {/* Search Input */}
                                <div className="relative flex-grow">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by name or email..."
                                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Filter Selects and Export Button */}
                                <div className="flex flex-col sm:flex-row gap-4 flex-wrap justify-end">
                                    {/* Fee Status Filter */}
                                    <Select
                                        value={statusFilter}
                                        onValueChange={setStatusFilter}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300 shadow-sm">
                                            <div className="flex items-center">
                                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <SelectValue placeholder="Fee Status" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg shadow-lg">
                                            <SelectItem value="all">All Status</SelectItem>
                                            <SelectItem value="paid">Fully Paid</SelectItem>
                                            <SelectItem value="pending">Partially Paid</SelectItem>
                                            <SelectItem value="unpaid">Unpaid</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    {/* Batch Filter */}
                                    <Select
                                        value={batchFilter}
                                        onValueChange={setBatchFilter}
                                    >
                                        <SelectTrigger className="w-full sm:w-[180px] rounded-lg border border-gray-300 shadow-sm">
                                            <div className="flex items-center">
                                                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <SelectValue placeholder="All Batches" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg shadow-lg">
                                            <SelectItem value="all">All Batches</SelectItem>
                                            {batches.map((batch) => (
                                                <SelectItem key={batch} value={batch}>
                                                    {batch}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {/* Export Button */}
                                    <Button variant="outline" className="shrink-0 rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export Data
                                    </Button>
                                </div>
                            </div>

                            {/* --- */}
                            {/* Students Data Table */}
                            <div className="rounded-lg border border-gray-200 overflow-hidden shadow-md">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {/* Table Header: Student Name with Sort */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => requestSort("name")}
                                                >
                                                    <button className="flex items-center space-x-1 focus:outline-none">
                                                        <span>Student Name</span>
                                                        {sortConfig.key === "name" ? (
                                                            sortConfig.direction === "asc" ? (
                                                                <ChevronUp className="h-4 w-4 text-blue-500" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-blue-500" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </button>
                                                </th>
                                                {/* Table Header: Email */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Email
                                                </th>
                                                {/* Table Header: Batch */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Batch
                                                </th>
                                                {/* Table Header: Joining Date with Sort */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => requestSort("joiningDate")}
                                                >
                                                    <button className="flex items-center space-x-1 focus:outline-none">
                                                        <span>Joining Date</span>
                                                        {sortConfig.key === "joiningDate" ? (
                                                            sortConfig.direction === "asc" ? (
                                                                <ChevronUp className="h-4 w-4 text-blue-500" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-blue-500" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </button>
                                                </th>
                                                {/* Table Header: Fee Status with Sort */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                                    onClick={() => requestSort("pendingAmount")}
                                                >
                                                    <button className="flex items-center space-x-1 focus:outline-none">
                                                        <span>Fee Status</span>
                                                        {sortConfig.key === "pendingAmount" ? (
                                                            sortConfig.direction === "asc" ? (
                                                                <ChevronUp className="h-4 w-4 text-blue-500" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-blue-500" />
                                                            )
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        )}
                                                    </button>
                                                </th>
                                                {/* Table Header: Actions */}
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {/* Conditional rendering based on loading state */}
                                            {loading ? (
                                                <tr>
                                                    <td colSpan={6} className="py-12 text-center text-gray-500">
                                                        <div className="flex items-center justify-center text-lg font-medium">
                                                            <Loader2 className="h-8 w-8 animate-spin mr-3 text-blue-500" />
                                                            Loading student data...
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                // Render student rows if data is available
                                                getFilteredStudents().length > 0 ? (
                                                    getFilteredStudents().map((student) => (
                                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors duration-150">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 h-10 w-10">
                                                                        {/* Placeholder for student avatar/initials */}
                                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-sm">
                                                                            {student.name.charAt(0).toUpperCase()}
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                                        <div className="text-xs text-gray-500">{student.email}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {student.email}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-purple-100 text-purple-800">
                                                                    {student.batch?.name || "No Batch"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                                {new Date(student.joiningDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {/* Fee Status Badge with dynamic colors */}
                                                                <span
                                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        (student.feeStatus?.pendingAmount || 0) === 0
                                                                            ? "bg-green-100 text-green-800" // Fully Paid
                                                                            : (student.feeStatus?.paidAmount || 0) === 0
                                                                            ? "bg-red-100 text-red-800" // Unpaid
                                                                            : "bg-yellow-100 text-yellow-800" // Partially Paid
                                                                    }`}
                                                                >
                                                                    {(student.feeStatus?.pendingAmount || 0) === 0
                                                                        ? "Paid"
                                                                        : (student.feeStatus?.paidAmount || 0) === 0
                                                                        ? "Unpaid"
                                                                        : "Partial"}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                                <div className="flex justify-center space-x-2">
                                                                    {/* Edit Button */}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                                                                        title="Edit Student"
                                                                    >
                                                                        <Edit className="h-5 w-5" />
                                                                    </Button>
                                                                    {/* Delete Button */}
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                                                                        title="Delete Student"
                                                                    >
                                                                        <Trash className="h-5 w-5" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    // Display message if no students found after filtering
                                                    <tr>
                                                        <td colSpan={6} className="py-12 text-center text-gray-500">
                                                            <div className="flex flex-col items-center justify-center text-lg">
                                                                <Filter className="h-10 w-10 mb-3 text-gray-400" />
                                                                No students found matching your search criteria.
                                                                <p className="text-sm mt-1">Try adjusting your filters or search query.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* --- */}
                            {/* Pagination and Summary */}
                            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600">
                                {/* Students count summary */}
                                <p>
                                    Showing <span className="font-semibold">{getFilteredStudents().length}</span> of{" "}
                                    <span className="font-semibold">{students.length}</span> students
                                </p>
                                {/* Pagination Controls (currently disabled as per original code) */}
                                <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled // Pagination functionality not implemented in this snippet
                                        className="rounded-md shadow-sm"
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled // Pagination functionality not implemented in this snippet
                                        className="rounded-md shadow-sm"
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
