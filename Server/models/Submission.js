import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment", required: true },
  fileUrl: { type: String }, // URL or path to the submitted file
  submittedAt: { type: Date, default: Date.now },
  grade: { type: Number },
  status: {
    type: String,
    enum: ["Pending", "Graded", "Late"],
    default: "Pending",
  },
});

const Submission = mongoose.model("Submission", submissionSchema);
export default Submission;
