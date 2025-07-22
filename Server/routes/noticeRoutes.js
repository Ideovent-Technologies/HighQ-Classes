import express from "express";
import {
  createNotice,
  getAllNotices,
  getSingleNotice,
  updateNotice,
  deleteNotice,
} from "../controllers/teacherController.js";

import { protectTeacher } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create a new notice
// POST /api/teacher/notices
router.post("/", protectTeacher, createNotice);

// ✅ Get all notices posted by the teacher (with filters + pagination)
// GET /api/teacher/notices
router.get("/", protectTeacher, getAllNotices);

// ✅ Get a single notice by ID (must be posted by this teacher)
// GET /api/teacher/notices/:id
router.get("/:id", protectTeacher, getSingleNotice);

// ✅ Update a notice by ID
// PUT /api/teacher/notices/:id
router.put("/:id", protectTeacher, updateNotice);

// ✅ Delete a notice by ID
// DELETE /api/teacher/notices/:id
router.delete("/:id", protectTeacher, deleteNotice);

export default router;
