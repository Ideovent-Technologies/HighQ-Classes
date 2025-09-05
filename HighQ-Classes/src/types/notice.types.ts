// src/types/notice.types.ts
export interface Notice {
  _id: string;
  title: string;
  description: string;
  postedBy: string; // User ID
  targetAudience: "all" | "teachers" | "students" | "batch";
  targetBatchIds?: string[];
  isActive: boolean;
  scheduledAt?: string | null;
  isScheduled: boolean;
  isImportant: boolean; // FIX: Added the missing property
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoticeDto {
  title: string;
  description: string;
  targetAudience: "all" | "teachers" | "students" | "batch";
  targetBatchIds?: string[];
  isActive?: boolean;
  scheduledAt?: string | null;
  isScheduled?: boolean;
  isImportant?: boolean; // You may also need this for creating notices
}

export interface UpdateNoticeDto extends Partial<CreateNoticeDto> {}