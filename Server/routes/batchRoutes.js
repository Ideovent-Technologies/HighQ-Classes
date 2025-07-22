import {
    CreateBatch,
    GetAllBatch,
    UpdateBatch,
    deleteBatch,
    assignStudentToBatch,
    getBatchesByCourse
} from '../controllers/batchController.js';
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new batch
router.post('/', protect, CreateBatch);
// Get all batches
router.get('/', protect, GetAllBatch);
// Update an existing batch
router.put('/:batchId', protect, UpdateBatch);
// Delete a batch
router.delete('/:batchId', protect, deleteBatch);
// Assign a student to a batch
router.post('/:batchId/students', protect, assignStudentToBatch);
// Get batches by course
router.get('/course/:courseId', protect, getBatchesByCourse);
export default router;
