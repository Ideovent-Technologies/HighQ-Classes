// routes/assignmentRoutes.js
import express from 'express';
import {
    createAssignment,
    getAssignments,
    getAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    gradeSubmission,
    getSubmissions
} from '../controllers/assignmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Routes for all assignments
router.route('/')
    .post(authorize('teacher'), fileUpload, createAssignment)
    .get(getAssignments);

// Routes for specific assignment
router.route('/:id')
    .get(getAssignment)
    .put(authorize('teacher'), fileUpload, updateAssignment)
    .delete(authorize('teacher'), deleteAssignment);

// Submit assignment (students only)
router.post('/:id/submit', authorize('student'), fileUpload, submitAssignment);

// Grade submission (teachers only)
router.put('/:id/grade/:submissionId', authorize('teacher'), gradeSubmission);

// Get all submissions for an assignment (teachers only)
router.get('/:id/submissions', authorize('teacher'), getSubmissions);

export default router;
