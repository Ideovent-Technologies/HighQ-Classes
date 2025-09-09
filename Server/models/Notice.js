import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },

    // Dynamic reference (can point to Admin, Teacher, or Student)
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "postedByModel",
    },
    postedByModel: {
      type: String,
      enum: ["Admin", "Teacher", "Student"], // 👈 allowed models
    },

    targetAudience: {
      type: String,
      enum: ["all", "teachers", "students", "batch"],
      default: "students",
      required: true,
    },
    targetBatchIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    scheduledAt: {
      type: Date,
      default: null,
    },
    isScheduled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

/**
 * 🔧 Auto-fix: ensure postedByModel is always set
 * Based on the User model name (Admin, Teacher, Student)
 */
noticeSchema.pre("save", function (next) {
  if (this.postedBy && !this.postedByModel && this.$__?.ownerDocument?.constructor?.modelName) {
    this.postedByModel = this.$__?.ownerDocument?.constructor?.modelName;
  }
  next();
});

export default mongoose.model("Notice", noticeSchema);
