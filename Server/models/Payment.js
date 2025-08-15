import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fee',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'upi', 'cheque', 'online', 'other'],
        required: true
    },
    transactionId: {
        type: String
    },
    receiptNumber: {
        type: String
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'completed'
    },
    notes: {
        type: String
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, { timestamps: true });

// Generate receipt number before saving
paymentSchema.pre('save', async function (next) {
    if (this.isNew && !this.receiptNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');

        // Find last payment to continue the sequence
        const lastPayment = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });

        let sequence = 1;
        if (lastPayment && lastPayment.receiptNumber) {
            // Extract sequence number from last receipt
            const lastSequence = parseInt(lastPayment.receiptNumber.slice(-4));
            if (!isNaN(lastSequence)) {
                sequence = lastSequence + 1;
            }
        }

        // Format: HQ-YY-MM-0001
        this.receiptNumber = `HQ-${year}-${month}-${sequence.toString().padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Payment', paymentSchema);