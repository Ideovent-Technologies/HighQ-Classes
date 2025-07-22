import mongoose from 'mongoose';

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
  },
  structure: {
    total: Number,
    dueDate: Date,
    components: [{
      label: String,
      amount: Number,
    }],
  },
  payments: [{
    amount: Number,
    date: Date,
    method: String,
  }],
  receipts: [{
    url: String,
    date: Date,
  }],
});

export default mongoose.model('Fee', feeSchema);
