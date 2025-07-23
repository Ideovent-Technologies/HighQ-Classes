// routes/studentProfileRoute.js
import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  uploadProfilePicture
} from '../controllers/studentController.js';

import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUploadMiddleware, moveProfilePicToUploads } from '../middleware/fileUpload.js';

const router = Router();

// View profile
router.get('/:id/profile', authenticate, authorizeStudent, getProfile);

// Update email / phone
router.patch('/:id/profile', authenticate, authorizeStudent, updateProfile);

// ✅ Upload profile picture (using express-fileupload)
router.post(
  '/:id/profile-picture',
  authenticate,
  authorizeStudent,
  fileUploadMiddleware,
  moveProfilePicToUploads,
  uploadProfilePicture
);

export default router;
