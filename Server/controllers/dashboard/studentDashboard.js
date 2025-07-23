import Student from '../../models/Student.js';
import Class from '../../models/Class.js';
import Batch from '../../models/Batch.js'; // Assuming you have a Batch model
import Fee from '../../models/Fee.js';     // Assuming you have a Fee model

export const getStudentDashboard = async (req, res) => {
    try {
        const studentId = req.user.id; // assuming authentication middleware sets req.user
        const student = await Student.findById(studentId).select('-password');
        const classes = await Class.find({ students: studentId });

        // Fetch all assigned batches for the student
        const batches = await Batch.find({ students: studentId });

        // Fetch all fee payments for the student
        const feePayments = await Fee.find({ studentId });

        // Calculate total paid and remaining (assuming each payment is for a month)
        let totalPaid = 0;
        let totalDue = 0;

        // You may want to set a fixed monthly fee, or fetch it from somewhere
        const monthlyFee = 2000; // Example: 2000 per month

        // Find unique months paid for
        const paidMonths = new Set();
        feePayments.forEach(fee => {
            if (fee.status === 'Paid') {
                totalPaid += fee.amount || 0;
                paidMonths.add(`${fee.month}-${fee.year}`);
            }
        });

        // Calculate total months assigned (based on batches)
        let totalMonths = 0;
        batches.forEach(batch => {
            if (batch.startDate && batch.endDate) {
                const start = new Date(batch.startDate);
                const end = new Date(batch.endDate);
                const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
                totalMonths += months;
            }
        });

        totalDue = (totalMonths * monthlyFee) - totalPaid;

        res.json({
            profile: student,
            enrolledClasses: classes,
            assignedBatches: batches,
            feeStatus: {
                totalPaid,
                totalDue: totalDue < 0 ? 0 : totalDue
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};