import Recording from "../models/Recording.js";
import Batch from "../models/Batch.js";
import { uploadToCloudinary, removeFromCloudinary } from "../utils/fileUtils.js";
import mongoose from "mongoose";

/**
 * @desc    Upload a new recording
 * @route   POST /api/recordings
 * @access  Private (Teachers, Admins)
 */
export const uploadRecording = async (req, res) => {
    try {
        const { title, description, subject, batchId, courseId } = req.body;

        // Validate required fields
        if (!title || !subject || !courseId || !batchId) {
            return res.status(400).json({
                success: false,
                message: "Title, subject, courseId, and batchId are required",
            });
        }

        // Validate video file
        if (!req.files || !req.files.video) {
            return res.status(400).json({
                success: false,
                message: "Please upload a video file",
            });
        }

        // Check if batch exists
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({
                success: false,
                message: "Batch not found",
            });
        }

        // Upload to Cloudinary
        const videoFile = req.files.video;
        const cloudinaryResult = await uploadToCloudinary(videoFile, "videos");

        if (!cloudinaryResult.secure_url || !cloudinaryResult.public_id) {
            return res.status(500).json({
                success: false,
                message: "Error uploading video to cloud storage",
            });
        }

        // Calculate expiration date (3 days from now)
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3);

        // Create new recording
        const recording = await Recording.create({
            title,
            description,
            subject,
            batch: batchId,
            course: courseId,
            teacher: req.user._id, // From auth middleware
            fileUrl: cloudinaryResult.secure_url,
            fileId: cloudinaryResult.public_id,
            thumbnailUrl: cloudinaryResult.thumbnail_url || "",
            duration: cloudinaryResult.duration || 0,
            accessExpires: expireDate,
        });

        res.status(201).json({
            success: true,
            data: recording,
            message: "Recording uploaded successfully",
        });
    } catch (error) {
        console.error("Error uploading recording:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload recording",
            error: error.message,
        });
    }
};


/**
 * @desc    Get all recordings (with filters)
 * @route   GET /api/recordings
 * @access  Private (Teachers, Admins)
 */
export const getRecordings = async (req, res) => {
    try {
        const { batchId, courseId, subject, active } = req.query;

        // Build query
        const query = {};

        if (batchId) query.batch = batchId;
        if (courseId) query.course = courseId;
        if (subject) query.subject = subject;
        if (active === "true") query.isActive = true;

        // For teachers, only show their own recordings
        if (req.user.role === "teacher") {
            query.teacher = req.user._id;
        }

        const recordings = await Recording.find(query)
            .populate("batch", "name")
            .populate("course", "name")
            .populate("teacher", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recordings.length,
            data: recordings,
        });
    } catch (error) {
        console.error("Error fetching recordings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recordings",
            error: error.message,
        });
    }
};

/**
 * @desc    Get student accessible recordings
 * @route   GET /api/recordings/student
 * @access  Private (Students)
 */
export const getStudentRecordings = async (req, res) => {
    try {
        // Get student's batch from auth middleware or query
        const batchId = req.query.batchId || req.user.batch;

        if (!batchId) {
            return res.status(400).json({
                success: false,
                message: "Batch ID is required",
            });
        }

        // Find recordings accessible to student (not expired)
        const recordings = await Recording.find({
            batch: batchId,
            accessExpires: { $gt: new Date() },
            isActive: true,
        })
            .populate("course", "name")
            .populate("teacher", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: recordings.length,
            data: recordings,
        });
    } catch (error) {
        console.error("Error fetching student recordings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recordings",
            error: error.message,
        });
    }
};

/**
 * @desc    Get a single recording by ID
 * @route   GET /api/recordings/:id
 * @access  Private
 */
export const getRecording = async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id)
            .populate("batch", "name")
            .populate("course", "name")
            .populate("teacher", "name");

        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "Recording not found",
            });
        }

        // Check if recording has expired for students
        if (req.user.role === "student" && !recording.isAccessible()) {
            return res.status(403).json({
                success: false,
                message: "Access to this recording has expired",
            });
        }

        // For students, track viewing statistics
        if (req.user.role === "student") {
            // Find if student already viewed this recording
            const viewedByIndex = recording.viewedBy.findIndex(
                (view) => view.student.toString() === req.user._id.toString()
            );

            if (viewedByIndex > -1) {
                // Update existing view record
                recording.viewedBy[viewedByIndex].viewCount += 1;
                recording.viewedBy[viewedByIndex].lastViewed = new Date();
            } else {
                // Add new view record
                recording.viewedBy.push({
                    student: req.user._id,
                    viewCount: 1,
                    lastViewed: new Date(),
                });
            }

            // Increment total views
            recording.views += 1;
            await recording.save();
        }

        res.status(200).json({
            success: true,
            data: recording,
        });
    } catch (error) {
        console.error("Error fetching recording:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recording",
            error: error.message,
        });
    }
};

/**
 * @desc    Update a recording
 * @route   PUT /api/recordings/:id
 * @access  Private (Teachers who own the recording, Admins)
 */
export const updateRecording = async (req, res) => {
    try {
        const { title, description, subject, accessExpires, isActive } = req.body;

        let recording = await Recording.findById(req.params.id);

        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "Recording not found",
            });
        }

        // Check ownership for teachers
        if (req.user.role === "teacher" &&
            recording.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this recording",
            });
        }

        // Update recording
        recording.title = title || recording.title;
        recording.description = description || recording.description;
        recording.subject = subject || recording.subject;

        // Only update these fields if provided
        if (accessExpires) {
            recording.accessExpires = new Date(accessExpires);
        }

        if (isActive !== undefined) {
            recording.isActive = isActive;
        }

        await recording.save();

        res.status(200).json({
            success: true,
            data: recording,
            message: "Recording updated successfully",
        });
    } catch (error) {
        console.error("Error updating recording:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update recording",
            error: error.message,
        });
    }
};

