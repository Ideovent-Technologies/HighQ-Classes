import asyncHandler from 'express-async-handler';
import Teacher from '../models/Teacher.js';

// @desc    Get logged-in teacher's profile
// @route   GET /api/teacher/profile
// @access  Private (Teacher only)
export const getTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id).select('-password');
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }
  res.json(teacher);
});

// @desc    Update logged-in teacher's profile (email/password only)
// @route   PUT /api/teacher/profile
// @access  Private (Teacher only)
export const updateTeacherProfile = asyncHandler(async (req, res) => {
  const teacher = await Teacher.findById(req.user._id);
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }

  // Update only allowed fields
  const { email, password } = req.body;

  if (email) teacher.email = email;
  if (password) teacher.password = password;

  const updatedTeacher = await teacher.save();

  res.json({
    _id: updatedTeacher._id,
    name: updatedTeacher.name,
    email: updatedTeacher.email,
  });
});
