export interface Recording {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  teacherId: string;
  courseId: {
    _id: string;
    name: string;
  };
  batchId?: {
    _id: string;
    name: string;
  };
  recordingDate: string;
  duration: number; // in seconds
  views?: number;
  status: 'processing' | 'ready' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface RecordingUploadData {
  title: string;
  description?: string;
  courseId: string;
  batchId?: string;
  recordingDate: string;
  duration?: string;
  file: File;
  teacherId: string;
}

export interface RecordingStats {
  totalRecordings: number;
  totalViews: number;
  averageViews: number;
  recentRecordings: Recording[];
}

export interface StudentRecordingView {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  courseId: {
    _id: string;
    name: string;
  };
  teacherId: {
    _id: string;
    name: string;
  };
  recordingDate: string;
  duration: number;
  views?: number;
  createdAt: string;
}
