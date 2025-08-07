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

// Protect all routes - admin only
router.use(protect);
router.use(authorize('admin'));

// Courses
router.post('/', createCourse);
router.get('/', getAllCourses);
router.patch('/:id', updateCourse);

// Batches inside courses
router.post('/:courseId/batches', addBatchToCourse);
router.patch('/:courseId/batches/:batchId', updateBatch);
router.patch('/:courseId/batches/:batchId/students', updateStudentsInBatch);
router.get('/:courseid', getCourseById);

export default router;
