// routes/scheduleRoutes.js

import express from "express";
import {
  createSchedule,
  getSchedulesByTeacher,
} from "../controllers/scheduleController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Combine middleware to protect teacher routes
const protectTeacher = [protect, authorize("teacher")];

// @route   POST /api/teacher/schedule
// @desc    Create a schedule
// @access  Private (Teacher only)
router.post("/", protectTeacher, createSchedule);

// @route   GET /api/teacher/schedule
// @desc    Get all schedules for the logged-in teacher
// @access  Private (Teacher only)
router.get("/", protectTeacher, getSchedulesByTeacher);

export default router;
