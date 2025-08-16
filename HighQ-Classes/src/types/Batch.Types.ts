//  batch.types.ts

export interface CourseRef {
  _id: string;
  name: string;
}

export interface TeacherRef {
  _id: string;
  name: string;
}

export interface StudentRef {
  _id: string;
  name: string;
  email?: string;
}

//  Main Batch Interface
export interface Batch {
  _id: string;
  name: string;
  courseId: CourseRef;
  teacherId: TeacherRef;
  students: StudentRef[];
  schedule?: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  status?: "active" | "inactive" | "completed";
  capacity?: number;
  description?: string;
}

//  Interface for creating/updating batches
export interface CreateBatchData {
  name: string;
  courseId: string;
  teacherId: string;
  students: string[];
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
  };
  startDate: string;
  endDate: string;
  status?: "active" | "inactive" | "completed";
  capacity?: number;
  description?: string;
}
