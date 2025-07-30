import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Independent Admin Schema
 * Contains all authentication and profile data
 */
const adminSchema = new mongoose.Schema(
    {
        // Authentication fields
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            minlength: [3, 'Name must be at least 3 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        mobile: {
            type: String,
            required: [true, 'Please provide a mobile number'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
            trim: true,
            unique: true
        },
        profilePicture: {
            type: String,
            default: '/placeholder.svg'
        },

        // Admin-specific fields
        employeeId: {
            type: String,
            required: [true, 'Employee ID is required'],
            unique: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            enum: ['Academic', 'Administrative', 'IT', 'Finance', 'HR'],
            default: 'Administrative'
        },
        permissions: [{
            type: String,
            enum: [
                'user_management',
                'course_management',
                'batch_management',
                'fee_management',
                'notice_management',
                'attendance_management',
                'material_management',
                'recording_management',
                'system_settings',
                'reports_access'
            ],
            default: function () {
                return [
                    'user_management',
                    'course_management',
                    'batch_management',
                    'fee_management',
                    'notice_management',
                    'attendance_management',
                    'material_management',
                    'recording_management',
                    'system_settings',
                    'reports_access'
                ];
            }
        }],
        accessLevel: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 5
        },
        designation: {
            type: String,
            required: true,
            default: 'System Administrator'
        },
        managedDepartments: [{
            type: String,
            enum: ['Academic', 'Administrative', 'IT', 'Finance', 'HR']
        }],
        systemSettings: {
            canManageUsers: {
                type: Boolean,
                default: true
            },
            canManageRoles: {
                type: Boolean,
                default: true
            },
            canAccessReports: {
                type: Boolean,
                default: true
            },
            canManageSystem: {
                type: Boolean,
                default: true
            }
        },

        // Account management
        status: {
            type: String,
            enum: ['pending', 'active', 'suspended', 'inactive'],
            default: 'active'
        },
        role: {
            type: String,
            enum: ["admin"],
            default: "admin"
        },
        lastLogin: {
            type: Date
        },
        lastActivity: {
            type: Date,
            default: Date.now
        },

        // Security fields
        passwordResetToken: String,
        passwordResetExpires: Date,
        emailVerificationToken: String,
        emailVerified: {
            type: Boolean,
            default: true // Admins are usually pre-verified
        },
        loginAttempts: {
            type: Number,
            default: 0
        },
        lockUntil: Date
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Indexes for performance (email, mobile, employeeId already indexed via unique: true)
adminSchema.index({ department: 1 });
adminSchema.index({ status: 1 });

// Virtual for account locked status
adminSchema.virtual('isLocked').get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual for active status
adminSchema.virtual('isActive').get(function () {
    return this.status === 'active';
});

// Pre-save middleware to hash password
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to check password
adminSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT token
adminSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: 'admin',
            employeeId: this.employeeId
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// Method to handle login attempts
adminSchema.methods.incLoginAttempts = function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1 },
            $set: { loginAttempts: 1 }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = {
            lockUntil: Date.now() + 2 * 60 * 60 * 1000 // 2 hours
        };
    }

    return this.updateOne(updates);
};

// Method to reset login attempts
adminSchema.methods.resetLoginAttempts = function () {
    return this.updateOne({
        $unset: { loginAttempts: 1, lockUntil: 1 }
    });
};

// Method to check if admin has specific permission
adminSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission) && this.isActive;
};

// Method to update last activity
adminSchema.methods.updateActivity = async function () {
    this.lastActivity = new Date();
    await this.save();
};

export default mongoose.model("Admin", adminSchema);