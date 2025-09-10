// src/types/notice.types.ts

export interface PostedBy {
  _id: string;
  name: string;
  role: "admin" | "teacher" | "student";
}

export interface Notice {
  _id: string;
  title: string;
  description: string;
  postedBy: PostedBy; // FIXED: now matches API object
  targetAudience: "all" | "teachers" | "students" | "batch";
  targetBatchIds?: string[];
  isActive: boolean;
  isScheduled: boolean;
  scheduledAt?: string | null; // Keep string if API returns ISO string
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeDto {
  title: string;
  description: string;
  targetAudience: "all" | "teachers" | "students" | "batch";
  targetBatchIds?: string[];
  isActive?: boolean;
  isScheduled?: boolean;
  scheduledAt?: string | null;
  isImportant?: boolean;
}

export interface UpdateNoticeDto extends Partial<CreateNoticeDto> {}
