import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentMethod: {
      type: String, // e.g., UPI, Cash, Credit Card, Bank Transfer
    },
    transactionId: {
      type: String, // optional, e.g., UPI TXN ID or Receipt #
    },
    note: {
      type: String // optional remark like "Paid in 2 parts" etc.
    }
  },
  { timestamps: true }
);

export default mongoose.model('Fee', feeSchema);
