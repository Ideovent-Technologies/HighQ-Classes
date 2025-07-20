import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    audience: {
      type: String,
      enum: ["all", "batch", "student"],
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    scheduledAt: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          // Prevent scheduling in the past
          return !value || value > new Date();
        },
        message: "Scheduled date must be in the future.",
      },
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Conditional validation based on audience type
noticeSchema.pre("validate", function (next) {
  if (this.audience === "batch" && !this.batch) {
    return next(new Error("Batch ID is required for batch audience"));
  }
  if (this.audience === "student" && (!this.students || this.students.length === 0)) {
    return next(new Error("At least one Student ID is required for student audience"));
  }
  if (this.audience === "all") {
    this.batch = null;
    this.students = [];
  }
  next();
});

export default mongoose.model("Notice", noticeSchema);
