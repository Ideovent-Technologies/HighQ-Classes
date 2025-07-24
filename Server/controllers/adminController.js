import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Batch from "../models/Batch.js";
import Course from '../models/Course.js';
import Fee from "../models/Fee.js";
import Notice from "../models/Notice.js";


// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    const [totalStudents, totalTeachers, totalCourses, totalBatches] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'teacher' }),
      Course.countDocuments(),
      Batch.countDocuments(),
    ]);

    const paidFees = await Fee.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const pendingFees = await Fee.aggregate([
      { $match: { isPaid: false } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.status(200).json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalBatches,
      totalFeeCollected: paidFees[0]?.total || 0,
      totalFeePending: pendingFees[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard data", error: error.message });
  }
};

// Add Student
export const addStudent = async (req, res) => {
  try {
    const {
      name, email, password, mobile,
      gender, dateOfBirth, parentName, parentContact,
      address, batch, courses, grade, schoolName
    } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "Name, email, password, and mobile are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

  
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      role: 'student'
    });
   
console.log("User created:", user);

    

    const student = await Student.create({
      userId: user._id,
      gender,
      dateOfBirth,
      parentName,
      parentContact,
      address,
      batch,
      courses,
      grade,
      schoolName
    });

    if (!user || !user._id) {
  return res.status(500).json({ message: "User creation failed, no ID returned" });
}


    res.status(201).json({ message: "Student created successfully", user, student });
  } catch (error) {
    res.status(500).json({ message: "Failed to create student", error: error.message });
  }
};

// Update Student
export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Failed to update student", error: error.message });
  }
};

// Delete Student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    await User.findByIdAndDelete(student.user);
    res.json({ message: "Student and linked user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete student", error: error.message });
  }
};

// Add Teacher
export const addTeacher = async (req, res) => {
  try {
    const {
      name, email, password, mobile,
      qualification, experience, specialization,
      bio, subjects, batches, courseIds
    } = req.body;

    if (!name || !email || !password || !mobile || !qualification || !experience || !specialization) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already in use" });

  
    const user = await User.create({
      name,
      email,
      password,
      mobile,
      role: 'teacher'
    });
    console.log("User created:", user);
   

    const teacher = await Teacher.create({
      userId: user._id,
      qualification,
      experience,
      specialization,
      bio,
      subjects,
      batches,
      courseIds
    });

    res.status(201).json({ message: "Teacher created successfully", user, teacher });
  } catch (error) {
    res.status(500).json({ message: "Failed to create teacher", error: error.message });
  }
};

// Update Teacher
export const updateTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher updated successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Failed to update teacher", error: error.message });
  }
};

// Delete Teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await User.findByIdAndDelete(teacher.user);
    res.json({ message: "Teacher and linked user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete teacher", error: error.message });
  }
};

// Get All Students (basic info from User)
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Get All Teachers (basic info from User)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching teachers', error: error.message });
  }
};

// Update User Profile
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// Create Announcement
export const createAnnouncement = async (req, res) => {
  try {
    const { message, visibleTo = ['student', 'teacher'], expiresAt } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

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
