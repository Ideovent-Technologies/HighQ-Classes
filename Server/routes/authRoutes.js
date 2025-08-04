import express from 'express';
import {
    register,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    logout,
    updateProfile,
    changePassword
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { initializeEmailService } from '../middleware/emailMiddleware.js';
import {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateProfileUpdate,
    validatePasswordChange
} from '../middleware/validateRequestBody.js';

const router = express.Router();

// Public routes with validation
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);

// Protected routes with validation
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);

export default router;
