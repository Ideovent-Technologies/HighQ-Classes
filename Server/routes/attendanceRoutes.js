// routes/attendanceRoutes.js

import express from "express";
import {
  markAttendance,
  getAttendanceByBatchAndDate,
  getAttendanceSummary,
  getStudentAttendance,
  getAttendanceRecords,
  rebuildAttendanceSummaries
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Use inline middleware for teacher-protected routes

const protectStudent = [protect, authorize("student")];
const protectBoth = [protect, authorize("teacher", "admin")];

// @route   POST /api/attendance
// @desc    Mark attendance
// @access  Private (Teacher only)
router.post("/", protectBoth, markAttendance);

// @route   GET /api/attendance?batchId=...&date=...
// @desc    Get attendance records for a batch on a date
// @access  Private (Teacher only)
router.get("/", protectBoth, getAttendanceByBatchAndDate);

// @route   GET /api/attendance/summary
// @desc    Get attendance summary
// @access  Private (Teacher only)
router.get("/summary", protectBoth, getAttendanceSummary);

// @route   GET /api/attendance/records
// @desc    Get attendance records with pagination and filters
// @access  Private (Teacher only)
router.get("/records", protectBoth, getAttendanceRecords);

// @route   GET /api/attendance/student
// @desc    Get student's own attendance records
// @access  Private (Student only)
router.get("/student", protectStudent, getStudentAttendance);

// @route   POST /api/attendance/rebuild-summaries
// @desc    Rebuild attendance summaries for all students (utility)
// @access  Private (Teacher only)
router.post("/rebuild-summaries" ,protectBoth, rebuildAttendanceSummaries);

export default router;
