// models/Student.js
import mongoose from "mongoose";

/**
 * Student Schema - Extended profile information for users with role='student'
 * Links to User model via user field
 */
const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"]
    },
    dateOfBirth: {
      type: Date
    },
    parentName: {
      type: String
    },
    parentContact: {
      type: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch"
    },
    courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    }],
    grade: {
      type: String
    },
    schoolName: {
      type: String
    },
    joinDate: {
      type: Date,
      default: Date.now
    },
    attendance: [
      {
        date: Date,
        status: {
          type: String,
          enum: ["present", "absent", "leave"]
        },
        batch: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Batch"
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
  
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
