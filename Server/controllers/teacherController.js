import asyncHandler from 'express-async-handler';
import Teacher from '../models/Teacher.js';
import Batch from '../models/Batch.js';
import Course from '../models/Course.js';

/**
 * @desc    Get logged-in teacher's complete profile
 * @route   GET /api/teacher/profile
 * @access  Private (Teacher)
 */
export const getTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id)
    .select('-password -__v -emailVerificationToken -passwordResetToken -passwordResetExpires')
    .lean();

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Get batches linked to this teacher
  const batches = await Batch.find({ teacherId: req.user._id })
    .select('name startDate endDate courseId')
    .populate({
      path: 'courseId',
      select: 'name duration',
    })
    .lean();

  // Extract unique course IDs from batches
  const courseIds = [
    ...new Set(
      batches
        .map(batch => batch.courseId?._id?.toString())
        .filter(Boolean)
    ),
  ];

  // Fetch course details
  const courses = await Course.find({ _id: { $in: courseIds } })
    .select('name duration')
    .lean();

  res.status(200).json({
    ...teacher,
    batches,
    courses,
  });
});

/**
 * @desc    Update teacher profile (can update only editable fields)
 * @route   PUT /api/teacher/profile
 * @access  Private (Teacher)
 */
export const updateTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id);

  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Define which fields are editable by the teacher
  const allowedFields = [
    'email',
    'password',
    'mobile',
    'profilePicture',
    'bio',
    'address',
    'preferences',
  ];

  // Update only allowed fields
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      teacher[field] = req.body[field];
    }
  });

  // If password is updated, it will be hashed via pre-save middleware
  const updatedTeacher = await teacher.save();

  res.status(200).json({
    message: 'Profile updated successfully',
    profile: {
      _id: updatedTeacher._id,
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      mobile: updatedTeacher.mobile,
      profilePicture: updatedTeacher.profilePicture,
      bio: updatedTeacher.bio,
      address: updatedTeacher.address,
      preferences: updatedTeacher.preferences,
    },
  });
});