/**
 * @desc    Delete a recording
 * @route   DELETE /api/recordings/:id
 * @access  Private (Teachers who own the recording, Admins)
 */
export const deleteRecording = async (req, res) => {
    try {
        const recording = await Recording.findById(req.params.id);

        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "Recording not found",
            });
        }

        // Check ownership for teachers
        if (req.user.role === "teacher" &&
            recording.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this recording",
            });
        }

        // Delete from Cloudinary
        if (recording.fileId) {
            await removeFromCloudinary(recording.fileId);
        }

        // Delete from database
        await recording.deleteOne();

        res.status(200).json({
            success: true,
            message: "Recording deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting recording:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete recording",
            error: error.message,
        });
    }
};

/**
 * @desc    Get recording analytics
 * @route   GET /api/recordings/analytics
 * @access  Private (Teachers, Admins)
 */
export const getRecordingAnalytics = async (req, res) => {
    try {
        const { batchId, courseId, period } = req.query;

        // Set date range based on period
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 30); // Default to last 30 days

        if (period === "week") {
            startDate.setDate(startDate.getDate() - 7 + 30); // Last 7 days
        } else if (period === "month") {
            startDate.setMonth(startDate.getMonth() - 1 + 1); // Last month
        } else if (period === "quarter") {
            startDate.setMonth(startDate.getMonth() - 3 + 1); // Last quarter
        }

        // Build query
        const query = {
            createdAt: { $gte: startDate },
        };

        if (batchId) query.batch = batchId;
        if (courseId) query.course = courseId;

        // For teachers, only show their own recordings
        if (req.user.role === "teacher") {
            query.teacher = req.user._id;
        }

        // Aggregation pipeline for analytics
        const analytics = await Recording.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalRecordings: { $sum: 1 },
                    totalViews: { $sum: "$views" },
                    averageViews: { $avg: "$views" },
                    uniqueViewers: {
                        $addToSet: "$viewedBy.student"
                    },
                    subjectDistribution: {
                        $push: "$subject"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRecordings: 1,
                    totalViews: 1,
                    averageViews: { $round: ["$averageViews", 2] },
                    uniqueViewers: { $size: "$uniqueViewers" },
                    subjectDistribution: 1
                }
            }
        ]);

        // Process subject distribution
        const subjects = {};
        if (analytics.length > 0 && analytics[0].subjectDistribution) {
            analytics[0].subjectDistribution.forEach(subject => {
                subjects[subject] = (subjects[subject] || 0) + 1;
            });
            analytics[0].subjectDistribution = subjects;
        }

        // Get most viewed recordings
        const topRecordings = await Recording.find(query)
            .sort({ views: -1 })
            .limit(5)
            .select("title views subject")
            .lean();

        res.status(200).json({
            success: true,
            data: {
                summary: analytics.length > 0 ? analytics[0] : {
                    totalRecordings: 0,
                    totalViews: 0,
                    averageViews: 0,
                    uniqueViewers: 0
                },
                topRecordings
            }
        });
    } catch (error) {
        console.error("Error getting recording analytics:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get recording analytics",
            error: error.message,
        });
    }
};

/**
 * @desc    Extend recording access duration
 * @route   PUT /api/recordings/:id/extend
 * @access  Private (Teachers who own the recording, Admins)
 */
export const extendRecordingAccess = async (req, res) => {
    try {
        const { days } = req.body;

        if (!days || isNaN(days) || days <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid number of days to extend",
            });
        }

        const recording = await Recording.findById(req.params.id);

        if (!recording) {
            return res.status(404).json({
                success: false,
                message: "Recording not found",
            });
        }

        // Check ownership for teachers
        if (req.user.role === "teacher" &&
            recording.teacher.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to extend this recording",
            });
        }

        // Calculate new expiration date
        const currentExpiry = new Date(recording.accessExpires);
        const newExpiry = new Date(currentExpiry);
        newExpiry.setDate(newExpiry.getDate() + parseInt(days));

        // Update recording
        recording.accessExpires = newExpiry;
        await recording.save();

        res.status(200).json({
            success: true,
            data: {
                id: recording._id,
                title: recording.title,
                previousExpiry: currentExpiry,
                newExpiry: recording.accessExpires,
            },
            message: `Recording access extended by ${days} days`,
        });
    } catch (error) {
        console.error("Error extending recording access:", error);
        res.status(500).json({
            success: false,
            message: "Failed to extend recording access",
            error: error.message,
        });
    }
};

/**
 * @desc    Search recordings by title (partial match)
 * @route   GET /api/recordings/search?query=
 * @access  Private (Teachers, Admins)
 */
export const searchRecordings = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Search query is required",
            });
        }

        const searchRegex = new RegExp(query, 'i'); // Case-insensitive partial match

        const filters = {
            title: { $regex: searchRegex }
        };

        // For teachers, restrict to their own recordings
        if (req.user.role === "teacher") {
            filters.teacher = req.user._id;
        }

        const results = await Recording.find(filters)
            .populate("batch", "name")
            .populate("course", "name")
            .populate("teacher", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results,
        });
    } catch (error) {
        console.error("Error searching recordings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to search recordings",
            error: error.message,
        });
    }
};
