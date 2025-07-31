// controllers/assignmentController.js
import Assignment from '../models/Assignment.js';
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

        res.status(201).json({
            success: true,
            message: 'Assignment created successfully',
            assignment
        });

    } catch (error) {
        console.error('Assignment creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create assignment',
            error: error.message
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
        const { courseId, batchId, status } = req.query;

        // Build filter object based on query params
        const filter = {};

        if (courseId) filter.course = courseId;
        if (batchId) filter.batch = batchId;
        if (status) filter.status = status;

        // For teachers, only show their assignments
        if (req.user.role === 'teacher') {
            filter.teacher = req.user._id;
        }

        // For students, only show assignments for their batches
        if (req.user.role === 'student') {
            // Get student's batch from their profile
            const student = await Student.findOne({ user: req.user._id });

            if (student && student.batch) {
                filter.batch = student.batch;
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Student not assigned to any batch'
                });
            }
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
            message: 'Error fetching assignments',
            error: error.message
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
        const assignment = await Assignment.findById(req.params.id)
            .populate('course', 'name')
            .populate('batch', 'name')
            .populate('teacher', 'name')
            .populate('submissions.student', 'name email');

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // For students, check if they belong to the batch
        if (req.user.role === 'student') {
            const student = await Student.findOne({ user: req.user._id });

            if (!student || !student.batch || student.batch.toString() !== assignment.batch.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have access to this assignment'
                });
            }

            // Check if student has already submitted
            const submission = assignment.submissions.find(
                sub => sub.student.toString() === req.user._id.toString()
            );

            assignment._doc.hasSubmitted = !!submission;
            assignment._doc.submission = submission || null;
        }

        res.status(200).json({
            success: true,
            assignment
        });

    } catch (error) {
        console.error('Get assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching assignment',
            error: error.message
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
        const { title, description, dueDate, totalMarks, status } = req.body;

        let assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if teacher owns this assignment
        if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this assignment'
            });
        }

        // Update fields
        assignment.title = title || assignment.title;
        assignment.description = description || assignment.description;
        assignment.dueDate = dueDate ? new Date(dueDate) : assignment.dueDate;
        assignment.totalMarks = totalMarks || assignment.totalMarks;
        assignment.status = status || assignment.status;

        // Handle file upload
        if (req.file) {
            // Delete existing file from Cloudinary if present
            if (assignment.fileUrl) {
                const publicId = assignment.fileUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }

            // Upload new file
            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream({
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

            // Update file data
            assignment.fileUrl = uploadResult.secure_url;
            assignment.fileName = req.file.originalname;
        }

        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Assignment updated successfully',
            assignment
        });

    } catch (error) {
        console.error('Update assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating assignment',
            error: error.message
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
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if teacher owns this assignment
        if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this assignment'
            });
        }

        // Delete file from Cloudinary if present
        if (assignment.fileUrl) {
            const publicId = assignment.fileUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        // Delete all submission files
        for (const submission of assignment.submissions) {
            if (submission.fileUrl) {
                const publicId = submission.fileUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }

        await assignment.remove();

        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully'
        });

    } catch (error) {
        console.error('Delete assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting assignment',
            error: error.message
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
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if student is in the batch
        const student = await Student.findOne({ user: req.user._id });

        if (!student || !student.batch || student.batch.toString() !== assignment.batch.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You do not have access to this assignment'
            });
        }

        // Check if submission deadline has passed
        const now = new Date();
        const isLate = now > assignment.dueDate;

        // Check if student has already submitted
        const existingSubmission = assignment.submissions.find(
            sub => sub.student.toString() === req.user._id.toString()
        );

        if (existingSubmission) {
            return res.status(400).json({
                success: false,
                message: 'You have already submitted this assignment'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Upload file to Cloudinary
        const streamUpload = () => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({
                    folder: 'assignment-submissions',
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

        // Create submission object
        const submission = {
            student: req.user._id,
            submittedOn: now,
            fileUrl: uploadResult.secure_url,
            fileName: req.file.originalname,
            status: isLate ? 'late' : 'submitted'
        };

        // Add submission to assignment
        assignment.submissions.push(submission);
        await assignment.save();

        res.status(201).json({
            success: true,
            message: isLate ? 'Assignment submitted late' : 'Assignment submitted successfully',
            submission
        });

    } catch (error) {
        console.error('Submit assignment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting assignment',
            error: error.message
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
        const { grade, feedback } = req.body;

        if (!grade || grade < 0 || grade > 100) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid grade between 0 and 100'
            });
        }

        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if teacher owns this assignment
        if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to grade this assignment'
            });
        }

        // Find submission
        const submissionIndex = assignment.submissions.findIndex(
            sub => sub._id.toString() === req.params.submissionId
        );

        if (submissionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Submission not found'
            });
        }

        // Update submission
        assignment.submissions[submissionIndex].grade = grade;
        assignment.submissions[submissionIndex].feedback = feedback;
        assignment.submissions[submissionIndex].status = 'graded';

        await assignment.save();

        res.status(200).json({
            success: true,
            message: 'Submission graded successfully',
            submission: assignment.submissions[submissionIndex]
        });

    } catch (error) {
        console.error('Grade submission error:', error);
        res.status(500).json({
            success: false,
            message: 'Error grading submission',
            error: error.message
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
        const assignment = await Assignment.findById(req.params.id)
            .populate('submissions.student', 'name email');

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        // Check if teacher owns this assignment
        if (req.user.role === 'teacher' && assignment.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view these submissions'
            });
        }

        res.status(200).json({
            success: true,
            count: assignment.submissions.length,
            submissions: assignment.submissions
        });

    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching submissions',
            error: error.message
        });
    }
};
