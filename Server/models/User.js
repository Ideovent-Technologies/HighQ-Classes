import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
    {
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
            select: false // Don't include password in query results by default
        },

        mobile: {
            type: String,
            required: [true, 'Please provide a mobile number'],
            match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number'],
            trim: true,
        },

        role: {
            type: String,
            enum: ['admin', 'teacher', 'student'],
            default: 'student',
        },

        profilePicture: {
            type: String,
            default: '/placeholder.svg'
        },

        status: {
            type: String,
            enum: ['pending', 'active', 'suspended'],
            default: 'pending'
        },

        failedLoginAttempts: {
            type: Number,
            default: 0
        },

        lockoutUntil: {
            type: Date,
            default: null
        },

        resetPasswordToken: String,
        resetPasswordOTP: String,
        resetPasswordExpiry: Date,

        lastLogin: {
            type: Date
        }
    },
    {
        timestamps: true, // adds createdAt and updatedAt automatically
    }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash password if it's modified or new
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password with salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role,
            name: this.name
        },
        process.env.JWT_SECRET || 'highq-classes-secret-key',
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
};

// Method to check if account is locked
userSchema.methods.isAccountLocked = function () {
    return this.lockoutUntil && this.lockoutUntil > new Date();
};

// Method to handle failed login attempt
userSchema.methods.handleFailedLogin = async function () {
    // Increment failed login attempts
    this.failedLoginAttempts += 1;

    // Lock account if too many failed attempts
    if (this.failedLoginAttempts >= 5) {
        // Lock for 15 minutes
        this.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await this.save();
};

// Method to reset failed login attempts
userSchema.methods.resetFailedLoginAttempts = async function () {
    if (this.failedLoginAttempts > 0) {
        this.failedLoginAttempts = 0;
        this.lockoutUntil = null;
        await this.save();
    }
};

// Method to generate reset password token
userSchema.methods.generateResetPasswordToken = async function () {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the OTP
    const salt = await bcrypt.genSalt(10);
    this.resetPasswordOTP = await bcrypt.hash(otp, salt);

    // Set expiry (10 minutes)
    this.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    await this.save();

    return otp;
};

const User = mongoose.model("User", userSchema);
export default User;
