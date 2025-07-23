// models/Student.js
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    phone: {
      type: String
    },
    profilePicture: {
      type: String // ✅ changed from profilePic to match controller
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    dateOfBirth: {
      type: Date
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch"
    },
    class: {
      type: String
    },
    attendance: [
      {
        date: Date,
        status: {
          type: String,
          enum: ["present", "absent", "leave"]
        }
      }
    ],
    examHistory: [
      {
        examTitle: String,
        score: Number,
        total: Number,
        date: Date
      }
    ],
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],
    paymentHistory: [
      {
        amount: Number,
        date: Date,
        method: String,
        note: String
      }
    ],
    resources: [
      {
        title: String,
        fileUrl: String,
        uploadedAt: Date,
        batch: String
      }
    ],
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
