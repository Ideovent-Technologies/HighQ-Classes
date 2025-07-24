import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
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

// Protect all routes with admin authorization
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard
router.get("/dashboard", getAdminDashboard);

// Students
router.get("/students", getAllStudents);

// Teachers
router.get("/teachers", getAllTeachers);

// Update user
router.put("/user/:id", updateUser);

// Delete user
router.delete("/user/:id", deleteUser);

// Create user
router.post("/user", CreateUser);

// Create announcement
router.post("/announcement", createAnnouncement);

export default router;