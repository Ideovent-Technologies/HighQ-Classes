import express from "express";
import {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getSubmissionsByTeacher,
} from "../controllers/submissionController.js";
import { protect } from "../middleware/authMiddleware.js"; // Import your auth middleware

const router = express.Router();

router.post("/", protect, submitAssignment);
router.get("/assignment/:assignmentId", protect, getSubmissionsByAssignment);
router.get("/teacher/submissions", protect, getSubmissionsByTeacher);
router.put("/:id/grade", protect, gradeSubmission);

export default router;