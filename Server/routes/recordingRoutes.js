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

// Routes accessible to teachers and admins
router.route("/")
    .post(checkRole(["teacher", "admin"]), fileUpload, uploadRecording)
    .get(checkRole(["teacher", "admin", "student"]), getRecordings);

// Get analytics
router.get("/analytics", checkRole(["teacher", "admin"]), getRecordingAnalytics);

// Student specific route
router.get("/student", checkRole(["student"]), getStudentRecordings);

// Search recordings
router.get("/search", checkRole(["teacher", "admin", "student"]), searchRecordings);

// Routes for specific recordings by ID
router.route("/:id")
    .get(checkRole(["teacher", "admin", "student"]), getRecording)
    .put(checkRole(["teacher", "admin"]), updateRecording)
    .delete(checkRole(["teacher", "admin"]), deleteRecording);

// Extend recording access for students
router.put("/:id/extend", checkRole(["teacher", "admin"]), extendRecordingAccess);
router.get("/student", checkRole(["student"]), getStudentRecordings);

// Individual recording routes
router.route("/:id")
    .get(getRecording)
    .put(checkRole(["teacher", "admin"]), updateRecording)
    .delete(checkRole(["teacher", "admin"]), deleteRecording);

// Extend recording access
router.put("/:id/extend", checkRole(["teacher", "admin"]), extendRecordingAccess);

// Search recordings by title
router.get("/search", checkRole(["teacher", "admin"]), searchRecordings);


export default router;
