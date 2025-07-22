import mongoose from 'mongoose';

const recordingSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Recording', recordingSchema);
