// routes/teacherRoutes.js
import express from 'express';
import {
  createNotice,
  getAllNotices,  
  updateNotice,   
  deleteNotice,  
  getNoticeById,        
  getNoticesByBatch  
} from '../controllers/teacherController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ------------------ NOTICE ROUTES ------------------

// @route   POST /api/teacher/notices
// @desc    Create a new notice
// @access  Private (Teacher only)
router.post('/notices', protect, authorize('teacher'), createNotice);

// @route   PUT /api/teacher/notices/:id
// @desc    Update a specific notice
// @access  Private (Teacher only)
router.put('/notices/:id', protect, authorize('teacher'), updateNotice);

// @route   DELETE /api/teacher/notices/:id
// @desc    Delete a specific notice
// @access  Private (Teacher only)
router.delete('/notices/:id', protect, authorize('teacher'), deleteNotice);

// @route   GET /api/teacher/notices
// @desc    Get all notices (with pagination & filters)
// @access  Private (Teacher only)
router.get('/notices', protect, authorize('teacher'), getAllNotices);

// @route   GET /api/teacher/notices/:id
// @desc    Get a specific notice by ID
// @access  Private (Teacher only)
router.get('/notices/:id', protect, authorize('teacher'), getNoticeById);

// @route   GET /api/teacher/notices/batch/:batchId
// @desc    Get all notices for a specific batch
// @access  Private (Teacher only)
router.get('/notices/batch/:batchId', protect, authorize('teacher'), getNoticesByBatch);

export default router;
