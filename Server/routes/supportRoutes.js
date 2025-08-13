// routes/supportRoutes.js
import express from "express";
import {
  createSupportTicket,
  getAllSupportTickets,
  getUserSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  deleteSupportTicket,
} from "../controllers/supportController.js";
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

// Get all support tickets (admin only)
router.get(
  "/",
  checkRole(["admin"]),
  getAllSupportTickets
);

// Get tickets for the logged-in user
router.get(
  "/my",
  checkRole(["student", "teacher", "admin"]),
  getUserSupportTickets
);

// Get a single ticket by ID (owner or admin)
router.get(
  "/:id",
  checkRole(["student", "teacher", "admin"]),
  getSupportTicketById
);

// Update ticket status (admin only)
router.patch(
  "/:id/status",
  checkRole(["admin"]),
  updateSupportTicketStatus
);

// Delete a ticket (admin only)
router.delete(
  "/:id",
  checkRole(["admin"]),
  deleteSupportTicket
);

export default router;
