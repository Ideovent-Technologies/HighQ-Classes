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

// All routes are protected
router.use(protect);

// Upload and Get all recordings (Teachers/Admins can upload; All can get)
router.route("/")
  .post(checkRole(["teacher", "admin"]), fileUpload, uploadRecording)
  .get(checkRole(["teacher", "admin", "student"]), getRecordings);

// Recording analytics (Only Teachers/Admins)
router.get("/analytics", checkRole(["teacher", "admin"]), getRecordingAnalytics);

// Search recordings (All roles)
router.get("/search", checkRole(["teacher", "admin", "student"]), searchRecordings);

// Student-specific access (Only Students)
router.get("/student", checkRole(["student"]), getStudentRecordings);

// Individual recording actions (All can view; Only Teacher/Admin can edit/delete)
router.route("/:id")
  .get(checkRole(["teacher", "admin", "student"]), getRecording)
  .put(checkRole(["teacher", "admin"]), updateRecording)
  .delete(checkRole(["teacher", "admin"]), deleteRecording);

// Extend access (Only Teacher/Admin)
router.put("/:id/extend", checkRole(["teacher", "admin"]), extendRecordingAccess);

export default router;
