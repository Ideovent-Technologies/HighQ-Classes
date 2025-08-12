import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    uploadProfilePicture,
    changePassword,
    getStudentBatch
} from '../controllers/studentController.js';

import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = Router();

// Get student's assigned batch information
router.get('/batch', authenticate, authorizeStudent, getStudentBatch);

// View profile
router.get('/:id/profile', authenticate, authorizeStudent, getProfile);

// Update email / phone
router.patch('/:id/profile', authenticate, authorizeStudent, updateProfile);

// Upload profile picture (using express-fileupload)
router.post(
    '/:id/profile-picture',
    authenticate,
    authorizeStudent,
    fileUpload,
    uploadProfilePicture
);

// Change password
router.patch('/:id/change-password', authenticate, authorizeStudent, changePassword);

export default router;
