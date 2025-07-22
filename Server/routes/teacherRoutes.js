// routes/teacherRoutes.js
import express from 'express';
import {
  getTeacherProfile,
  updateTeacherProfile,
} from '../controllers/teacherController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();
const protectTeacher = [protect, authorize('teacher')];

// ------------------ TEACHER PROFILE ------------------

// @route   GET /api/teacher/profile
// @desc    Get logged-in teacher's profile
// @access  Private (Teacher only)
router.get('/profile', protectTeacher, getTeacherProfile);

// @route   PUT /api/teacher/profile
// @desc    Update logged-in teacher's profile (email/password only)
// @access  Private (Teacher only)
router.put('/profile', protectTeacher, updateTeacherProfile);

export default router;
