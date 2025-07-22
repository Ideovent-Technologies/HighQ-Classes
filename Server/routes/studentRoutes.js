// routes/studentProfileRoute.js
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from '../controllers/studentController.js';

import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Student can view full profile (including attendance, payments, resources)
router.get('/:id/profile', authenticate, authorizeStudent, getProfile);
// Student can update ONLY email/mobile
router.patch('/:id/profile', authenticate, authorizeStudent, updateProfile);
// Student can upload/change profile picture
router.post('/:id/profile-picture', authenticate, authorizeStudent, upload.single('profilePicture'), uploadProfilePicture);

export default router;
