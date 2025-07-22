import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getAdminDashboard,
    getAllStudents,
    getAllTeachers,
    updateUser,
    deleteUser,
    CreateUser,
    createAnnouncement
} from "../controllers/adminController.js";

const router = express.Router();

// Admin dashboard
router.get("/dashboard", protect, getAdminDashboard);

// Students
router.get("/students", protect, getAllStudents);

// Teachers
router.get("/teachers", protect, getAllTeachers);

// Update user
router.put("/user/:id", protect, updateUser);

// Delete user
router.delete("/user/:id", protect, deleteUser);

// Create user
router.post("/user", protect, CreateUser);

// Create announcement
router.post("/announcement", protect, createAnnouncement);

export default router;