// batch.types.ts

// A simplified interface for a referenced Course
export interface CourseRef {
  _id: string;
  name: string;
}

// A simplified interface for a referenced Teacher
export interface TeacherRef {
  _id: string;
  name: string;
}

// A simplified interface for a referenced Student
export interface StudentRef {
  _id: string;
  name: string;
}

// ✅ Main Batch Interface
export interface Batch {
  _id: string;
  name: string;
  courseId: string; // References the Course model
  teacherId: string; // References the Teacher model
  students: string[]; // Array of Student IDs
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ✅ Create & Update Data
export interface CreateBatchData {
  name: string;
  courseId: string;
  teacherId: string;
  students?: string[];
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  startDate?: string;
  endDate?: string;
}

export interface UpdateBatchData extends Partial<CreateBatchData> {
  // Additional fields for update operations can be added here
}

// ✅ API Response
export interface BatchApiResponse {
  success: boolean;
  message?: string;
  batch?: Batch;
  batches?: Batch[];
  totalCount?: number;
  currentPage?: number;
  totalPages?: number;
}