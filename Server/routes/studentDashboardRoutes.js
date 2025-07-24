import express from 'express';
import { getStudentDashboard } from '../controllers/dashboard/studentDashboardController.js';
import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authenticate, authorizeStudent, getStudentDashboard);

export default router;
