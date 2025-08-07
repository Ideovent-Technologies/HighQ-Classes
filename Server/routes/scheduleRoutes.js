import express from 'express';
import {
  createSchedule,
  getSchedulesByTeacher,
  getScheduleByStudent,
} from '../controllers/scheduleController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Middleware for teacher-only routes
const protectTeacher = [protect, authorize('teacher')];

// Middleware for student-only routes
const protectStudent = [protect, authorize('student')];

// ---------------------------
// Teacher Routes
// ---------------------------

// Create a new schedule (teacher only)
router.post('/', protectTeacher, createSchedule);

// Get all schedules for the logged-in teacher
router.get('/', protectTeacher, getSchedulesByTeacher);

// ---------------------------
// Student Routes
// ---------------------------

// Get schedule for a specific student (student only)
router.get('/:id/schedule', protectStudent, getScheduleByStudent);

export default router;
