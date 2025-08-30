// In routes/studentRoutes.js

import express from "express";
import { 
  getAllStudents, 
  getProfile, 
  updateProfile, 
  changePassword, 
  getStudentBatch, 
  uploadProfilePicture 
} from "../controllers/studentController.js";

// Change this import to use the generic authorize middleware
import { authenticate, authorize , authorizeStudent } from "../middleware/authMiddleware.js";
import { fileUpload } from "../middleware/fileUpload.js";

const router = express.Router();

// 🔒 FIX: This endpoint should be accessible by Admins and Teachers, not just Students.
// Replace `authorizeStudent` with `authorize`
router.get("/students", authenticate, authorize(['admin', 'teacher']), getAllStudents);

// These routes are correct as they deal with a specific student's data
router.get("/student/:id/profile", authenticate, authorize(['student', 'teacher', 'admin']), getProfile);

// This endpoint should be for students only to change their own password
router.patch("/student/:id/change-password", authenticate, authorizeStudent, changePassword);

// This endpoint retrieves the student's own batch info and is fine with `authorizeStudent`
router.get("/student/batch", authenticate, authorizeStudent, getStudentBatch);

// You may want to authorize teachers/admins for these as well, depending on your app's logic
// For example:
router.patch("/student/:id/profile", authenticate, authorize(['student', 'teacher', 'admin']), updateProfile);

// The `fileUpload` middleware will be handled correctly after the authentication
router.post(
  "/student/:id/profile-picture",
  authenticate,
  authorize(['student', 'teacher', 'admin']),
  fileUpload,
  uploadProfilePicture
);

export default router;