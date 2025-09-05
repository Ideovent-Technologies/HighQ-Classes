import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getNoticesByBatch,
  getNoticesForStudent,
} from "../controllers/noticeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to allow teacher or admin
const protectTeacherOrAdmin = [protect, authorize(["teacher", "admin"])];

// --- Admin + Teacher routes (CRUD) ---
router.post("/", protectTeacherOrAdmin, createNotice);
router.get("/", protectTeacherOrAdmin, getAllNotices);
router.get("/:id", protectTeacherOrAdmin, getNoticeById);
router.put("/:id", protectTeacherOrAdmin, updateNotice);
router.delete("/:id", protectTeacherOrAdmin, deleteNotice);

// --- Student route (view only) ---
router.get("/student/notices", protect, authorize("student"), getNoticesForStudent);

// --- Batch-specific ---
router.get("/batch/:batchId", protectTeacherOrAdmin, getNoticesByBatch);

export default router;
