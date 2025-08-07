import express from "express";
import {
  markAttendance,
  getAttendanceByBatchAndDate,
  getAttendanceSummary,
  getStudentAttendance,
} from "../controllers/attendanceController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

const protectTeacher = [protect, authorize("teacher")];
const protectStudent = [protect, authorize("student")];

// Teacher routes
router.post("/", protectTeacher, markAttendance);
router.get("/", protectTeacher, getAttendanceByBatchAndDate);
router.get("/summary", protectTeacher, getAttendanceSummary);

// Student route
router.get("/student/:id", protectStudent, getStudentAttendance);

export default router;
