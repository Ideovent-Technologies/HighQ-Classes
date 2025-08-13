// Server/controllers/adminController.js
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Batch from "../models/Batch.js";
import Fee from "../models/Fee.js";
import Notice from "../models/Notice.js";
import bcrypt from "bcryptjs";



// 🧠 Admin Dashboard Data

// ✅ GET /api/admin/dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, totalBatches] = await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      Course.countDocuments(),
      Batch.countDocuments()
    ]);

    const paidFees = await Fee.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const pendingFees = await Fee.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Get recent notices for dashboard
    const recentNotices = await Notice.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title content createdAt');

    // Calculate active users (students and teachers who logged in within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [activeStudents, activeTeachers] = await Promise.all([
      Student.countDocuments({ lastLogin: { $gte: oneDayAgo } }),
      Teacher.countDocuments({ lastLogin: { $gte: oneDayAgo } })
    ]);

    // Count pending approvals (students or teachers with pending status)
    const [pendingStudents, pendingTeachers] = await Promise.all([
      Student.countDocuments({ status: 'pending' }),
      Teacher.countDocuments({ status: 'pending' })
    ]);

    res.status(200).json({
      success: true,
      totalStudents,
      totalTeachers,
      totalCourses,
      totalBatches,
      totalRevenue: paidFees[0]?.total || 0,
      totalFeeCollected: paidFees[0]?.total || 0,
      totalFeePending: pendingFees[0]?.total || 0,
      activeUsers: activeStudents + activeTeachers,
      pendingApprovals: pendingStudents + pendingTeachers,
      recentNotices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
      error: error.message
    });
  }
};

// ---------------------- new sync endpoint ----------------------
/**
 * POST /api/admin/sync/relations
 * One-off: iterate batches and ensure Teacher.batches, Teacher.courseIds and Course.batches are in sync.
 * Protected – admin only.
 */
export const syncRelations = async (req, res) => {
  try {
    // Optionally accept a query param ?limit=100 to limit how many batches processed in one run
    const limit = parseInt(req.query.limit, 10) || 0; // 0 => process all
    const filter = {};
    const batches = limit > 0
      ? await Batch.find(filter).limit(limit).lean()
      : await Batch.find(filter).lean();

    let updatedCount = 0;
    const errors = [];

    for (const b of batches) {
      try {
        const batchId = b._id;
        const teacherId = b.teacherId;
        const courseId = b.courseId;

        // Update teacher: add batchId and courseId
        if (teacherId) {
          await Teacher.findByIdAndUpdate(
            teacherId,
            { $addToSet: { batches: batchId, courseIds: courseId } },
            { new: true }
          );
        }

        // Update course: add embedded batch object if missing
        if (courseId) {
          // Use name and startDate to avoid duplicates (Course.batches is an embedded array)
          await Course.updateOne(
            { _id: courseId, "batches.name": { $ne: b.name } },
            {
              $addToSet: {
                batches: {
                  name: b.name,
                  startDate: b.startDate,
                  teacher: teacherId
                }
              }
            }
          );
        }

        updatedCount++;
      } catch (innerErr) {
        console.error("Error syncing batch", b._id, innerErr);
        errors.push({ batchId: b._id, message: innerErr.message });
      }
    }

    res.json({
      success: true,
      message: "Sync completed",
      processed: batches.length,
      updated: updatedCount,
      errors
    });
  } catch (err) {
    console.error("syncRelations error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
// ---------------------- end sync endpoint ----------------------

// ✅ GET /api/admin/profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select(
      '-password -loginAttempts -lockUntil -passwordResetToken -passwordResetExpires -emailVerificationToken'
    );

    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin profile',
      error: error.message
    });
  }
};

// ✅ All Students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select('-password')
      .populate('batch', 'name'); // Only get batch name
    res.json({ success: true, students });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students',
      error: error.message
    });
  }
};

// ✅ All Teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select('-password');
    res.json({ success: true, teachers });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching teachers',
      error: error.message
    });
  }
};

// ✅ Add Student
export const addStudent = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const exists = await Student.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Student already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const student = new Student({ email, password: hashedPassword, ...rest });
    await student.save();

    res.status(201).json({ message: 'Student added successfully', student });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

// ✅ Update Student
export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ message: 'Student updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
};

