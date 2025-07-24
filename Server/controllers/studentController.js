import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import configureCloudinary from '../config/cloudinary.js';

// Initialize Cloudinary configuration
configureCloudinary();

// GET /api/student/:id/profile
export const getProfile = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Find student by their own ID (not user reference)
    const student = await Student.findById(studentId)
      .select('-password -passwordResetToken -emailVerificationToken')
      .populate('batch', 'name startDate endDate schedule')
      .populate('courses', 'name description duration instructor')
      .populate('enrolledCourses.course', 'name description instructor');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Calculate dynamic data
    const attendancePercentage = student.attendance?.percentage || 0;
    const totalCourses = student.enrolledCourses?.length || 0;
    const activeCourses = student.enrolledCourses?.filter(course => course.status === 'active').length || 0;

    // Prepare profile response
    const profileData = {
      // Basic Information
      id: student._id,
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      profilePicture: student.profilePicture,

      // Personal Details
      gender: student.gender,
      dateOfBirth: student.dateOfBirth,
      address: student.address,

      // Family Information
      parentName: student.parentName,
      parentContact: student.parentContact,

      // Academic Information
      grade: student.grade,
      schoolName: student.schoolName,
      batch: student.batch,
      joinDate: student.joinDate,

      // Course Information
      courses: student.courses,
      enrolledCourses: student.enrolledCourses,
      totalCourses,
      activeCourses,

      // Attendance Data
      attendance: {
        percentage: attendancePercentage,
        totalClasses: student.attendance?.totalClasses || 0,
        attendedClasses: student.attendance?.attendedClasses || 0,
        records: student.attendance?.records || []
      },

      // Academic Performance
      examHistory: student.examHistory || [],

      // Account Information
      status: student.status,
      role: student.role,
      lastLogin: student.lastLogin,
      emailVerified: student.emailVerified,

      // Preferences
      preferences: student.preferences,

      // Resources
      resources: student.resources,
      paymentHistory: student.paymentHistory,

      // Timestamps
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    };

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: profileData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving profile'
    });
  }
};

// PATCH /api/student/:id/profile
export const updateProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const {
      name,
      email,
      mobile,
      gender,
      dateOfBirth,
      parentName,
      parentContact,
      address,
      grade,
      schoolName,
      preferences
    } = req.body;

    // Build updates object with only provided fields
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (mobile) updates.mobile = mobile;
    if (gender) updates.gender = gender;
    if (dateOfBirth) updates.dateOfBirth = dateOfBirth;
    if (parentName) updates.parentName = parentName;
    if (parentContact) updates.parentContact = parentContact;
    if (address) updates.address = address;
    if (grade) updates.grade = grade;
    if (schoolName) updates.schoolName = schoolName;
    if (preferences) updates.preferences = preferences;

    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    // Check for duplicate email/mobile if updating these fields
    if (updates.email || updates.mobile) {
      const existingStudent = await Student.findOne({
        $and: [
          { _id: { $ne: studentId } },
          {
            $or: [
              { email: updates.email },
              { mobile: updates.mobile }
            ]
          }
        ]
      });

      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'Email or mobile number already exists'
        });
      }
    }

    // Update student profile
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    ).select('-password -passwordResetToken -emailVerificationToken');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });

  } catch (error) {
    console.error('Update profile error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// POST /api/student/:id/profile-picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if file is uploaded
    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a profile picture'
      });
    }

    const profilePic = req.files.profilePic;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(profilePic.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only image files (JPEG, PNG, GIF) are allowed'
      });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (profilePic.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size should not exceed 5MB'
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(profilePic.tempFilePath, {
      folder: 'profile-pictures/students',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto'
    });

    // Update student profile picture
    const student = await Student.findByIdAndUpdate(
      studentId,
      { $set: { profilePicture: uploadResult.secure_url } },
      { new: true }
    ).select('-password -passwordResetToken -emailVerificationToken');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        profilePicture: student.profilePicture,
        cloudinaryId: uploadResult.public_id
      }
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading profile picture'
    });
  }
};

// PATCH /api/student/:id/change-password
export const changePassword = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both old and new passwords are required"
      });
    }

    // Validate new password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long"
      });
    }

    // Find student with password field included
    const student = await Student.findById(studentId).select('+password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    student.password = hashedNewPassword;
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while changing password"
    });
  }
};
