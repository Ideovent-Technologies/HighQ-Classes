import mongoose from 'mongoose';
import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import configureCloudinary from '../config/cloudinary.js';

configureCloudinary();

/**
 * GET /api/student/:id/profile
 */
export const getProfile = async (req, res) => {
  try {
    const studentId = new mongoose.Types.ObjectId(req.params.id);

    const result = await Student.aggregate([
      { $match: { _id: studentId } },

      // Lookup all enrolled course details
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses.course',
          foreignField: '_id',
          as: 'enrolledCoursesData'
        }
      },

      // Add course & batch details into enrolledCourses array
      {
        $addFields: {
          enrolledCourses: {
            $map: {
              input: '$enrolledCourses',
              as: 'ec',
              in: {
                $mergeObjects: [
                  '$$ec',
                  {
                    course: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: '$enrolledCoursesData',
                            as: 'cd',
                            cond: { $eq: ['$$cd._id', '$$ec.course'] }
                          }
                        },
                        0
                      ]
                    },
                    batch: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: {
                              $arrayElemAt: [
                                {
                                  $filter: {
                                    input: '$enrolledCoursesData',
                                    as: 'cd',
                                    cond: { $eq: ['$$cd._id', '$$ec.course'] }
                                  }
                                },
                                0
                              ]
                            }.batches,
                            as: 'b',
                            cond: { $eq: ['$$b._id', '$$ec.batch'] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      // Remove temp data
      { $project: { enrolledCoursesData: 0, password: 0, passwordResetToken: 0, emailVerificationToken: 0 } }
    ]);

    if (!result.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = result[0];
    const attendancePercentage = student.attendance?.percentage || 0;
    const totalCourses = student.enrolledCourses?.length || 0;
    const activeCourses = student.enrolledCourses?.filter(c => c.status === 'active').length || 0;

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: {
        ...student,
        totalCourses,
        activeCourses,
        attendance: {
          percentage: attendancePercentage,
          totalClasses: student.attendance?.totalClasses || 0,
          attendedClasses: student.attendance?.attendedClasses || 0,
          records: student.attendance?.records || []
        }
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error while retrieving profile' });
  }
};

/**
 * PATCH /api/student/:id/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const studentId = req.params.id;
    const allowedFields = [
      'name', 'email', 'mobile', 'gender', 'dateOfBirth',
      'parentName', 'parentContact', 'address', 'grade',
      'schoolName', 'preferences'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update" });
    }

    // Duplicate check for email/mobile
    if (updates.email || updates.mobile) {
      const existingStudent = await Student.findOne({
        $and: [
          { _id: { $ne: studentId } },
          { $or: [{ email: updates.email }, { mobile: updates.mobile }] }
        ]
      });
      if (existingStudent) {
        return res.status(409).json({ success: false, message: 'Email or mobile number already exists' });
      }
    }

    const student = await Student.findByIdAndUpdate(studentId, { $set: updates }, { new: true, runValidators: true })
      .select('-password -passwordResetToken -emailVerificationToken');

    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: student });

  } catch (error) {
    console.error('Update profile error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: Object.values(error.errors).map(err => err.message) });
    }
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `${field} already exists` });
    }
    res.status(500).json({ success: false, message: 'Server error while updating profile' });
  }
};

/**
 * POST /api/student/:id/profile-picture
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!req.files || !req.files.profilePic) {
      return res.status(400).json({ success: false, message: 'Please upload a profile picture' });
    }

    const profilePic = req.files.profilePic;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(profilePic.mimetype)) {
      return res.status(400).json({ success: false, message: 'Only image files (JPEG, PNG, GIF) are allowed' });
    }

    if (profilePic.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'File size should not exceed 5MB' });
    }

    const uploadResult = await cloudinary.uploader.upload(profilePic.tempFilePath, {
      folder: 'profile-pictures/students',
      width: 300,
      height: 300,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto'
    });

    const student = await Student.findByIdAndUpdate(studentId, { $set: { profilePicture: uploadResult.secure_url } }, { new: true })
      .select('-password -passwordResetToken -emailVerificationToken');

    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    res.status(200).json({ success: true, message: 'Profile picture updated successfully', data: { profilePicture: student.profilePicture, cloudinaryId: uploadResult.public_id } });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ success: false, message: 'Server error while uploading profile picture' });
  }
};

/**
 * PATCH /api/student/:id/change-password
 */
export const changePassword = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Both old and new passwords are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters long" });
    }

    const student = await Student.findById(studentId).select('+password');
    if (!student) return res.status(404).json({ success: false, message: "Student not found" });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Old password is incorrect" });

    const salt = await bcrypt.genSalt(12);
    student.password = await bcrypt.hash(newPassword, salt);
    student.passwordResetToken = undefined;
    student.passwordResetExpires = undefined;

    await student.save();
    res.status(200).json({ success: true, message: "Password updated successfully" });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ success: false, message: "Server error while changing password" });
  }
};

// GET /api/student/batch
export const getStudentBatch = async (req, res) => {
  try {
    const studentId = req.user.id; // Get from authenticated user

    // Find student and populate batch with detailed information
    const student = await Student.findById(studentId)
      .populate({
        path: 'batch',
        populate: [
          {
            path: 'courseId',
            select: 'name description duration instructor topics'
          },
          {
            path: 'teacherId',
            select: 'name email employeeId qualification specialization profilePicture'
          },
          {
            path: 'students',
            select: 'name email grade profilePicture'
          }
        ]
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (!student.batch) {
      return res.status(404).json({
        success: false,
        message: 'Student is not assigned to any batch'
      });
    }

    const batch = student.batch;

    // Format the response
    const batchInfo = {
      _id: batch._id,
      name: batch.name,
      course: {
        _id: batch.courseId._id,
        name: batch.courseId.name,
        description: batch.courseId.description,
        duration: batch.courseId.duration,
        instructor: batch.courseId.instructor,
        topics: batch.courseId.topics || []
      },
      teacher: {
        _id: batch.teacherId._id,
        name: batch.teacherId.name,
        email: batch.teacherId.email,
        employeeId: batch.teacherId.employeeId,
        qualification: batch.teacherId.qualification,
        specialization: batch.teacherId.specialization,
        profilePicture: batch.teacherId.profilePicture
      },
      students: batch.students.map(student => ({
        _id: student._id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        profilePicture: student.profilePicture
      })),
      schedule: batch.schedule,
      startDate: batch.startDate,
      endDate: batch.endDate,
      totalStudents: batch.students.length,
      isActive: batch.status === 'active'
    };

    res.status(200).json({
      success: true,
      batch: batchInfo
    });

  } catch (error) {
    console.error("Get student batch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching batch information"
    });
  }
};
