import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to allow teacher or admin
const protectTeacherOrAdmin = [protect, authorize("teacher", "admin")];

// Create a new notice
router.post("/", protectTeacherOrAdmin, createNotice);

// Get all notices
router.get("/", protectTeacherOrAdmin, getAllNotices);

// Get a single notice by ID
router.get("/:id", protectTeacherOrAdmin, getNoticeById);

// Update a notice by ID
router.put("/:id", protectTeacherOrAdmin, updateNotice);

// Delete a notice by ID
router.delete("/:id", protectTeacherOrAdmin, deleteNotice);

export default router;
