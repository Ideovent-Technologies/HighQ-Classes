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
    .post(authorize('teacher', 'admin'), fileUpload, createAssignment)
    .get(getAssignments);

// Routes for specific assignment
router.route('/:id')
    .get(getAssignment)
    .put(authorize('teacher', 'admin'), fileUpload, updateAssignment)
    .delete(authorize('teacher', 'admin'), deleteAssignment);

// Submit assignment (students only)
router.post('/:id/submit', authorize('student'), fileUpload, submitAssignment);

// Grade submission (teachers & admins only)
router.put('/:id/grade/:submissionId', authorize('teacher', 'admin'), gradeSubmission);

// Get all submissions for an assignment (teachers & admins only)
router.get('/:id/submissions', authorize('teacher', 'admin'), getSubmissions);

export default router;
