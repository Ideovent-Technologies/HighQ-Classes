// models/Course.js
import mongoose from 'mongoose';

const syllabusSchema = new mongoose.Schema({
  topic: String,
  description: String
});

const feeStructureSchema = new mongoose.Schema({
  amount: Number,
  currency: { type: String, default: 'INR' },
  details: String
});

const batchSchema = new mongoose.Schema({
  batchName: { type: String, required: true },
  schedule: {
    days: [String],          // e.g. ['Monday', 'Wednesday']
    time: String             // e.g. '10:00 AM - 12:00 PM'
  },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  startDate: Date,
  endDate: Date,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
});

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  duration: String,        // e.g. '3 months'
  feeStructure: feeStructureSchema,
  syllabus: [syllabusSchema],
  batches: [batchSchema]
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
