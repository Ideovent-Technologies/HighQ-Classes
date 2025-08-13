export interface SupportTicket {
  _id: string;
  userId: string; // user ID from backend
  name: string;
  email: string;
  role: "student" | "teacher" | "other";
  subject: string;
  message: string;
  fileUrl?: string; // Cloudinary URL or local path
  fileName?: string;
  status: "pending" | "in_progress" | "resolved";
  createdAt: string; // ISO date string
}