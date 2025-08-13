
import mongoose from 'mongoose';


const batchSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' }
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

  batches: [batchSchema] //  Now this will match your populate call
}, { timestamps: true });
const Course = mongoose.model('Course', courseSchema);
export default Course;