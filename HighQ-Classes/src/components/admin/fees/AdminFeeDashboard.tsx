import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import FeeCard from "@/modules/fees/FeeCard";
import CreateFeeForm from "./CreateFeeForm";
import BulkFeeForm from "./BulkFeeForm";
import PaymentForm from "./PaymentForm";
import {
  Plus,
  Users,
  Wallet,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";

interface Fee {
  _id: string;
  month: string;
  status: string;
  amount: number;
  student?: { name: string; email: string };
  course?: { name: string };
  batch?: { name: string };
}

type Tab = "dashboard" | "all" | "paid" | "pending";

const AdminFeeDashboard: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateFee, setShowCreateFee] = useState(false);
  const [showBulkFee, setShowBulkFee] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [filter, setFilter] = useState({ course: "", batch: "" });
  const [courses, setCourses] = useState<string[]>([]);
  const [batches, setBatches] = useState<string[]>([]);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/fees");
      const fetchedFees = res.data.data?.fees || [];
      setFees(fetchedFees);

      // Extract unique courses and batches for filters
      const uniqueCourses = [
        ...new Set(
          fetchedFees
            .map((fee: Fee) => fee.course?.name)
            .filter(Boolean) as string[]
        ),
      ];
      const uniqueBatches = [
        ...new Set(
          fetchedFees
            .map((fee: Fee) => fee.batch?.name)
            .filter(Boolean) as string[]
        ),
      ];
      setCourses(uniqueCourses);
      setBatches(uniqueBatches);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = (fee: Fee) => {
    setSelectedFee(fee);
    setShowPayment(true);
  };

  const filteredFees = useMemo(() => {
    return fees.filter((fee) => {
      const matchesStatus =
        activeTab === "all" || fee.status.toLowerCase() === activeTab;
      const matchesCourse =
        !filter.course || fee.course?.name === filter.course;
      const matchesBatch = !filter.batch || fee.batch?.name === filter.batch;
      return matchesStatus && matchesCourse && matchesBatch;
    });
  }, [fees, activeTab, filter]);

  const stats = useMemo(() => {
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const totalFees = fees.length;
    const paidFees = fees.filter(
      (fee) => fee.status.toLowerCase() === "paid"
    ).length;
    const pendingFees = fees.filter(
      (fee) => fee.status.toLowerCase() === "pending"
    ).length;
    const paidAmount = fees
      .filter((fee) => fee.status.toLowerCase() === "paid")
      .reduce((sum, fee) => sum + fee.amount, 0);
    const pendingAmount = fees
      .filter((fee) => fee.status.toLowerCase() === "pending")
      .reduce((sum, fee) => sum + fee.amount, 0);

    return {
      totalAmount,
      totalFees,
      paidFees,
      pendingFees,
      paidAmount,
      pendingAmount,
    };
  }, [fees]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <svg
            className="w-16 h-16 text-blue-500 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading fees...
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-xl shadow-lg border border-red-200">
          <p className="text-xl font-semibold text-red-600">
            Oops, something went wrong!
          </p>
          <p className="mt-2 text-gray-600">Error: {error}</p>
          <p className="mt-4 text-sm text-gray-500">
            Please try refreshing the page or contact support.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
          <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Fee Dashboard
          </span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowCreateFee(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Fee</span>
          </button>
          <button
            onClick={() => setShowBulkFee(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <Users className="w-5 h-5" />
            <span>Add Bulk Fees</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 flex items-center gap-2 font-semibold text-sm transition-all duration-300 ${
            activeTab === "dashboard"
              ? "border-b-2 border-purple-600 text-purple-600"
              : "text-gray-500 hover:text-purple-500"
          }`}
        >
          <Wallet className="w-4 h-4" /> Statistics
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 flex items-center gap-2 font-semibold text-sm transition-all duration-300 ${
            activeTab === "all"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          <Wallet className="w-4 h-4" /> All Fees
        </button>
        <button
          onClick={() => setActiveTab("paid")}
          className={`px-4 py-2 flex items-center gap-2 font-semibold text-sm transition-all duration-300 ${
            activeTab === "paid"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-500 hover:text-green-500"
          }`}
        >
          <CheckCircle className="w-4 h-4" /> Paid
        </button>
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 flex items-center gap-2 font-semibold text-sm transition-all duration-300 ${
            activeTab === "pending"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500 hover:text-red-500"
          }`}
        >
          <Clock className="w-4 h-4" /> Pending
        </button>
      </div>

      {/* Main Content Area */}
      {fees.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-white rounded-2xl shadow-xl border border-dashed border-gray-300">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              No Fees Found
            </h3>
            <p className="mt-1 text-gray-600">
              It looks like you haven't created any fees yet.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateFee(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Create First Fee
              </button>
            </div>
          </div>
        </div>
      ) : activeTab === "dashboard" ? (
        // Dashboard Tab
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">Total Fees</p>
              <Wallet className="w-6 h-6 text-blue-500" />
            </div>
            <p className="mt-4 text-4xl font-extrabold text-blue-600">
              {stats.totalFees}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Total fee records created
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-green-200">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">Paid Fees</p>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <p className="mt-4 text-4xl font-extrabold text-green-600">
              {stats.paidFees}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Amount Collected: ₹{stats.paidAmount}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-red-200">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">Pending Fees</p>
              <Clock className="w-6 h-6 text-red-500" />
            </div>
            <p className="mt-4 text-4xl font-extrabold text-red-600">
              {stats.pendingFees}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Amount Due: ₹{stats.pendingAmount}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-yellow-200">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-gray-900">Total Revenue</p>
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white">
                $
              </div>
            </div>
            <p className="mt-4 text-4xl font-extrabold text-yellow-600">
              ₹{stats.totalAmount}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Total amount recorded
            </p>
          </div>
        </div>
      ) : (
        // Detailed Fee List Tabs
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center">
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={filter.course}
                onChange={(e) =>
                  setFilter({ ...filter, course: e.target.value })
                }
                className="block w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Courses</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={filter.batch}
                onChange={(e) =>
                  setFilter({ ...filter, batch: e.target.value })
                }
                className="block w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Batches</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredFees.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">No fees found for this filter.</p>
              <p className="text-sm">Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredFees.map((fee) => (
                <div
                  key={fee._id}
                  onClick={() => handleRecordPayment(fee)}
                  className="cursor-pointer bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-200"
                >
                  <FeeCard
                    month={fee.month}
                    status={fee.status}
                    amount={fee.amount}
                  />
                  <div className="mt-4 text-sm font-medium text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold text-gray-900">
                        Student:
                      </span>{" "}
                      {fee.student?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        Batch:
                      </span>{" "}
                      {fee.batch?.name || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        Course:
                      </span>{" "}
                      {fee.course?.name || "N/A"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateFee && (
        <CreateFeeForm
          onClose={() => setShowCreateFee(false)}
          onSuccess={fetchFees}
        />
      )}
      {showBulkFee && (
        <BulkFeeForm
          onClose={() => setShowBulkFee(false)}
          onSuccess={fetchFees}
        />
      )}
      {showPayment && selectedFee && (
        <PaymentForm
          feeId={selectedFee?._id}
          onClose={() => setShowPayment(false)}
          onSuccess={fetchFees}
        />
      )}
    </div>
  );
};

export default AdminFeeDashboard;