// models/SupportTicket.js
import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "other"], required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  fileUrl: { type: String },          // link to cloudinary or stored path
  fileName: { type: String },
  status: { type: String, default: "pending" }, // pending, in_progress, resolved
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("SupportTicket", supportTicketSchema);
