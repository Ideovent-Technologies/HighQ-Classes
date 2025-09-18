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
    .post(authorize('teacher', 'admin'), fileUpload, createAssignment) // admin can also create
    .get(getAssignments); // any logged-in user can get

// Routes for specific assignment
router.route('/:id')
    .get(getAssignment) // teacher/admin/student can get
    .put(authorize('teacher', 'admin'), fileUpload, updateAssignment) // admin can update
    .delete(authorize('teacher', 'admin'), deleteAssignment); // admin can delete

// Submit assignment (students only)
router.post('/:id/submit', authorize('student'), fileUpload, submitAssignment);

// Grade submission (teachers or admin)
router.put('/:id/grade/:submissionId', authorize('teacher', 'admin'), gradeSubmission);

// Get all submissions for an assignment (teachers or admin)
router.get('/:id/submissions', authorize('teacher', 'admin'), getSubmissions);

export default router;
