import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from '../controllers/studentController.js';

import { protect, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUpload, moveProfilePicToUploads } from '../middleware/fileUpload.js';

const router = Router();

// View profile
router.get('/:id/profile', protect, authorizeStudent, getProfile);

// Update email / phone
router.patch('/:id/profile', protect, authorizeStudent, updateProfile);

// Upload profile picture
router.post(
  '/:id/profile-picture',
  protect,
  authorizeStudent,
  fileUpload,
  moveProfilePicToUploads,
  uploadProfilePicture
);

export default router;
