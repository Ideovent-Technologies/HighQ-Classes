import { Assignment } from "./types";

export const getAssignmentStatus = (
  assignment: Assignment,
  studentId?: string
) => {
  const now = new Date();
  const dueDate = new Date(assignment.dueDate);
  const studentSubmission = assignment.submissions?.find(
    (sub) => sub.student === studentId
  );

  if (studentSubmission) {
    if (studentSubmission.status === "graded") {
      return { status: "graded", color: "bg-green-100 text-green-800" };
    }
    return { status: "submitted", color: "bg-blue-100 text-blue-800" };
  }

  if (now > dueDate) {
    return { status: "overdue", color: "bg-red-100 text-red-800" };
  }

  return { status: "pending", color: "bg-yellow-100 text-yellow-800" };
};
