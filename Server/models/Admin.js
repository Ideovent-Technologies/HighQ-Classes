import mongoose from "mongoose";

/**
 * Admin Schema - Extended profile information for users with role='admin'
 * Links to User model via user field
 */
const adminSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
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
                // Super admin gets all permissions by default
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
            default: 5 // Highest access level
        },
        employeeId: {
            type: String,
            unique: true,
            sparse: true // Allows multiple null values
        },
        designation: {
            type: String,
            required: true,
            default: 'System Administrator'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        lastActivity: {
            type: Date,
            default: Date.now
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
        }
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for getting admin's full user data
adminSchema.virtual('adminData', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});

// Method to check if admin has specific permission
adminSchema.methods.hasPermission = function (permission) {
    return this.permissions.includes(permission) && this.isActive;
};

// Method to update last activity
adminSchema.methods.updateActivity = async function () {
    this.lastActivity = new Date();
    await this.save();
};

// Static method to find admin by user ID
adminSchema.statics.findByUserId = function (userId) {
    return this.findOne({ user: userId }).populate('user');
};

export default mongoose.model("Admin", adminSchema);