// ✅ Delete Student
export const deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

// ✅ Add Teacher
export const addTeacher = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;
    const exists = await Teacher.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Teacher already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const teacher = new Teacher({ email, password: hashedPassword, ...rest });
    await teacher.save();

    res.status(201).json({ message: 'Teacher added successfully', teacher });
  } catch (error) {
    res.status(500).json({ message: 'Error adding teacher', error: error.message });
  }
};

// ✅ Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ message: 'Teacher updated', updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating teacher', error: error.message });
  }
};

// ✅ Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    await Teacher.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting teacher', error: error.message });
  }
};

// ✅ Generic Update User by ID (check both models)
export const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);
    const teacher = await Teacher.findById(id);
    const model = student ? Student : teacher ? Teacher : null;

    if (!model) return res.status(404).json({ success: false, message: 'User not found' });

    const updated = await model.findByIdAndUpdate(id, req.body, { new: true }).select('-password');
    res.json({ success: true, user: updated, message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user', error: error.message });
  }
};

// ✅ Generic Delete User
export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Student.findById(id);
    const teacher = await Teacher.findById(id);
    const model = student ? Student : teacher ? Teacher : null;

    if (!model) return res.status(404).json({ success: false, message: 'User not found' });

    await model.findByIdAndDelete(id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
};

// ✅ Create User from Admin Panel
export const CreateUser = async (req, res) => {
  try {
    const { role, email, password, ...rest } = req.body;

    if (!role || !email || !password)
      return res.status(400).json({ success: false, message: 'Missing required fields' });

    const Model = role === 'student' ? Student : role === 'teacher' ? Teacher : role === 'admin' ? Admin : null;
    if (!Model) return res.status(400).json({ success: false, message: 'Invalid role' });

    const exists = await Model.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: `${role} already exists` });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Model({ email, password: hashedPassword, ...rest });

    await user.save();
    res.status(201).json({ success: true, message: `${role} created successfully`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
  }
};

// ✅ Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { message, visibleTo = ['student', 'teacher'], expiresAt } = req.body;

    if (!message || message.trim() === '')
      return res.status(400).json({ message: 'Message is required' });

    const notice = new Notice({
      message,
      visibleTo,
      expiresAt,
      createdBy: req.user.id,
      role: req.user.role || 'admin'
    });

    await notice.save();
    res.status(201).json({ message: 'Notice created successfully', notice });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
};

/**
 * PATCH /api/admin/user/:id/status
 * Body: { role: "student" | "teacher", status: "active" | ... }
 */
export const changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    if (!role || !['student', 'teacher'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be student or teacher' });
    }

    // Allowed statuses
    const allowedStatuses = role === 'teacher'
      ? ['pending', 'active', 'suspended', 'inactive', 'on-leave']
      : ['pending', 'active', 'suspended', 'inactive'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const Model = role === 'student' ? Student : Teacher;
    const user = await Model.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
    }

    res.json({ success: true, message: `${role.charAt(0).toUpperCase() + role.slice(1)} status updated`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating status', error: error.message });
  }
};

/**
 * GET /api/admin/pending-approvals
 * Returns all students and teachers with status 'pending' and their details.
 */
export const getPendingApprovals = async (req, res) => {
  try {
    const [pendingStudents, pendingTeachers] = await Promise.all([
      Student.find({ status: 'pending' }).select('-password'),
      Teacher.find({ status: 'pending' }).select('-password')
    ]);

    res.status(200).json({
      success: true,
      students: pendingStudents,
      teachers: pendingTeachers,
      total: pendingStudents.length + pendingTeachers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending approvals",
      error: error.message
    });
  }
};

/**
 * GET /api/admin/active-users
 * Returns all students and teachers who have logged in within the past 24 hours.
 */
export const getActiveUsers = async (req, res) => {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [activeStudents, activeTeachers] = await Promise.all([
      Student.find({ lastLogin: { $gte: oneDayAgo } }).select('-password'),
      Teacher.find({ lastLogin: { $gte: oneDayAgo } }).select('-password')
    ]);

    res.status(200).json({
      success: true,
      students: activeStudents,
      teachers: activeTeachers,
      total: activeStudents.length + activeTeachers.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch active users",
      error: error.message
    });
  }
};
