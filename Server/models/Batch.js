import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
      }
    ],
    schedule: {
      days: [
        {
          type: String,
        }
      ],
      startTime: {
        type: String,
      },
      endTime: {
        type: String,
      }
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    }
  },
  { timestamps: true }
);

export default mongoose.model('Batch', batchSchema);
