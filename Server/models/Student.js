// models/Student.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave'], required: true }
});

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  method: { type: String, required: true },  // e.g. 'Cash', 'Online'
  note: String
});

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  batch: String // Or reference batch if you want to relate to batches.
});

const studentSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  class: String,
  batch: String,
  profilePicture: String,
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  attendance: [attendanceSchema],
  paymentHistory: [paymentSchema],
  resources: [resourceSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('Student', studentSchema);
