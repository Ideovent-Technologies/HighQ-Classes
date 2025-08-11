// routes/attendanceRoutes.js

import express from "express";
import {
  markAttendance,
  getAttendanceByBatchAndDate,
  getAttendanceSummary,
  getStudentAttendance
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use inline middleware for teacher-protected routes
const protectTeacher = [protect, authorize("teacher")];
const protectStudent = [protect, authorize("student")];

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Teacher only)
router.post("/", protectTeacher, markAttendance);

// @route   GET /api/attendance?batchId=...&date=...
// @desc    Get attendance records for a batch on a date
// @access  Private (Teacher only)
router.get("/", protectTeacher, getAttendanceByBatchAndDate);

// @route   GET /api/attendance/summary
// @desc    Get attendance summary
// @access  Private (Teacher only)
router.get("/summary", protectTeacher, getAttendanceSummary);

// @route   GET /api/attendance/student
// @desc    Get student's own attendance records
// @access  Private (Student only)
router.get("/student", protectStudent, getStudentAttendance);

export default router;
