import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";
import Batch from "../models/Batch.js";
import Course from '../models/Course.js';
import Fee from "../models/Fee.js";
import Notice from "../models/Notice.js";

// Controller to get admin dashboard data
export const getAdminDashboard = async (req, res) => {
    try {
        // Get counts from independent models
        const [totalStudents, totalTeachers, totalAdmins, totalCourses, totalBatches] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Admin.countDocuments(),
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

        // Get recent activities (last 10 users registered from all models)
        const [recentStudents, recentTeachers, recentAdmins] = await Promise.all([
            Student.find().select('name email createdAt').sort({ createdAt: -1 }).limit(4).lean(),
            Teacher.find().select('name email createdAt').sort({ createdAt: -1 }).limit(3).lean(),
            Admin.find().select('name email createdAt').sort({ createdAt: -1 }).limit(3).lean()
        ]);

        // Combine and sort recent users with role information
        const recentUsers = [
            ...recentStudents.map(user => ({ ...user, role: 'student' })),
            ...recentTeachers.map(user => ({ ...user, role: 'teacher' })),
            ...recentAdmins.map(user => ({ ...user, role: 'admin' }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);

        // Get user status breakdown from all models
        const [studentStatusStats, teacherStatusStats, adminStatusStats] = await Promise.all([
            Student.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            Teacher.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
            Admin.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
        ]);

        const userStatusStats = [
            ...studentStatusStats,
            ...teacherStatusStats,
            ...adminStatusStats
        ].reduce((acc, curr) => {
            const existing = acc.find(item => item._id === curr._id);
            if (existing) {
                existing.count += curr.count;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);

        // Get monthly registration trend (last 6 months) from all models
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const [studentTrend, teacherTrend, adminTrend] = await Promise.all([
            Student.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Teacher.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ]),
            Admin.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } }
            ])
        ]);

        const registrationTrend = [
            ...studentTrend,
            ...teacherTrend,
            ...adminTrend
        ].reduce((acc, curr) => {
            const key = `${curr._id.year}-${curr._id.month}`;
            const existing = acc.find(item => `${item._id.year}-${item._id.month}` === key);
            if (existing) {
                existing.count += curr.count;
            } else {
                acc.push(curr);
            }
            return acc;
        }, []).sort((a, b) => a._id.year - b._id.year || a._id.month - b._id.month);

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
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
}

// Controller to fetch all teachers
export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().select('-password');
        res.json(teachers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching teachers', error: error.message });
    }
}

// Controller to update a user's information
export const updateUser = async (req, res) => {
    try {
        const { role } = req.body;
        let updated;

        // Update based on role
        switch (role) {
            case 'student':
                updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
                break;
            case 'teacher':
                updated = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
                break;
            case 'admin':
                updated = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (!updated) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
}

// Controller to delete a user
export const deleteUser = async (req, res) => {
    try {
        const { role } = req.body;
        let deleted;

        // Delete based on role
        switch (role) {
            case 'student':
                deleted = await Student.findByIdAndDelete(req.params.id);
                break;
            case 'teacher':
                deleted = await Teacher.findByIdAndDelete(req.params.id);
                break;
            case 'admin':
                deleted = await Admin.findByIdAndDelete(req.params.id);
                break;
            default:
                return res.status(400).json({ message: 'Invalid role specified' });
        }

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

        // Check if email already exists across all models
        const existingEmail = await Promise.all([
            Student.findOne({ email }),
            Teacher.findOne({ email }),
            Admin.findOne({ email })
        ]);

        if (existingEmail.some(user => user !== null)) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Check if mobile already exists across all models
        const existingMobile = await Promise.all([
            Student.findOne({ mobile }),
            Teacher.findOne({ mobile }),
            Admin.findOne({ mobile })
        ]);

        if (existingMobile.some(user => user !== null)) {
            return res.status(409).json({
                success: false,
                message: 'Mobile number is already registered'
            });
        }

        let newUser;
        const commonData = {
            name,
            email,
            password,
            mobile,
            status: 'active' // Admin-created users are automatically active
        };

        // Create user based on role
        switch (role) {
            case 'student':
                newUser = new Student({
                    ...commonData,
                    parentName: parentName || 'Parent Name',
                    parentContact: parentContact || '0000000000',
                    grade: grade || '10th',
                    schoolName: 'School Name'
                });
                break;

            case 'teacher':
                if (!qualification || !specialization) {
                    return res.status(400).json({
                        success: false,
                        message: 'Qualification and specialization are required for teachers'
                    });
                }
                newUser = new Teacher({
                    ...commonData,
                    employeeId: `T${Date.now()}`,
                    qualification,
                    experience: experience || 0,
                    specialization,
                    department: department || 'Other',
                    subjects: subjects || []
                });
                break;

            case 'admin':
                newUser = new Admin({
                    ...commonData,
                    employeeId: `A${Date.now()}`,
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

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
        }

        await newUser.save();

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: role,
                status: newUser.status
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