// controllers/assignmentController.js
import Assignment from '../models/Assignment.js';
import Submission from '../models/Submission.js';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import configureCloudinary from '../config/cloudinary.js';

// Initialize Cloudinary configuration
configureCloudinary();

/**
 * @desc    Create a new assignment
 * @route   POST /api/assignments
 * @access  Private (Teachers only)
 */
export const createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, batchId, dueDate, totalMarks } = req.body;

        // Create new assignment
        const assignment = new Assignment({
            title,
            description,
            course: courseId,
            batch: batchId,
            teacher: req.user._id,
            dueDate: new Date(dueDate),
            totalMarks: totalMarks || 100,
        });

        // Handle file upload
        if (req.file) {
            // Upload file to Cloudinary
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream({
                        folder: 'assignments',
                        resource_type: 'auto'
                    }, (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const uploadResult = await streamUpload();

            // Add file data to assignment
            assignment.fileUrl = uploadResult.secure_url;
            assignment.fileName = req.file.originalname;
        }

        await assignment.save();

        // After saving, re-fetch and populate the assignment
        const populatedAssignment = await Assignment.findById(assignment._id)
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('teacher', 'name');

        res.status(201).json({
            success: true,
            assignment: populatedAssignment
        });

    } catch (error) {
        console.error('Create assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating assignment'
        });
    }
};

/**
 * @desc    Get all assignments (with optional filters)
 * @route   GET /api/assignments
 * @access  Private
 */
export const getAssignments = async (req, res) => {
    try {
        let filter = {};

        // For students, only show assignments for their batches
        if (req.user.role === 'student') {
            // Get student's batch directly from user (student document)
            if (req.user.batch) {
                filter.batch = req.user.batch;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Student not assigned to any batch'
                });
            }
        }

        // For teachers, only show their assignments
        if (req.user.role === 'teacher') {
            filter.teacher = req.user._id;
        }

        // Optional filters from query params
        if (req.query.course) {
            filter.course = req.query.course;
        }
        if (req.query.batch) {
            filter.batch = req.query.batch;
        }

        const assignments = await Assignment.find(filter)
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('teacher', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: assignments.length,
            assignments
        });

    } catch (error) {
        console.error('Get assignments error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assignments'
        });
    }
};

/**
 * @desc    Get a specific assignment by ID
 * @route   GET /api/assignments/:id
 * @access  Private
 */
export const getAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id)
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('teacher', 'name');

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check permissions
        if (req.user.role === 'student') {
            // Students can only view assignments for their batch
            if (!req.user.batch || assignment.batch._id.toString() !== req.user.batch.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied - assignment not for your batch'
                });
            }
        } else if (req.user.role === 'teacher') {
            // Teachers can only view their own assignments
            if (assignment.teacher._id.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied - not your assignment'
                });
            }
        }

        res.status(200).json({
            success: true,
            assignment
        });

    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching assignment'
        });
    }
};

/**
 * @desc    Update an assignment
 * @route   PUT /api/assignments/:id
 * @access  Private (Teachers only)
 */
export const updateAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if user is the teacher who created this assignment
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - not your assignment'
            });
        }

        const { title, description, courseId, batchId, dueDate, totalMarks } = req.body;

        // Update fields
        if (title) assignment.title = title;
        if (description) assignment.description = description;
        if (courseId) assignment.course = courseId;
        if (batchId) assignment.batch = batchId;
        if (dueDate) assignment.dueDate = new Date(dueDate);
        if (totalMarks) assignment.totalMarks = totalMarks;

        // Handle file upload if new file provided
        if (req.file) {
            // Delete old file from Cloudinary if exists
            if (assignment.fileUrl) {
                const publicId = assignment.fileUrl.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`assignments/${publicId}`);
            }

            // Upload new file
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream({
                        folder: 'assignments',
                        resource_type: 'auto'
                    }, (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const uploadResult = await streamUpload();
            assignment.fileUrl = uploadResult.secure_url;
            assignment.fileName = req.file.originalname;
        }

        await assignment.save();

        // Re-fetch and populate
        const updatedAssignment = await Assignment.findById(assignment._id)
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('teacher', 'name');

        res.status(200).json({
            success: true,
            assignment: updatedAssignment
        });

    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while updating assignment'
        });
    }
};

