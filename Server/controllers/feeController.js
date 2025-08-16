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
        if (req.user.role === 'student') {
            const studentId = fee.student?._id || fee.student;
            if (studentId && req.user._id.toString() !== studentId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized. Students can only view their own fees.'
                });
            }
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
        const { status, month, year, batchId, courseId, feeType, page = 1, limit = 10, student } = req.query;

        // Build filter object
        const filter = {};

        if (status) filter.status = status;
        if (month) filter.month = month;
        if (year) filter.year = parseInt(year);
        if (batchId) filter.batch = batchId;
        if (courseId) filter.course = courseId;
        if (feeType) filter.feeType = feeType;

        // Add student search filter
        let studentFilter = {};
        if (student) {
            const students = await Student.find({
                $or: [
                    { name: { $regex: student, $options: 'i' } },
                    { email: { $regex: student, $options: 'i' } }
                ]
            });
            const studentIds = students.map(s => s._id);
            filter.student = { $in: studentIds };
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const totalFees = await Fee.countDocuments(filter);
        const totalPages = Math.ceil(totalFees / limitNum);

        const fees = await Fee.find(filter)
            .populate('student', 'name email')
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('payments')
            .sort({ dueDate: -1 })
            .skip(skip)
            .limit(limitNum);

        // Calculate pending amount for each fee
        const processedFees = fees.map(fee => ({
            ...fee.toObject(),
            pendingAmount: fee.amount - fee.paidAmount
        }));

        // Calculate statistics
        const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paidAmount = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
        const discountAmount = fees.reduce((sum, fee) => sum + (fee.discount || 0), 0);
        const pendingAmount = totalAmount - paidAmount - discountAmount;

        res.status(200).json({
            success: true,
            data: {
                fees: processedFees,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalFees,
                    totalPages: totalPages
                },
                stats: {
                    totalAmount,
                    paidAmount,
                    discountAmount,
                    pendingAmount,
                    pendingCount: fees.filter(fee => fee.status !== 'paid').length
                }
            }
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

        await Fee.findByIdAndDelete(id);

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

/**
 * @desc    Get student's own fees (Student access)
 * @route   GET /api/fee/my-fees
 * @access  Private (Student only)
 */
export const getMyFees = async (req, res) => {
    try {
        const studentId = req.user._id;

        const fees = await Fee.find({ student: studentId })
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate({
                path: 'payments',
                populate: {
                    path: 'processedBy',
                    select: 'name'
                }
            })
            .sort({ dueDate: -1 });

        // Add calculated pendingAmount to each fee record
        const feesWithPendingAmount = fees.map(fee => {
            const feeObj = fee.toObject();
            feeObj.pendingAmount = feeObj.amount - feeObj.paidAmount;
            return feeObj;
        });

        // Calculate summary
        const summary = {
            totalAmount: feesWithPendingAmount.reduce((sum, fee) => sum + fee.amount, 0),
            paidAmount: feesWithPendingAmount.reduce((sum, fee) => sum + fee.paidAmount, 0),
            pendingAmount: feesWithPendingAmount.reduce((sum, fee) => sum + fee.pendingAmount, 0),
            overdueAmount: 0,
            upcomingAmount: 0
        };

        // Calculate overdue and upcoming amounts
        const currentDate = new Date();
        feesWithPendingAmount.forEach(fee => {
            if (fee.pendingAmount > 0) {
                if (fee.dueDate < currentDate) {
                    summary.overdueAmount += fee.pendingAmount;
                } else {
                    summary.upcomingAmount += fee.pendingAmount;
                }
            }
        });

        res.json({
            success: true,
            data: {
                fees: feesWithPendingAmount,
                summary
            }
        });
    } catch (error) {
        console.error('Get my fees error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fees',
            error: error.message
        });
    }
};

/**
 * @desc    Create bulk fees for multiple students
 * @route   POST /api/fee/bulk
 * @access  Private (Admin only)
 */
export const createBulkFees = async (req, res) => {
    try {
        const {
            studentIds,
            courseId,
            batchId,
            amount,
            dueDate,
            feeType,
            month,
            year,
            description
        } = req.body;

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Student IDs array is required'
            });
        }

        // Verify all students exist
        const students = await Student.find({ _id: { $in: studentIds } });
        if (students.length !== studentIds.length) {
            return res.status(400).json({
                success: false,
                message: 'Some students not found'
            });
        }

        // Create fee records for all students
        const feePromises = studentIds.map(studentId => {
            return new Fee({
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
            }).save();
        });

        const createdFees = await Promise.all(feePromises);

        res.status(201).json({
            success: true,
            message: `Successfully created ${createdFees.length} fee records`,
            data: {
                count: createdFees.length,
                fees: createdFees
            }
        });
    } catch (error) {
        console.error('Bulk fee creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating bulk fees',
            error: error.message
        });
    }
};

/**
 * @desc    Generate payment receipt
 * @route   GET /api/fee/receipt/:paymentId
 * @access  Private (Admin, Student - own receipt)
 */
