// routes/attendanceRoutes.js

import express from "express";
import {
  markAttendance,
  getAttendanceByBatchAndDate,
  getAttendanceSummary
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use inline middleware for teacher-protected routes
const protectTeacher = [protect, authorize("teacher")];

// @route   POST /api/teacher/attendance
// @desc    Mark attendance
// @access  Private (Teacher only)
router.post("/", protectTeacher, markAttendance);

// @route   GET /api/teacher/attendance?batchId=...&date=...
// @desc    Get attendance records for a batch on a date
// @access  Private (Teacher only)
router.get("/", protectTeacher, getAttendanceByBatchAndDate);

router.get("/summary", protectTeacher, getAttendanceSummary);

export default router;
