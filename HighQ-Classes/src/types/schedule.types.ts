export interface Schedule {
  _id: string;
  batchId: { _id: string; name: string };
  teacherId: { _id: string; name: string };
  courseId: { _id: string; name: string };
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface ScheduleFormData {
  teacherId: string;
  batchId: string;
  courseId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}
