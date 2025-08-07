import express from "express";
import {
    uploadRecording,
    getRecordings,
    getRecording,
    updateRecording,
    deleteRecording,
    getStudentRecordings,
    getRecordingAnalytics,
    extendRecordingAccess,
    searchRecordings,
} from "../controllers/recordingController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { fileUpload } from "../middleware/fileUpload.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// --- Routes for teachers and admins ---

// Upload recordings
router.post(
    "/",
    checkRole(["teacher", "admin"]),
    fileUpload,
    uploadRecording
);

// Get all recordings (teachers, admins, students)
router.get(
    "/",
    checkRole(["teacher", "admin", "student"]),
    getRecordings
);

// Get recording analytics (teachers and admins)
router.get(
    "/analytics",
    checkRole(["teacher", "admin"]),
    getRecordingAnalytics
);

// Extend recording access (teachers and admins)
router.put(
    "/:id/extend",
    checkRole(["teacher", "admin"]),
    extendRecordingAccess
);

// Update a recording (teachers and admins)
router.put(
    "/:id",
    checkRole(["teacher", "admin"]),
    updateRecording
);

// Delete a recording (teachers and admins)
router.delete(
    "/:id",
    checkRole(["teacher", "admin"]),
    deleteRecording
);

// --- Routes accessible to students only ---

// Get recordings accessible to logged-in student
router.get(
    "/student",
    checkRole(["student"]),
    getStudentRecordings
);

// --- Routes accessible to all roles (teacher, admin, student) ---

// Get single recording by ID for authorized roles
router.get(
    "/:id",
    checkRole(["teacher", "admin", "student"]),
    getRecording
);

// Search recordings by title (all logged in roles)
router.get(
    "/search",
    checkRole(["teacher", "admin", "student"]),
    searchRecordings
);

export default router;
