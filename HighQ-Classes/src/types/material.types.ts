// /src/types/material.types.ts

// Import the correct type directly from the axios library
import { AxiosProgressEvent } from 'axios'; 


interface UploadedBy {
  _id: string;
  name: string;
  role: 'teacher' | 'admin';
}
interface PopulatedCourse {
  _id: string;
  name: string;
}
interface PopulatedBatch {
  _id: string;
  name: string;
}
interface MaterialView {
  user: string;
  viewedAt: string;
}
export interface Material {
  _id:string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: UploadedBy;
  batchIds: PopulatedBatch[];
  courseId: PopulatedCourse;
  viewedBy: MaterialView[];
  category?: 'lecture' | 'assignment' | 'reference' | 'exam';
  views?: number;
  createdAt: string;
  updatedAt: string;
}
export interface MaterialUploadData {
  title: string;
  description: string;
  courseId: string;
  batchIds: string[];
  file: File;
  category: 'lecture' | 'assignment' | 'reference' | 'exam';
}


export type UploadProgressCallback = (progressEvent: AxiosProgressEvent) => void;