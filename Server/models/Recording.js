import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema({
  title: String,
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  videoUrl: String,
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  accessExpires: Date,
  views: [{
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    viewedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.model("Recording", recordingSchema);
