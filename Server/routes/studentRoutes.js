// routes/studentProfileRoute.js
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from '../controllers/studentController.js'; // ✅ Fixed file name

import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// View profile
router.get('/:id/profile', authenticate, authorizeStudent, getProfile);

// Update email / phone
router.patch('/:id/profile', authenticate, authorizeStudent, updateProfile);

// Upload profile picture
router.post(
  '/:id/profile-picture',
  authenticate,
  authorizeStudent,
  upload.single('profilePicture'),
  uploadProfilePicture
);

export default router;
