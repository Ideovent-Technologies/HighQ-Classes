import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, GraduationCap, XCircle, CheckCircle, Sparkles, User } from "lucide-react"; // Added User import
import { useAuth } from "@/hooks/useAuth";
import AssignmentFilters from "./AssignmentFilters"; // Assuming this component has been updated for better UI
import AssignmentCard from "./AssignmentCard"; // Assuming this component has been updated for better UI
import SubmissionModal from "./SubmissionModal"; // Assuming this component has been updated for better UI
import { Assignment, ApiResponse } from "./types";
import { getAssignmentStatus } from "./StatusUtils";
import { Card, CardContent } from "@/components/ui/card"; // Added CardContent import

const StudentAssignments: React.FC = () => {
  const { state } = useAuth();
  const studentName = state.user?.name?.split(" ")[0] || "Student"; // Get first name or default
  
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionModal, setSubmissionModal] = useState<Assignment | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/assignments`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data: ApiResponse = await response.json();
      if (data.success && data.assignments) {
        setAssignments(data.assignments);
      } else {
        throw new Error(data.message || "Failed to fetch assignments");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionModal || !file) {
      setError("Please select a file to submit");
      // Clear error after a short delay for better UX
      setTimeout(() => setError(null), 3000); 
      return;
    }
    try {
      setSubmitting(true);
      setError(null);
      const formData = new FormData();
      formData.append("file", file);
      if (remarks) formData.append("remarks", remarks);

      const token = localStorage.getItem("authToken");
      const response = await fetch(`/api/assignments/${submissionModal._id}/submit`, {
        method: "POST",
        credentials: "include",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data: ApiResponse = await response.json();
      if (data.success) {
        await fetchAssignments(); // Re-fetch assignments to update submission status
        setSubmissionModal(null);
        setFile(null);
        setRemarks("");
        setError("Assignment submitted successfully! 🎉");
        setTimeout(() => setError(null), 3000);
      } else {
        throw new Error(data.message || "Failed to submit assignment");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit assignment");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filterStatus === "all") return true;
    const { status } = getAssignmentStatus(assignment, state.user?._id);
    return status === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="flex flex-col items-center p-8 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600 mb-6"></div>
          <p className="text-xl font-semibold text-gray-700">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  // Handle case where user is not logged in as a student
  if (!state.user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
        <Card className="max-w-md w-full p-6 sm:p-8 text-center bg-white text-gray-800 rounded-xl shadow-lg">
          <CardContent className="space-y-4">
            <User className="h-14 w-14 sm:h-16 sm:w-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold">
              Authentication Required
            </h3>
            <p className="text-sm sm:text-base text-gray-600">
              Please log in as a student to view your assignments.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-10 space-y-10 bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800">
            Hello, {studentName}!
            <Sparkles className="inline h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ml-2 text-yellow-500" />
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
            Here's a quick overview of your academic tasks.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-blue-400 text-blue-600 bg-blue-50 font-semibold">
            <GraduationCap className="h-4 w-4 mr-1.5" />
            <span className="font-bold mr-1">{assignments.length}</span> Total Assignments
          </Badge>
          <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-green-400 text-green-600 bg-green-50 font-semibold">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            <span className="font-bold mr-1">
              {assignments.filter(a => getAssignmentStatus(a, state.user?._id).status === 'submitted' || getAssignmentStatus(a, state.user?._id).status === 'graded').length}
            </span> Submitted
          </Badge>
          <Badge className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 border-orange-400 text-orange-600 bg-orange-50 font-semibold">
            <FileText className="h-4 w-4 mr-1.5" />
            <span className="font-bold mr-1">
              {assignments.filter(a => getAssignmentStatus(a, state.user?._id).status === 'pending' || getAssignmentStatus(a, state.user?._id).status === 'overdue').length}
            </span> Pending/Overdue
          </Badge>
        </div>
      </div>

      {/* Error/Success Alert */}
      {error && (
        <Alert
          className={`border ${
            error.includes("successfully") ? "border-green-500 bg-green-50 text-green-700" : "border-red-500 bg-red-50 text-red-700"
          } rounded-lg`}
        >
          {error.includes("successfully") ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <AlertTitle className="font-bold text-base">
            {error.includes("successfully") ? "Success!" : "Heads Up!"}
          </AlertTitle>
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters + Assignment Grid */}
      <AssignmentFilters filterStatus={filterStatus} setFilterStatus={setFilterStatus}>
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-lg shadow-md border border-gray-200">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Assignments Found
            </h3>
            <p className="text-gray-500 text-base">
              {filterStatus === "all"
                ? "It looks like you don't have any assignments yet. Keep up the good work!"
                : `No ${filterStatus} assignments match your filter. Try adjusting the filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment._id}
                assignment={assignment}
                studentId={state.user?._id}
                openSubmissionModal={setSubmissionModal}
              />
            ))}
          </div>
        )}
      </AssignmentFilters>

      {/* Submission Modal */}
      {submissionModal && (
        <SubmissionModal
          assignment={submissionModal}
          file={file}
          remarks={remarks}
          setFile={setFile}
          setRemarks={setRemarks}
          submitting={submitting}
          onClose={() => {
            setSubmissionModal(null);
            setFile(null); // Clear file when modal closes
            setRemarks(""); // Clear remarks when modal closes
          }}
          onSubmit={handleSubmitAssignment}
        />
      )}
    </div>
  );
};

export default StudentAssignments;
