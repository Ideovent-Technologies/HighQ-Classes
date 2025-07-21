import User from "../models/User.js";
import Batch from "../models/Batch.js";
import Course from '../models/Course.js';
import Fee from "../models/Fee.js";
import Notice from "../models/Notice.js";

// Controller to get admin dashboard data
export const getAdminDashboard = async(req, res) => {
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
}

// Controller to fetch all students
export const getAllStudents = async(req, res) => { 
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);
    
   
        
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
        
    }
}

// Controller to fetch all teachers
export const getAllTeachers = async(req, res) => { 
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
}

// Controller to update a user's information
export const updateUser = async(req, res) => { 
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(updated);

}
catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }   }

// Controller to delete a user
export const deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
}

// Controller to create a new user
export const CreateUser = async (req,res) => {
    

}

// Controller to create an announcement
export const createAnnouncement = async (req,res) => {
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
    console.error('Error creating notice:', err);
    res.status(500).json({ message: 'Failed to create announcement' });
  }

    
}