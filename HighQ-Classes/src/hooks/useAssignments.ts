import { useState, useEffect, useCallback } from "react";
import axios from "axios";

// Defines the shape for a Course object.
interface Course {
  _id: string;
  name: string;
}

// Defines the shape for a Batch object.
interface Batch {
  _id: string;
  name: string;
}

// Defines the structure for an Assignment, now including a full Course and Batch object.
interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalMarks?: number;
  status?: string;
  fileUrl?: string;
  course: Course;
  batch: Batch;
  createdAt?: string;
  updatedAt?: string;
}

// Defines the structure for a Submission.
interface Submission {
  _id: string;
  assignmentId: string;
  student: {
    _id: string;
    name: string;
    email?: string;
  };
  fileUrl?: string;
  submittedAt: string;
  grade?: number;
  status?: string; // e.g., "graded", "pending"
}

// Defines the data structure for creating a new assignment.
interface CreateAssignmentData {
  title: string;
  description?: string;
  dueDate: string;
  totalMarks?: number;
  courseId: string;
  batchId: string;
  file?: File | null;
}

export const useAssignments = () => {
  // State to hold the assignments, courses, and batches.
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [assignedBatches, setAssignedBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing submissions, keyed by assignment ID.
  const [submissionsByAssignment, setSubmissionsByAssignment] = useState<
    Record<string, Submission[]>
  >({});

  // State for all submissions for a teacher's assignments.
  const [teacherSubmissions, setTeacherSubmissions] = useState<Submission[]>(
    []
  );
  const [teacherSubmissionsLoading, setTeacherSubmissionsLoading] =
    useState(false);
  const [teacherSubmissionsError, setTeacherSubmissionsError] = useState<
    string | null
  >(null);

  // Fetches the teacher's profile, including assigned courses and batches.
  const fetchTeacherProfile = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/teacher/profile", {
        withCredentials: true,
      });
      setAssignedCourses(data?.teacher?.courses || []);
      setAssignedBatches(data?.teacher?.batches || []);
    } catch (err: any) {
      console.error("❌ Error fetching teacher profile:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load assigned courses and batches."
      );
    }
  }, []);

  // Fetches all assignments.
  const fetchAssignments = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/assignments", {
        withCredentials: true,
      });
      setAssignments(data?.assignments || []);
    } catch (err: any) {
      console.error("❌ Error fetching assignments:", err);
      setError(err.response?.data?.message || "Failed to fetch assignments.");
    }
  }, []);

  // Fetches submissions for a specific assignment.
  const fetchSubmissionsForAssignment = useCallback(
  async (assignmentId: string) => {
    try {
      const { data } = await axios.get(
        `/api/assignments/${assignmentId}/submissions`,
        { withCredentials: true }
      );
      setSubmissionsByAssignment((prev) => ({
        ...prev,
        [assignmentId]: data.submissions || [],
      }));
    } catch (err: any) {
      console.error(
        `❌ Error fetching submissions for assignment ${assignmentId}:`,
        err
      );
      setError(err.response?.data?.message || "Failed to fetch submissions.");
    }
  },
  []
);


  // Fetches all submissions for all of the teacher's assignments.
 const fetchTeacherSubmissions = useCallback(async () => {
  setTeacherSubmissionsLoading(true);
  setTeacherSubmissionsError(null);
  try {
   const { data } = await axios.get("/api/submissions/teacher/submissions", { withCredentials: true });

    setTeacherSubmissions(data.submissions || []);
  } catch (err: any) {
    console.error("❌ Error fetching teacher submissions:", err);
    setTeacherSubmissionsError(
      err.response?.data?.message || "Failed to fetch teacher submissions."
    );
  } finally {
    setTeacherSubmissionsLoading(false);
  }
}, []);

  // Creates a new assignment using FormData to handle file uploads.
  const createAssignment = useCallback(
    async (assignmentData: CreateAssignmentData) => {
      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", assignmentData.title);
        if (assignmentData.description)
          formData.append("description", assignmentData.description);
        formData.append("dueDate", assignmentData.dueDate);
        formData.append("courseId", assignmentData.courseId);
        formData.append("batchId", assignmentData.batchId);
        if (assignmentData.totalMarks !== undefined)
          formData.append("totalMarks", assignmentData.totalMarks.toString());
        if (assignmentData.file) formData.append("file", assignmentData.file);

        const { data } = await axios.post("/api/assignments", formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (data.success) {
          setAssignments((prev) => [data.assignment, ...prev]);
          return { success: true, assignment: data.assignment };
        } else {
          setError("Failed to create assignment");
          return { success: false };
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to create assignment"
        );
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Deletes a specific assignment by ID.
  const deleteAssignment = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.delete(`/api/assignments/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        setAssignments((prev) => prev.filter((a) => a._id !== id));
        setSubmissionsByAssignment((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
        return { success: true };
      } else {
        setError("Failed to delete assignment");
        return { success: false };
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to delete assignment"
      );
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data load when the component mounts.
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchTeacherProfile(), fetchAssignments()]);
      } catch {
        setError("An unexpected error occurred during initial load.");
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, [fetchTeacherProfile, fetchAssignments]);

  // The returned object provides all the state and functions for the component to use.
  return {
    assignments,
    assignedCourses,
    assignedBatches,
    loading,
    error,
    fetchAssignments,
    createAssignment,
    deleteAssignment,
    submissionsByAssignment,
    fetchSubmissionsForAssignment,

    // New exports for teacher submissions
    teacherSubmissions,
    teacherSubmissionsLoading,
    teacherSubmissionsError,
    fetchTeacherSubmissions,
  };
};
