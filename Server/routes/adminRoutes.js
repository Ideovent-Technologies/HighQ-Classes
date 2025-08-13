import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateAdminCreateUser } from "../middleware/validateRequestBody.js";
import {
    getAdminDashboard,
    getAllStudents,
    getAllTeachers,
    updateUser,
    deleteUser,
    createAnnouncement,
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    CreateUser,
    getAdminProfile,
    syncRelations, // <-- added
    changeUserStatus,
    getPendingApprovals, // <-- added
    getActiveUsers
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes and ensure admin access
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard
router.get("/dashboard", getAdminDashboard);
router.get("/profile", getAdminProfile);

// Users
router.post("/user", validateAdminCreateUser, CreateUser); //  new
router.put("/user/:id", updateUser);
router.patch('/user/:id/status', changeUserStatus);
router.delete("/user/:id", deleteUser);
// Active users
router.get("/active-users", getActiveUsers);

// Students
router.get("/students", getAllStudents);
router.post("/students", addStudent);
router.put("/students/:id", updateStudent);
router.delete("/students/:id", deleteStudent);

// Teachers
router.get("/teachers", getAllTeachers);
router.post("/teachers", addTeacher);
router.put("/teachers/:id", updateTeacher);
router.delete("/teachers/:id", deleteTeacher);

// Announcements
router.post("/announcement", createAnnouncement);

// One-off sync endpoint (admin only) — backfill Teacher.courseIds, Teacher.batches, Course.batches
// Use with caution; it's idempotent (uses $addToSet) and accepts optional ?limit=100
router.post("/sync/relations", syncRelations);

// Pending approvals
router.get('/pending-approvals', getPendingApprovals);

export default router;
