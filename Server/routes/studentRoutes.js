import express from "express";
import {
  getStudentProfile,
  updateContactDetails,
  uploadProfilePicture,
} from "../controllers/studentController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";
import multer from "multer";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Use team lead's auth middlewares
router.use(protect);
router.use(authorize("student"));

// Routes
router.get("/me", getStudentProfile);
router.put("/update-contact", updateContactDetails);
router.post("/upload-profile-pic", upload.single("profilePic"), uploadProfilePicture);

export default router;
