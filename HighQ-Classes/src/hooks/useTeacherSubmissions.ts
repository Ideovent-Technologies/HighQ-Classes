import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

// Assuming these interfaces from your other hooks/files
interface Assignment {
  _id: string;
  title: string;
  dueDate: string;
}

interface Student {
  _id: string;
  name: string;
  email?: string;
}

interface Submission {
  _id: string;
  assignment: Assignment;
  student: Student;
  fileUrl: string;
  submittedAt: string;
  grade?: number;
  status?: string;
}

// Interface for submitting a new assignment
interface SubmitAssignmentData {
  assignmentId: string;
  file: File;
}

// Interface for grading a submission
interface GradeSubmissionData {
  grade: number;
  status: string;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetches all submissions for a specific teacher's assignments
  const fetchSubmissionsByTeacher = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/submissions/teacher/submissions", {
        withCredentials: true,
      });
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      console.error("❌ Error fetching teacher submissions:", err);
      setError(
        err.response?.data?.message || "Failed to fetch teacher submissions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetches submissions for a specific assignment
  const fetchSubmissionsByAssignment = useCallback(
    async (assignmentId: string) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `/api/assignments/${assignmentId}/submissions`,
          {
            withCredentials: true,
          }
        );
        setSubmissions(data.submissions || []);
      } catch (err: any) {
        console.error(
          `❌ Error fetching submissions for assignment ${assignmentId}:`,
          err
        );
        setError(
          err.response?.data?.message || "Failed to fetch submissions for assignment."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Submits a new assignment.
  // Note: This assumes the backend endpoint handles a file upload via FormData
  const submitAssignment = useCallback(
    async (submissionData: SubmitAssignmentData) => {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("assignmentId", submissionData.assignmentId);
      formData.append("file", submissionData.file);

      try {
        const { data } = await axios.post(
          `/api/submissions`,
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (data.message) {
          toast({ title: data.message });
        }
        setLoading(false);
        return { success: true, submission: data.data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to submit assignment";
        setError(errorMessage);
        toast({ title: errorMessage, variant: "destructive" });
        setLoading(false);
        return { success: false };
      }
    },
    []
  );

  // Grades a specific submission
  const gradeSubmission = useCallback(
    async (submissionId: string, gradeData: GradeSubmissionData) => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.put(
          `/api/submissions/${submissionId}/grade`,
          gradeData,
          {
            withCredentials: true,
          }
        );

        // Update the local state with the graded submission
        setSubmissions((prev) =>
          prev.map((sub) =>
            sub._id === submissionId ? { ...sub, ...data.data } : sub
          )
        );
        toast({ title: data.message });
        setLoading(false);
        return { success: true, submission: data.data };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Failed to grade submission";
        setError(errorMessage);
        toast({ title: errorMessage, variant: "destructive" });
        setLoading(false);
        return { success: false };
      }
    },
    []
  );

  return {
    submissions,
    loading,
    error,
    fetchSubmissionsByTeacher,
    fetchSubmissionsByAssignment,
    submitAssignment,
    gradeSubmission,
  };
};
