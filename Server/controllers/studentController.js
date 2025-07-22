// controllers/studentProfileController.js
import Student from '../models/Student.js';

// GET /api/student/:id/profile
export const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('enrolledCourses')
      .lean();
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json({
      name: student.name,
      email: student.email,
      mobile: student.mobile,
      class: student.class,
      batch: student.batch,
      profilePicture: student.profilePicture,
      enrolledCourses: student.enrolledCourses,
      attendance: student.attendance,
      paymentHistory: student.paymentHistory,
      resources: student.resources
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// PATCH /api/student/:id/profile
export const updateProfile = async (req, res) => {
  try {
    const updates = {};
    if (req.body.email) updates.email = req.body.email;
    if (req.body.mobile) updates.mobile = req.body.mobile;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    res.json(student);
  } catch (err) {
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
    res.json({ profilePicture: student.profilePicture });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
