import express from 'express';
import { getStudentDashboard } from '../controllers/dashboard/studentDashboardController.js';
import { protect, authorizeStudent } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/dashboard', protect, authorizeStudent, getStudentDashboard);

export default router;
