import express from 'express';
import { logRecordingView } from '../controllers/recordingController.js';
import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/:recordingId/view', authenticate, authorizeStudent, logRecordingView);
// ...other recording routes

export default router;
