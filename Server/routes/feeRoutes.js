import express from "express";
import {
    createFee,
    updateFee,
    getFeeById,
    getFeesByStudent,
    getAllFees,
    processPayment,
    deleteFee,
    getFeesByBatch,
    getUpcomingDueFees,
    getMonthlyFeeReport
} from "../controllers/feeController.js";
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.post('/', authorize('admin'), createFee);
router.get('/', authorize('admin'), getAllFees);
router.get('/upcoming', authorize('admin'), getUpcomingDueFees);
router.get('/monthly-report', authorize('admin'), getMonthlyFeeReport);
router.get('/batch/:batchId', authorize('admin'), getFeesByBatch);
router.put('/:id', authorize('admin'), updateFee);
router.delete('/:id', authorize('admin'), deleteFee);
router.post('/:id/pay', authorize('admin'), processPayment);

// Student and admin can view student fees
router.get('/student/:studentId', authorize('admin', 'student'), getFeesByStudent);

// Student and admin can view a specific fee (controller checks ownership)
router.get('/:id', authorize('admin', 'student'), getFeeById);

export default router;