export const generateReceipt = async (req, res) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId)
            .populate({
                path: 'student',
                select: 'name email mobile address'
            })
            .populate({
                path: 'fee',
                populate: {
                    path: 'course batch',
                    select: 'name'
                }
            })
            .populate('processedBy', 'name');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check access permissions
        if (req.user.role === 'student' && payment.student._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        const receiptData = {
            receiptNumber: payment.receiptNumber,
            paymentDate: payment.paymentDate,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            transactionId: payment.transactionId,
            student: {
                name: payment.student.name,
                email: payment.student.email,
                mobile: payment.student.mobile
            },
            fee: {
                type: payment.fee.feeType,
                description: payment.fee.description,
                course: payment.fee.course?.name,
                batch: payment.fee.batch?.name,
                month: payment.fee.month,
                year: payment.fee.year
            },
            processedBy: payment.processedBy?.name || 'System',
            notes: payment.notes
        };

        res.json({
            success: true,
            data: receiptData
        });
    } catch (error) {
        console.error('Receipt generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating receipt',
            error: error.message
        });
    }
};

/**
 * @desc    Apply discount to fee
 * @route   PATCH /api/fee/:id/discount
 * @access  Private (Admin only)
 */
export const applyDiscount = async (req, res) => {
    try {
        const { id } = req.params;
        const { discount, reason } = req.body;

        if (!discount || discount < 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid discount amount is required'
            });
        }

        const fee = await Fee.findById(id);
        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        if (discount > fee.amount) {
            return res.status(400).json({
                success: false,
                message: 'Discount cannot be greater than fee amount'
            });
        }

        fee.discount = discount;
        fee.description = fee.description + (reason ? ` | Discount: ${reason}` : ' | Discount applied');

        // Update status if fully discounted
        const effectiveAmount = fee.amount - discount;
        if (effectiveAmount <= fee.paidAmount) {
            fee.status = 'paid';
            fee.isPaid = true;
        }

        await fee.save();

        res.json({
            success: true,
            message: 'Discount applied successfully',
            data: fee
        });
    } catch (error) {
        console.error('Discount application error:', error);
        res.status(500).json({
            success: false,
            message: 'Error applying discount',
            error: error.message
        });
    }
};

/**
 * @desc    Send fee reminder to student
 * @route   POST /api/fee/:id/remind
 * @access  Private (Admin only)
 */
export const sendFeeReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;

        const fee = await Fee.findById(id)
            .populate('student', 'name email mobile')
            .populate('course', 'name');

        if (!fee) {
            return res.status(404).json({
                success: false,
                message: 'Fee not found'
            });
        }

        // Here you would integrate with your notification service
        // For now, we'll just log and return success
        console.log(`Fee reminder sent to ${fee.student.email} for fee ${fee._id}`);

        res.json({
            success: true,
            message: 'Fee reminder sent successfully',
            data: {
                studentName: fee.student.name,
                studentEmail: fee.student.email,
                amount: fee.amount - fee.paidAmount,
                dueDate: fee.dueDate
            }
        });
    } catch (error) {
        console.error('Fee reminder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending fee reminder',
            error: error.message
        });
    }
};

/**
 * @desc    Get fee analytics for admin dashboard
 * @route   GET /api/fee/analytics
 * @access  Private (Admin only)
 */
export const getFeeAnalytics = async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();

        // Get total fees, payments, and pending amounts
        const totalStats = await Fee.aggregate([
            {
                $group: {
                    _id: null,
                    totalFees: { $sum: "$amount" },
                    totalPaid: { $sum: "$paidAmount" },
                    totalPending: { $sum: { $subtract: ["$amount", "$paidAmount"] } },
                    totalRecords: { $sum: 1 }
                }
            }
        ]);

        // Get overdue fees
        const overdueFees = await Fee.aggregate([
            {
                $match: {
                    dueDate: { $lt: currentDate },
                    status: { $in: ['pending', 'partial'] }
                }
            },
            {
                $group: {
                    _id: null,
                    overdueAmount: { $sum: { $subtract: ["$amount", "$paidAmount"] } },
                    overdueCount: { $sum: 1 }
                }
            }
        ]);

        // Get monthly collection stats
        const monthlyStats = await Payment.aggregate([
            {
                $match: {
                    paymentDate: {
                        $gte: new Date(currentYear, currentMonth - 1, 1),
                        $lt: new Date(currentYear, currentMonth, 1)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    monthlyCollection: { $sum: "$amount" },
                    monthlyTransactions: { $sum: 1 }
                }
            }
        ]);

        // Get fee type distribution
        const feeTypeStats = await Fee.aggregate([
            {
                $group: {
                    _id: "$feeType",
                    count: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    paidAmount: { $sum: "$paidAmount" }
                }
            }
        ]);

        const analytics = {
            overview: {
                totalFees: totalStats[0]?.totalFees || 0,
                totalPaid: totalStats[0]?.totalPaid || 0,
                totalPending: totalStats[0]?.totalPending || 0,
                totalRecords: totalStats[0]?.totalRecords || 0,
                overdueAmount: overdueFees[0]?.overdueAmount || 0,
                overdueCount: overdueFees[0]?.overdueCount || 0,
                monthlyCollection: monthlyStats[0]?.monthlyCollection || 0,
                monthlyTransactions: monthlyStats[0]?.monthlyTransactions || 0
            },
            feeTypeDistribution: feeTypeStats
        };

        res.json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error('Fee analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching fee analytics',
            error: error.message
        });
    }
};