import Fee from "../models/Fee.js";
import Payment from "../models/Payment.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

/**
 * @desc    Create a new fee record for a student
 * @route   POST /api/fee
 * @access  Private (Admin only)
 */
export const createFee = async (req, res) => {
    try {
        const {
            studentId,
            courseId,
            batchId,
            amount,
            dueDate,
            feeType,
            month,
            year,
            description
        } = req.body;

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Create new fee record
        const fee = new Fee({
            student: studentId,
            course: courseId,
            batch: batchId,
            amount,
            dueDate: new Date(dueDate),
            feeType,
            month,
            year,
            description,
            status: 'pending'
        });

        await fee.save();

        res.status(201).json({
            success: true,
            message: 'Fee created successfully',
            fee
        });
    } catch (error) {
        console.error('Fee creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating fee record',
            error: error.message
        });
    }
};

/**
 * @desc    Update an existing fee record
 * @route   PUT /api/fee/:id
 * @access  Private (Admin only)
 */
export const updateFee = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, dueDate, feeType, month, year, description, discount } = req.body;

        const fee = await Fee.findById(id);
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Don't allow changing amount if already paid
        if (fee.isPaid && amount !== fee.amount) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update amount for a paid fee'
            });
        }

        // Update fields
        fee.amount = amount || fee.amount;
        fee.dueDate = dueDate ? new Date(dueDate) : fee.dueDate;
        fee.feeType = feeType || fee.feeType;
        fee.month = month || fee.month;
        fee.year = year || fee.year;
        fee.description = description || fee.description;

        // Apply discount if provided
        if (discount !== undefined) {
            fee.discount = discount;
        }

        await fee.save();

        res.status(200).json({
            success: true,
            message: 'Fee updated successfully',
            fee
        });
    } catch (error) {
        console.error('Fee update error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating fee',
            error: error.message
        });
    }
};

/**
 * @desc    Get all fees for a specific student
 * @route   GET /api/fee/student/:studentId
 * @access  Private (Admin, Student - own records only)
 */
export const getFeesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        // Security check - students can only view their own fees
        if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized. Students can only view their own fees.'
            });
        }

        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        const fees = await Fee.find({ student: studentId })
            .populate('course', 'name')
            .populate('batch', 'name')
            .sort({ dueDate: -1 });

        // Calculate statistics
        const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paidAmount = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
        const pendingAmount = totalAmount - paidAmount;

        res.status(200).json({
            success: true,
            count: fees.length,
            stats: {
                totalAmount,
                paidAmount,
                pendingAmount,
                pendingCount: fees.filter(fee => fee.status !== 'paid').length
            },
            fees
        });
    } catch (error) {
        console.error('Get student fees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving student fees',
            error: error.message
        });
    }
};

/**
 * @desc    Get a specific fee record by ID
 * @route   GET /api/fee/:id
 * @access  Private (Admin, Student - own records only)
 */
export const getFeeById = async (req, res) => {
    try {
        const { id } = req.params;

        const fee = await Fee.findById(id)
            .populate('student', 'name email')
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('payments');

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Security check - students can only view their own fees
        if (req.user.role === 'student' && req.user._id.toString() !== fee.student._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized. Students can only view their own fees.'
            });
        }

        res.status(200).json({
            success: true,
            fee
        });
    } catch (error) {
        console.error('Get fee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving fee',
            error: error.message
        });
    }
};

/**
 * @desc    Process a payment for a fee
 * @route   POST /api/fee/:id/pay
 * @access  Private (Admin only)
 */
export const processPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, paymentMethod, transactionId, notes } = req.body;

        // Input validation
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid payment amount is required'
            });
        }

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Payment method is required'
            });
        }

        const fee = await Fee.findById(id);
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Calculate remaining amount
        const remainingAmount = fee.amount - fee.discount - fee.paidAmount;

        if (amount > remainingAmount) {
            return res.status(400).json({
                success: false,
                message: `Payment amount (${amount}) exceeds remaining amount (${remainingAmount})`
            });
        }

        // Create payment record
        const payment = new Payment({
            student: fee.student,
            fee: fee._id,
            amount,
            paymentMethod,
            transactionId,
            notes,
            processedBy: req.user._id
        });

        await payment.save();

        // Update fee record
        fee.paidAmount = (fee.paidAmount || 0) + amount;
        fee.payments.push(payment._id);

        // Set payment date if this is the first payment
        if (!fee.paymentDate) {
            fee.paymentDate = new Date();
        }

        // Update status
        if (fee.paidAmount >= (fee.amount - fee.discount)) {
            fee.status = 'paid';
            fee.isPaid = true;
        } else if (fee.paidAmount > 0) {
            fee.status = 'partial';
        }

        await fee.save();

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            payment,
            fee
        });
    } catch (error) {
        console.error('Process payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

/**
 * @desc    Get all fees (with optional filters)
 * @route   GET /api/fee
 * @access  Private (Admin only)
 */
export const getAllFees = async (req, res) => {
    try {
        const { status, month, year, batchId, courseId, feeType } = req.query;

        // Build filter object
        const filter = {};

        if (status) filter.status = status;
        if (month) filter.month = month;
        if (year) filter.year = parseInt(year);
        if (batchId) filter.batch = batchId;
        if (courseId) filter.course = courseId;
        if (feeType) filter.feeType = feeType;

        const fees = await Fee.find(filter)
            .populate('student', 'name email')
            .populate('course', 'name')
            .populate('batch', 'name')
            .sort({ dueDate: -1 });

        // Calculate statistics
        const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paidAmount = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
        const discountAmount = fees.reduce((sum, fee) => sum + (fee.discount || 0), 0);
        const pendingAmount = totalAmount - paidAmount - discountAmount;

        res.status(200).json({
            success: true,
            count: fees.length,
            stats: {
                totalAmount,
                paidAmount,
                discountAmount,
                pendingAmount,
                pendingCount: fees.filter(fee => fee.status !== 'paid').length
            },
            fees
        });
    } catch (error) {
        console.error('Get all fees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving fees',
            error: error.message
        });
    }
};

/**
 * @desc    Delete a fee record
 * @route   DELETE /api/fee/:id
 * @access  Private (Admin only)
 */
export const deleteFee = async (req, res) => {
    try {
        const { id } = req.params;

        const fee = await Fee.findById(id);

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Don't allow deletion if payments exist
        if (fee.payments && fee.payments.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete fee with existing payments'
            });
        }

        await fee.remove();

        res.status(200).json({
            success: true,
            message: 'Fee deleted successfully'
        });
    } catch (error) {
        console.error('Delete fee error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting fee',
            error: error.message
        });
    }
};
export const getFeesByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const fees = await Fee.find({ batch: batchId });
        res.json(fees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all upcoming due fees (e.g., due date in the future)
export const getUpcomingDueFees = async (req, res) => {
    try {
        const today = new Date();
        const fees = await Fee.find({ dueDate: { $gte: today }, status: "pending" });
        res.json(fees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get monthly fee report (grouped by month)
export const getMonthlyFeeReport = async (req, res) => {
    try {
        const report = await Fee.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};