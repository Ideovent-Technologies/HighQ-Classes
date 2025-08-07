import { Router } from 'express';

// Material Controllers
import {
  getMaterialsByBatch as getMaterials,
  getMaterialById,
} from '../controllers/materialController.js';

// Student Controllers
import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
} from '../controllers/studentController.js';

// Attendance Controller
import {
  getStudentAttendance as getAttendance,
} from '../controllers/attendanceController.js';

// Fee Controllers
import {
  getFeesByStudent as getFeeStatus,
  getPayments,
  processPayment as makePayment,
} from '../controllers/feeController.js';

// Notice Controller
import {
  getNoticesForStudent as getNoticeById,
} from '../controllers/noticeController.js';

// Recording Controllers
import {
  getRecordings,
  getStudentRecordings,
  getRecording as getRecordingById,
} from '../controllers/recordingController.js';

// Schedule Controller
import {
  getScheduleByStudent as getSchedule,
} from '../controllers/scheduleController.js';

// Middleware
import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = Router();

// Student profile routes
router.get('/profile', authenticate, authorizeStudent, getProfile);
router.put('/profile', authenticate, authorizeStudent, updateProfile);
router.post(
  '/upload-profile-picture',
  authenticate,
  authorizeStudent,
  fileUpload, // <- no `.single()`
  uploadProfilePicture
);

router.put('/change-password', authenticate, authorizeStudent, changePassword);

// Materials routes
router.get('/materials', authenticate, authorizeStudent, getMaterials);
router.get('/materials/:id', authenticate, authorizeStudent, getMaterialById);

// Attendance routes
router.get('/attendance', authenticate, authorizeStudent, getAttendance);

// Fees routes
router.get('/fees', authenticate, authorizeStudent, getFeeStatus);
router.get('/payments', authenticate, authorizeStudent, getPayments);
router.post('/payments', authenticate, authorizeStudent, makePayment);

// Notices routes
router.get('/notices', authenticate, authorizeStudent, getNoticeById);

// Recordings routes
router.get('/recordings', authenticate, authorizeStudent, getRecordings);
router.get('/recordings/student', authenticate, authorizeStudent, getStudentRecordings);
router.get('/recordings/:id', authenticate, authorizeStudent, getRecordingById);

// Schedule routes
router.get('/schedule', authenticate, authorizeStudent, getSchedule);

export default router;
