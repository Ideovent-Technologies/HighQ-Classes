import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: String,
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  },
  dueDate: Date,
  fileUrl: String,
});

export default mongoose.model('Assignment', assignmentSchema);
