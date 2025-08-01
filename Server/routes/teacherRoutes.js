// routes/teacherRoutes.js

import express from 'express';
import {
  getTeacherProfile,
  updateTeacherProfile,
} from '../controllers/teacherController.js';

import { getTeacherDashboard } from "../controllers/dashboard/teacherDashboardController.js";

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware: Protect routes and restrict to 'teacher' role
const protectTeacher = [protect, authorize('teacher')];

/* ----------------------------------------------------
 *                  TEACHER DASHBOARD
 * --------------------------------------------------*/

// @route   GET /api/teacher/dashboard
// @desc    Fetch teacher's dashboard summary (schedule, notices, attendance, etc.)
// @access  Private (Teacher only)
router.get('/dashboard', protectTeacher, getTeacherDashboard);


/* ----------------------------------------------------
 *                  TEACHER PROFILE
 * --------------------------------------------------*/

// @route   GET /api/teacher/profile
// @desc    Get logged-in teacher's profile details
// @access  Private (Teacher only)
router.get('/profile', protectTeacher, getTeacherProfile);

// @route   PUT /api/teacher/profile
// @desc    Update logged-in teacher's profile (email/password only)
// @access  Private (Teacher only)
router.put('/profile', protectTeacher, updateTeacherProfile);

export default router;