// routes/courseRoutes.js
import express from 'express';
import {
  createCourse,
  getAllCourses,
  updateCourse,
  addBatchToCourse,
  updateBatch,
  updateStudentsInBatch
} from '../controllers/courseController.js';

import { authenticate, authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect all routes - admin only
router.use(authenticate);
router.use(authorizeAdmin);

// Courses
router.post('/', createCourse);
router.get('/', getAllCourses);
router.patch('/:id', updateCourse);

// Batches inside courses
router.post('/:courseId/batches', addBatchToCourse);
router.patch('/:courseId/batches/:batchId', updateBatch);
router.patch('/:courseId/batches/:batchId/students', updateStudentsInBatch);

export default router;
