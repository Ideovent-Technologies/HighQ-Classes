import { Router } from 'express';

import {
  getProfile,
  updateProfile,
  uploadProfilePicture,
  changePassword,
} from '../controllers/studentController.js';

import {
  getStudentAttendance as getAttendance,
} from '../controllers/attendanceController.js';

import {
  getFeesByStudent as getFeeStatus,  // alias to match router usage
  getPayments,                       // implement or confirm this exists
  processPayment as makePayment,     // alias to match router usage
} from '../controllers/feeController.js';

import { getMaterialsByBatch as getMaterials } from '../controllers/materialController.js';



import {
  getNoticesForStudent as getNotices,
  getNoticeForStudentById as getNoticeById,  // renamed to handle student access
} from '../controllers/noticeController.js';


import {
  getRecordings,
  getStudentRecordings,
  getRecording as getRecordingById,
} from '../controllers/recordingController.js';

import {
  getScheduleByStudent as getSchedule,
} from '../controllers/scheduleController.js';


import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = Router();

// --- Profile ---
router.get('/:id/profile', authenticate, authorizeStudent, getProfile);
router.patch('/:id/profile', authenticate, authorizeStudent, updateProfile);
router.post(
  '/:id/profile-picture',
  authenticate,
  authorizeStudent,
  fileUpload,
  uploadProfilePicture
);
router.patch('/:id/change-password', authenticate, authorizeStudent, changePassword);

// --- Attendance ---
router.get('/:id/attendance', authenticate, authorizeStudent, getAttendance);

// --- Fee Status & Payments ---
router.get('/:id/fee-status', authenticate, authorizeStudent, getFeeStatus);
// If listing payment history:
router.get('/:id/payments', authenticate, authorizeStudent, getPayments);
// If allowing new payments:
router.post('/:id/payments', authenticate, authorizeStudent, makePayment);

// --- Study Materials ---
router.get('/:id/materials', authenticate, authorizeStudent, getMaterials);
router.get('/:id/materials/:materialId', authenticate, authorizeStudent, getMaterialById);

// --- Notices ---
router.get('/:id/notices', authenticate, authorizeStudent, getNotices);
router.get('/:id/notices/:noticeId', authenticate, authorizeStudent, getNoticeById);

// --- Recordings ---
router.get('/:id/recordings', authenticate, authorizeStudent, getRecordings);
router.get('/:id/recordings/:recordingId', authenticate, authorizeStudent, getRecordingById);

// --- Schedule ---
router.get('/:id/schedule', authenticate, authorizeStudent, getSchedule);

export default router;
