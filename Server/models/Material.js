import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  uploadedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // For engagement
  downloadCount: { type: Number, default: 0 } // For engagement
});

export default mongoose.model("Material", materialSchema);
