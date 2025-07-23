import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    startTime: {
      type: String, // e.g., "10:00 AM"
      required: true,
    },
    endTime: {
      type: String, // e.g., "11:00 AM"
      required: true,
    },
    room: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Schedule", scheduleSchema);
