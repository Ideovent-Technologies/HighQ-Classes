import Student from '../models/Student.js';
import bcrypt from 'bcryptjs';

// GET /api/student/:id/profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('enrolledCourses')
      .populate('batch', 'batchName')
      .lean();

    if (!student) return res.status(404).json({ error: 'Student not found' });

    res.json({
      name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class,
      batch: student.batch,
      profilePicture: student.profilePicture,
      enrolledCourses: student.enrolledCourses,
      attendance: student.attendance,
      paymentHistory: student.paymentHistory,
      resources: student.resources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/student/:id/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.email) updates.email = req.body.email;
    if (req.body.phone) updates.phone = req.body.phone;

    if (!updates.email && !updates.phone) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// POST /api/student/:id/profile-picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: { profilePicture: req.file.path } },
      { new: true }
    );

    if (!student) return res.status(404).json({ error: "Student not found" });

    res.json({ profilePicture: student.profilePicture });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/student/:id/change-password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: "Both old and new passwords are required." });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });

    const isMatch = await bcrypt.compare(oldPassword, student.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
