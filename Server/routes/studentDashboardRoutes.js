import express from 'express';
import { getStudentDashboard } from '../controllers/dashboard/studentDashboardController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/dashboard', protect, authorize('student'), getStudentDashboard);

export default router;
