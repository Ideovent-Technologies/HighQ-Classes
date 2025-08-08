// Topic structure used in courses
export interface CourseTopic {
  title: string;
  description?: string;
  order?: number;
}

// Main Course interface
export interface Course {
  _id: string;
  name: string;
  description?: string;
  duration: string;
  fee: number;
  topics?: CourseTopic[];
  batches?: any[];
  createdAt?: string;
  updatedAt?: string;
}
