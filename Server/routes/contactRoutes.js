import express from "express";
import {
    sendContactMessage,
    sendStudentTeacherMessage,
    getContactMessages,
    getStudentTeacherMessages,
    updateMessageStatus
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public route - anyone can send a contact message
router.post("/contact", sendContactMessage);

// Authenticated student/teacher route - send message to admin
router.post("/contact/student-teacher", protect, sendStudentTeacherMessage);

// Admin-only routes
router.get("/contact/messages", protect, authorize("admin"), getContactMessages);
router.get("/contact/student-teacher-messages", protect, authorize("admin"), getStudentTeacherMessages);
router.patch("/contact/messages/:messageId", protect, authorize("admin"), updateMessageStatus);

export default router;
