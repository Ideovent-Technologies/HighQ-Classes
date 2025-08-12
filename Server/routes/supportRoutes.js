// routes/supportRoutes.js
import express from "express";
import { createSupportTicket } from "../controllers/supportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { fileUpload } from "../middleware/fileUpload.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a support ticket (All authenticated users: student, teacher, admin)
router.post(
  "/",
  checkRole(["student", "teacher", "admin"]),
  fileUpload,
  createSupportTicket
);

export default router;
