// routes/studentProfileRoute.js
import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    uploadProfilePicture
} from '../controllers/studentController.js';

import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

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
    fileUpload,
    uploadProfilePicture
); export default router;