/**
 * @desc    Delete an assignment
 * @route   DELETE /api/assignments/:id
 * @access  Private (Teachers only)
 */
export const deleteAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if user is the teacher who created this assignment
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - not your assignment'
            });
        }

        // Delete file from Cloudinary if exists
        if (assignment.fileUrl) {
            try {
                const publicId = assignment.fileUrl.split('/').pop().split('.')[0];
                await cloudinary.v2.uploader.destroy(`assignments/${publicId}`);
            } catch (cloudinaryError) {
                console.warn('Failed to delete file from Cloudinary:', cloudinaryError);
            }
        }

        // Delete all submissions for this assignment
        await Submission.deleteMany({ assignment: req.params.id });

        // Delete the assignment
        await Assignment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully'
        });

    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting assignment'
        });
    }
};

/**
 * @desc    Submit an assignment (student)
 * @route   POST /api/assignments/:id/submit
 * @access  Private (Students only)
 */
export const submitAssignment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if assignment is for student's batch
        if (!req.user.batch || assignment.batch.toString() !== req.user.batch.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - assignment not for your batch'
            });
        }

        // Check if assignment is still open
        if (new Date() > assignment.dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Assignment deadline has passed'
            });
        }

        // Check if student has already submitted
        const existingSubmission = await Submission.findOne({
            assignment: req.params.id,
            student: req.user._id
        });

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'Assignment already submitted'
            });
        }

        // Create submission
        const submission = new Submission({
            assignment: req.params.id,
            student: req.user._id,
            submittedAt: new Date(),
            status: 'submitted'
        });

        // Handle file upload
        if (req.file) {
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.v2.uploader.upload_stream({
                        folder: 'submissions',
                        resource_type: 'auto'
                    }, (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    });
                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const uploadResult = await streamUpload();
            submission.fileUrl = uploadResult.secure_url;
            submission.fileName = req.file.originalname;
        }

        // Add text submission if provided
        if (req.body.textSubmission) {
            submission.textSubmission = req.body.textSubmission;
        }

        await submission.save();

        // Populate and return the submission
        const populatedSubmission = await Submission.findById(submission._id)
            .populate('assignment', 'title dueDate totalMarks')
            .populate('student', 'name email');

        res.status(201).json({
            success: true,
            submission: populatedSubmission
        });

    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while submitting assignment'
        });
    }
};

/**
 * @desc    Grade a submission
 * @route   PUT /api/assignments/:id/grade/:submissionId
 * @access  Private (Teachers only)
 */
export const gradeSubmission = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id) || 
            !mongoose.Types.ObjectId.isValid(req.params.submissionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment or submission ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if user is the teacher who created this assignment
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - not your assignment'
            });
        }

        const submission = await Submission.findById(req.params.submissionId);

        if (!submission) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Check if submission belongs to this assignment
        if (submission.assignment.toString() !== req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Submission does not belong to this assignment'
            });
        }

        const { marks, feedback } = req.body;

        // Validate marks
        if (marks < 0 || marks > assignment.totalMarks) {
            return res.status(400).json({
                success: false,
                message: `Marks must be between 0 and ${assignment.totalMarks}`
            });
        }

        // Update submission
        submission.marks = marks;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.gradedBy = req.user._id;

        await submission.save();

        // Populate and return the graded submission
        const gradedSubmission = await Submission.findById(submission._id)
            .populate('assignment', 'title totalMarks')
            .populate('student', 'name email')
            .populate('gradedBy', 'name');

        res.status(200).json({
            success: true,
            submission: gradedSubmission
        });

    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while grading submission'
        });
    }
};

/**
 * @desc    Get all submissions for an assignment
 * @route   GET /api/assignments/:id/submissions
 * @access  Private (Teachers only)
 */
export const getSubmissions = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assignment ID'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if user is the teacher who created this assignment
        if (assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied - not your assignment'
            });
        }

        const submissions = await Submission.find({ assignment: req.params.id })
            .populate('student', 'name email')
            .populate('gradedBy', 'name')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: submissions.length,
            submissions
        });

    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching submissions'
        });
    }
};
