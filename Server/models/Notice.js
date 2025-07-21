import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'teacher'],
    required: true
  },
  visibleTo: {
    type: [String],
    enum: ['student', 'teacher', 'admin'],
    default: ['student', 'teacher']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  }
});

export default mongoose.model('Notice', noticeSchema);
