import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AssignmentFilters from "./AssignmentFilters";
import AssignmentCard from "./AssignmentCard";
import SubmissionModal from "./SubmissionModal";
import { Assignment, ApiResponse } from "./types";
import { getAssignmentStatus } from "./StatusUtils";

const StudentAssignments: React.FC = () => {
  const { state } = useAuth();
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
      } else throw new Error(data.message || "Failed to fetch assignments");
    } catch (err: any) {
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!submissionModal || !file) {
      setError("Please select a file to submit");
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
        await fetchAssignments();
        setSubmissionModal(null);
        setFile(null);
        setRemarks("");
        setError("Assignment submitted successfully!");
        setTimeout(() => setError(null), 3000);
      } else throw new Error(data.message || "Failed to submit assignment");
    } catch (err: any) {
      setError(err.message || "Failed to submit assignment");
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
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Assignments</h1>
            <p className="text-gray-600">View and submit your assignments</p>
          </div>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {assignments.length} Total Assignments
        </Badge>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className={error.includes("successfully") ? "border-green-500" : ""}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters + Assignment Grid */}
      <AssignmentFilters filterStatus={filterStatus} setFilterStatus={setFilterStatus}>
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Assignments Found</h3>
            <p className="text-gray-600">
              {filterStatus === "all"
                ? "No assignments have been assigned yet."
                : `No ${filterStatus} assignments found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          onClose={() => setSubmissionModal(null)}
          onSubmit={handleSubmitAssignment}
        />
      )}
    </div>
  );
};

export default StudentAssignments;
