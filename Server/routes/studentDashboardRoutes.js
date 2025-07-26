import express from 'express';
import { getStudentDashboard } from '../controllers/dashboard/studentDashboardController.js';
import { getStudentNotices } from '../controllers/noticeController.js';
import { protect, authorizeStudent } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/dashboard', protect, authorizeStudent, getStudentDashboard);
router.get('/dashboard/notices', authenticate, authorizeStudent, getStudentNotices);


export default router;
