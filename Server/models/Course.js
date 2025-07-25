import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  order: Number
}, { _id: false });

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: String,
  duration: { type: String, required: true },
  fee: { type: Number, required: true, min: 0 },
  topics: [topicSchema] // New: course syllabus/topics/sessions
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
