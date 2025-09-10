import { Batch } from "../API/services/admin/batches.service";

export interface CourseTopic {
  title: string;
  description?: string;
  order?: number;
}

export interface Course {
  _id: string;
  name: string;
  description?: string;
  duration: string;   // or number, depending on backend
  fee: number;
  topics?: CourseTopic[];
  batches?: Batch[];
  createdAt?: string; // ISO date string from backend
  updatedAt?: string;
}
