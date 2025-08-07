import express from 'express';
import {
  CreateBatch,
  GetAllBatch,
  UpdateBatch,
  deleteBatch,
  assignStudentToBatch,
  getBatchesByCourse,
  getBatchById
} from '../controllers/batchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/batches/
 * @desc    Create a new batch
 * @access  Private
 */
router.post('/', protect, CreateBatch);

/**
 * @route   GET /api/batches/
 * @desc    Get all batches
 * @access  Private
 */
router.get('/', protect, GetAllBatch);

/**
 * @route   GET /api/batches/course/:courseId
 * @desc    Get batches by course ID
 * @access  Private
 */
router.get('/course/:courseId', protect, getBatchesByCourse);

/**
 * @route   POST /api/batches/:batchId/students
 * @desc    Assign a student to a batch
 * @access  Private
 */
router.post('/:batchId/students', protect, assignStudentToBatch);

/**
 * @route   GET /api/batches/:batchId
 * @desc    Get batch by ID
 * @access  Private
 */
router.get('/:batchId', protect, getBatchById);

/**
 * @route   PUT /api/batches/:batchId
 * @desc    Update an existing batch
 * @access  Private
 */
router.put('/:batchId', protect, UpdateBatch);

/**
 * @route   DELETE /api/batches/:batchId
 * @desc    Delete a batch
 * @access  Private
 */
router.delete('/:batchId', protect, deleteBatch);

router.get('/:batchId', protect, getBatchById); // Useful for testing existence


export default router;
