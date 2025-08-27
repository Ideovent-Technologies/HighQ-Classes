export interface Assignment {
  _id: string;
  name: string;
  description: string;
  subject: string;
  batch: {
    _id: string;
    name: string;
  };
  course: {
    _id: string;
    name: string;
  };
  attachments: string[];
  dueDate: string;
  totalMarks: number;
  instructions: string;
  teacher: {
    _id: string;
    name: string;
  };
  createdAt: string;
  isActive: boolean;
  submissions?: AssignmentSubmission[];
}

export interface AssignmentSubmission {
  _id: string;
  student: string;
  assignment: string;
  submissionFile: string;
  submittedAt: string;
  remarks?: string;
  status: "submitted" | "graded" | "late";
  marks?: number;
  feedback?: string;
  gradedAt?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  assignments?: Assignment[];
  assignment?: Assignment;
  submission?: AssignmentSubmission;
}
