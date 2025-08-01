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
    CreateUser ,
    getAdminProfile
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes and ensure admin access
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard
router.get("/dashboard", getAdminDashboard);
router.get("/profile", getAdminProfile);

// Users
router.post("/user", validateAdminCreateUser, CreateUser); // ✅ new
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

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

export default router;
