// routes/courseRoutes.js
import express from 'express';
import {
  createCourse,
  getAllCourses,
  updateCourse,
  addBatchToCourse,
  updateBatch,
  updateStudentsInBatch,
  getCourseById

} from '../controllers/courseController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllCourses); // Allow public access to view courses
router.get('/:id', getCourseById); // Allow public access to view individual course

// Protected routes - admin only
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCourse);
router.patch('/:id', updateCourse);

// Batches inside courses
router.post('/:courseId/batches', addBatchToCourse);
router.patch('/:courseId/batches/:batchId', updateBatch);
router.patch('/:courseId/batches/:batchId/students', updateStudentsInBatch);
router.get('/:courseid', getCourseById);

export default router;
