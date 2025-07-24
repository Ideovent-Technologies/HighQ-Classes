import User from "../models/User.js";
import Admin from "../models/Admin.js";
import Teacher from "../models/Teacher.js";
import Student from "../models/Student.js";
import Batch from "../models/Batch.js";
import Course from '../models/Course.js';
import Fee from "../models/Fee.js";
import Notice from "../models/Notice.js";

// Controller to get admin dashboard data
export const getAdminDashboard = async (req, res) => {
    try {
        // Get counts
        const [totalStudents, totalTeachers, totalAdmins, totalCourses, totalBatches] = await Promise.all([
            User.countDocuments({ role: 'student' }),
            User.countDocuments({ role: 'teacher' }),
            User.countDocuments({ role: 'admin' }),
            Course.countDocuments(),
            Batch.countDocuments(),
        ]);

        // Get fee statistics
        const paidFees = await Fee.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const pendingFees = await Fee.aggregate([
            { $match: { isPaid: false } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Get recent activities (last 10 users registered)
        const recentUsers = await User.find()
            .select('name email role status createdAt')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get user status breakdown
        const userStatusStats = await User.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get monthly registration trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const registrationTrend = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    totalTeachers,
                    totalAdmins,
                    totalCourses,
                    totalBatches,
                    totalUsers: totalStudents + totalTeachers + totalAdmins,
                    totalFeeCollected: paidFees[0]?.total || 0,
                    totalFeePending: pendingFees[0]?.total || 0
                },
                recentUsers,
                userStatusStats,
                registrationTrend,
                lastUpdated: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Admin dashboard error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message
        });
    }
}

// Controller to fetch all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.json(students);



    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });

    }
}

// Controller to fetch all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await User.find({ role: 'teacher' }).select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
}

// Controller to update a user's information
export const updateUser = async (req, res) => {
    try {
        const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        res.json(updated);

    }
    catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

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
export const CreateUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            mobile,
            role,
            // Role-specific fields
            qualification,
            experience,
            specialization,
            subjects,
            department,
            designation,
            permissions,
            grade,
            parentName,
            parentContact
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !mobile || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, mobile, and role are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { mobile }]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email or mobile already exists'
            });
        }

        // Create base user
        const user = new User({
            name,
            email,
            password,
            mobile,
            role,
            status: 'active' // Admin-created users are automatically active
        });

        await user.save();

        // Create role-specific profile
        let roleProfile = null;

        switch (role) {
            case 'admin':
                roleProfile = new Admin({
                    user: user._id,
                    department: department || 'Administrative',
                    designation: designation || 'System Administrator',
                    permissions: permissions || [
                        'user_management',
                        'course_management',
                        'batch_management',
                        'fee_management',
                        'notice_management'
                    ]
                });
                break;

            case 'teacher':
                if (!qualification || !specialization) {
                    return res.status(400).json({
                        success: false,
                        message: 'Qualification and specialization are required for teachers'
                    });
                }
                roleProfile = new Teacher({
                    user: user._id,
                    qualification,
                    experience: experience || 0,
                    specialization,
                    subjects: subjects || [],
                    bio: `${specialization} specialist with ${experience || 0} years of experience`
                });
                break;

            case 'student':
                roleProfile = new Student({
                    user: user._id,
                    grade: grade || '',
                    parentName: parentName || '',
                    parentContact: parentContact || '',
                    courses: [],
                    attendance: []
                });
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
        }

        if (roleProfile) {
            await roleProfile.save();
        }

        // Return user data (without password)
        const userData = await User.findById(user._id).select('-password');

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
            data: {
                user: userData,
                profile: roleProfile
            }
        });

    } catch (error) {
        console.error('Create user error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error while creating user'
        });
    }
};

// Controller to create an announcement
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
        console.error('Error creating notice:', err);
        res.status(500).json({ message: 'Failed to create announcement' });
    }


}