import express from "express";
import {
  createSchedule,
  getSchedulesByTeacher,
  getAllSchedules,
  updateSchedule,
  deleteSchedule,
  getSchedulesForStudent,
} from "../controllers/scheduleController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher routes
router.post("/", protect, authorize(['teacher', 'admin']), createSchedule);
router.get("/", protect, authorize(['teacher']), getSchedulesByTeacher);

// Admin routes
router.get("/all", protect, authorize(['admin']), getAllSchedules);
router.put("/:id", protect, authorize(['admin']), updateSchedule);
router.delete("/:id", protect, authorize(['admin']), deleteSchedule);

// Student routes
router.get("/student", protect, authorize(['student']), getSchedulesForStudent);

export default router;
