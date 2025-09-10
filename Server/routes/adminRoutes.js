import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateAdminCreateUser } from "../middleware/validateRequestBody.js";
import {
    getAdminDashboard,
    getAllStudents,
    getAllTeachers,
    updateUser,
    deleteUser,
    createNotice, // Changed from createAnnouncement to be consistent
    addStudent,
    updateStudent,
    deleteStudent,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    CreateUser,
    getAdminProfile,
    syncRelations,
    changeUserStatus,
    getPendingApprovals,
    getActiveUsers,
    getAllNotices, // Added for fetching all notices
    updateNotice, // Added for updating a notice
    deleteNotice // Added for deleting a notice
} from "../controllers/adminController.js";

const router = express.Router();

// Protect all routes and ensure admin access
router.use(protect);
router.use(authorize('admin'));

// Admin dashboard
router.get("/dashboard", getAdminDashboard);
router.get("/profile", getAdminProfile);

// Users
router.post("/user", validateAdminCreateUser, CreateUser);
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

// Notices (formerly Announcements)
// Now using a dedicated and consistent /notices path for all CRUD operations
router.route("/notices")
    .get(getAllNotices) // GET all notices
    .post(createNotice); // POST to create a new notice

router.route("/notices/:id")
    .put(updateNotice) // PUT to update a notice
    .delete(deleteNotice); // DELETE to delete a notice

// One-off sync endpoint (admin only)
router.post("/sync/relations", syncRelations);

// Pending approvals
router.get('/pending-approvals', getPendingApprovals);

export default router;
