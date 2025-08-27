import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch'
    },
    feeType: {
      type: String,
      enum: ['admission', 'tuition', 'examination', 'other'],
      default: 'tuition'
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative']
    },
    dueDate: {
      type: Date,
      required: true
    },
    month: {
      type: String
    },
    year: {
      type: Number
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    paymentDate: {
      type: Date
    },
    lateCharge: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending'
    },
    payments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment'
    }]
  },
  { timestamps: true }
);

export default mongoose.model('Fee', feeSchema);
