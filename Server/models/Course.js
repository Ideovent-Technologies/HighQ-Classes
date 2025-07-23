import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: String, // Example: "3 months", "6 weeks"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Admin or Teacher who created it
    }
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);
