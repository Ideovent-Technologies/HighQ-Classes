// routes/studentRoutes.js
import express from "express";
import { getAllStudents, getProfile, updateProfile, changePassword, getStudentBatch, uploadProfilePicture } from "../controllers/studentController.js";

const router = express.Router();

// ✅ New route
router.get("/students", getAllStudents);

// existing
router.get("/student/:id/profile", getProfile);
router.patch("/student/:id/profile", updateProfile);
router.patch("/student/:id/change-password", changePassword);
router.get("/student/batch", getStudentBatch);
router.post("/student/:id/profile-picture", uploadProfilePicture);

export default router;
