import express from "express";
import {
    createFee,
    updateFee,
    getFeeById,
    getFeesByStudent,
    getAllFees,
    processPayment,
    deleteFee
} from "../controllers/feeController.js";
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

// Create and get all fees
router.route('/')
    .post(createFee)
    .get(getAllFees);

// Operations on specific fee by ID
router.route('/:id')
    .get(getFeeById)
    .put(updateFee)
    .delete(deleteFee);

// Process payment
router.post('/:id/pay', processPayment);

// Get student fees (accessible by student and admin)
router.get('/student/:studentId', getFeesByStudent);

export default router;