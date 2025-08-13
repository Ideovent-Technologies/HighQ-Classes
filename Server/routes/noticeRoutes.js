// routes/noticeRoutes.js
import express from "express";
import {
  createNotice,
  getAllNotices,
  getNoticeById,   //  FIXED NAME HERE
  updateNotice,
  deleteNotice,
} from "../controllers/noticeController.js";

import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware for teacher protection
const protectTeacher = [protect, authorize("teacher")];

//  Create a new notice
router.post("/", protectTeacher, createNotice);

//  Get all notices posted by the teacher (with filters + pagination)
router.get("/", protectTeacher, getAllNotices);

//  Get a single notice by ID (must be posted by this teacher)
router.get("/:id", protectTeacher, getNoticeById); //  FIXED HERE TOO

//  Update a notice by ID
router.put("/:id", protectTeacher, updateNotice);

//  Delete a notice by ID
router.delete("/:id", protectTeacher, deleteNotice);

export default router;
