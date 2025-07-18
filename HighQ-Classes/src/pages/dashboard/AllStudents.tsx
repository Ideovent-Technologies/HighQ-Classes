
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, Edit, Trash, User, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AllStudents = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [batchFilter, setBatchFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

  // Sample students data
  const studentsData = [
    {
      id: 1,
      name: "Ananya Sharma",
      admissionId: "STU001",
      batch: "Physics Batch A",
      joiningDate: "2023-01-15",
      feeStatus: {
        totalFee: 12000,
        paidAmount: 12000,
        pendingAmount: 0,
      },
    },
    {
      id: 2,
      name: "Rahul Patel",
      admissionId: "STU002",
      batch: "Chemistry Batch B",
      joiningDate: "2023-02-10",
      feeStatus: {
        totalFee: 12000,
        paidAmount: 8000,
        pendingAmount: 4000,
      },
    },
    {
      id: 3,
      name: "Priya Singh",
      admissionId: "STU003",
      batch: "Mathematics Batch A",
      joiningDate: "2023-01-05",
      feeStatus: {
        totalFee: 12000,
        paidAmount: 6000,
        pendingAmount: 6000,
      },
    },
    {
      id: 4,
      name: "Amit Kumar",
      admissionId: "STU004",
      batch: "Physics Batch A",
      joiningDate: "2023-01-20",
      feeStatus: {
        totalFee: 12000,
        paidAmount: 12000,
        pendingAmount: 0,
      },
    },
    {
      id: 5,
      name: "Neha Gupta",
      admissionId: "STU005",
      batch: "Chemistry Batch B",
      joiningDate: "2023-02-15",
      feeStatus: {
        totalFee: 12000,
        paidAmount: 0,
        pendingAmount: 12000,
      },
    },
  ];

  // Filter and sort students
  const getFilteredStudents = () => {
    let filtered = [...studentsData];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.admissionId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "paid") {
        filtered = filtered.filter((student) => student.feeStatus.pendingAmount === 0);
      } else if (statusFilter === "pending") {
        filtered = filtered.filter((student) => student.feeStatus.pendingAmount > 0);
      } else if (statusFilter === "unpaid") {
        filtered = filtered.filter((student) => student.feeStatus.paidAmount === 0);
      }
    }

    // Apply batch filter
    if (batchFilter !== "all") {
      filtered = filtered.filter((student) => student.batch === batchFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortConfig.key === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortConfig.key === "joiningDate") {
        comparison = new Date(a.joiningDate).getTime() - new Date(b.joiningDate).getTime();
      } else if (sortConfig.key === "pendingAmount") {
        comparison = a.feeStatus.pendingAmount - b.feeStatus.pendingAmount;
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
  const batches = Array.from(new Set(studentsData.map((student) => student.batch)));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">All Students</h1>
          <p className="text-gray-600">Manage and view all students information</p>
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
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-40">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Fee Status" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Fully Paid</SelectItem>
                        <SelectItem value="pending">Partially Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full sm:w-48">
                    <Select value={batchFilter} onValueChange={setBatchFilter}>
                      <SelectTrigger>
                        <div className="flex items-center">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="All Batches" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        {batches.map((batch) => (
                          <SelectItem key={batch} value={batch}>
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
                            onClick={() => requestSort("name")}
                          >
                            Student Name
                            {sortConfig.key === "name" ? (
                              sortConfig.direction === "asc" ? (
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
                          Admission ID
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                          Batch
                        </th>
                        <th className="py-3 px-4 text-left font-medium text-gray-600">
                          <button
                            className="flex items-center"
                            onClick={() => requestSort("joiningDate")}
                          >
                            Joining Date
                            {sortConfig.key === "joiningDate" ? (
                              sortConfig.direction === "asc" ? (
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
                            onClick={() => requestSort("pendingAmount")}
                          >
                            Fee Status
                            {sortConfig.key === "pendingAmount" ? (
                              sortConfig.direction === "asc" ? (
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
                      {getFilteredStudents().length > 0 ? (
                        getFilteredStudents().map((student) => (
                          <tr key={student.id} className="border-t">
                            <td className="py-4 px-4">{student.name}</td>
                            <td className="py-4 px-4">{student.admissionId}</td>
                            <td className="py-4 px-4">{student.batch}</td>
                            <td className="py-4 px-4">
                              {new Date(student.joiningDate).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div
                                  className={`h-2.5 w-2.5 rounded-full mr-2 ${
                                    student.feeStatus.pendingAmount === 0
                                      ? "bg-green-500"
                                      : student.feeStatus.paidAmount === 0
                                      ? "bg-red-500"
                                      : "bg-yellow-500"
                                  }`}
                                ></div>
                                <span>
                                  {student.feeStatus.pendingAmount === 0
                                    ? "Paid"
                                    : student.feeStatus.paidAmount === 0
                                    ? "Unpaid"
                                    : "Partial"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex justify-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500">
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-gray-500">
                            No students found matching your search criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {getFilteredStudents().length} of {studentsData.length} students
                </p>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled>
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
