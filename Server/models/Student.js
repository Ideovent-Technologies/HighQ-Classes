import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  class: { type: String },
  batch: { type: String },
  enrolledCourses: [{ type: String }],
  attendance: [
    {
      date: Date,
      status: { type: String, enum: ["Present", "Absent", "Leave"] },
    },
  ],
  examHistory: [
    {
      subject: String,
      marks: Number,
      date: Date,
    },
  ],
  homework: [{ title: String, description: String, fileUrl: String }],
  notes: [{ title: String, description: String, fileUrl: String }],
  studyResources: [{ title: String, fileUrl: String }],
  profilePic: { type: String },
  password: { type: String, required: true },
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
