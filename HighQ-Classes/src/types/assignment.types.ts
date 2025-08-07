// Assignment types
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  instructions: string;
  courseId: string;
  batchId: string;
  teacherId: string;
  dueDate: Date;
  totalMarks: number;
  assignmentType: 'homework' | 'project' | 'quiz' | 'exam' | 'practical';
  attachments?: AssignmentAttachment[];
  isPublished: boolean;
  allowLateSubmission: boolean;
  lateSubmissionPenalty?: number; // percentage
  createdAt: Date;
  updatedAt: Date;
  
  // Populated fields
  course?: {
    _id: string;
    courseName: string;
  };
  batch?: {
    _id: string;
    batchName: string;
  };
  teacher?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface AssignmentAttachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface AssignmentSubmission {
  _id: string;
  assignmentId: string;
  studentId: string;
  submissionText?: string;
  attachments?: SubmissionAttachment[];
  submittedAt: Date;
  isLate: boolean;
  grade?: number;
  feedback?: string;
  gradedAt?: Date;
  gradedBy?: string;
  status: 'submitted' | 'graded' | 'returned' | 'late';
  
  // Populated fields
  assignment?: Assignment;
  student?: {
    _id: string;
    name: string;
    email: string;
    rollNumber: string;
  };
  grader?: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface SubmissionAttachment {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

// Form data types
export interface AssignmentFormData {
  title: string;
  description: string;
  instructions: string;
  courseId: string;
  batchId: string;
  dueDate: string;
  totalMarks: number;
  assignmentType: 'homework' | 'project' | 'quiz' | 'exam' | 'practical';
  isPublished: boolean;
  allowLateSubmission: boolean;
  lateSubmissionPenalty?: number;
  attachments?: File[];
}

export interface SubmissionFormData {
  submissionText?: string;
  attachments?: File[];
}

export interface GradingData {
  grade: number;
  feedback: string;
}

// Summary and statistics types
export interface AssignmentSummary {
  assignmentId: string;
  assignmentTitle: string;
  totalStudents: number;
  submittedCount: number;
  pendingCount: number;
  gradedCount: number;
  lateSubmissionCount: number;
  averageGrade?: number;
  dueDate: Date;
  isOverdue: boolean;
}

export interface StudentAssignmentSummary {
  studentId: string;
  studentName: string;
  email: string;
  rollNumber: string;
  totalAssignments: number;
  submittedCount: number;
  pendingCount: number;
  gradedCount: number;
  averageGrade?: number;
  submissionRate: number; // percentage
}

export interface AssignmentStats {
  totalAssignments: number;
  publishedAssignments: number;
  draftAssignments: number;
  overdueAssignments: number;
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingGrading: number;
  averageGradeOverall?: number;
}

// Filter and search types
export interface AssignmentFilters {
  courseId?: string;
  batchId?: string;
  teacherId?: string;
  assignmentType?: string;
  isPublished?: boolean;
  dateFrom?: string;
  dateTo?: string;
  status?: 'all' | 'published' | 'draft' | 'overdue';
}

export interface SubmissionFilters {
  assignmentId?: string;
  studentId?: string;
  status?: 'all' | 'submitted' | 'graded' | 'pending' | 'late';
  submittedFrom?: string;
  submittedTo?: string;
  isLate?: boolean;
}

// Bulk operations
export interface BulkGradingData {
  submissions: {
    submissionId: string;
    grade: number;
    feedback?: string;
  }[];
}

export interface BulkAssignmentAction {
  assignmentIds: string[];
  action: 'publish' | 'unpublish' | 'delete' | 'duplicate';
}

// Dashboard data
export interface AssignmentDashboardData {
  stats: AssignmentStats;
  recentAssignments: Assignment[];
  pendingGrading: AssignmentSubmission[];
  overdueAssignments: Assignment[];
  upcomingDeadlines: Assignment[];
}

export interface StudentAssignmentDashboard {
  stats: {
    totalAssignments: number;
    submittedCount: number;
    pendingCount: number;
    gradedCount: number;
    averageGrade?: number;
  };
  upcomingAssignments: Assignment[];
  recentSubmissions: AssignmentSubmission[];
  gradedAssignments: AssignmentSubmission[];
}

// API Response types
export interface AssignmentResponse {
  success: boolean;
  message: string;
  data?: Assignment;
}

export interface AssignmentsResponse {
  success: boolean;
  message: string;
  data?: {
    assignments: Assignment[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: AssignmentSubmission;
}

export interface SubmissionsResponse {
  success: boolean;
  message: string;
  data?: {
    submissions: AssignmentSubmission[];
    pagination: {
      total: number;
      page: number;
      pages: number;
      limit: number;
    };
  };
}
