import mongoose from 'mongoose';

const materialSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Material', materialSchema);
