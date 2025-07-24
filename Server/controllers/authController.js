import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import emailService from '../utils/emailService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        const { name, email, password, mobile, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }

        // Check if mobile already exists
        const existingMobile = await User.findOne({ mobile });
        if (existingMobile) {
            return res.status(409).json({
                success: false,
                message: 'Mobile number is already registered'
            });
        }

        // Create new user
        const user = new User({
            name,
            email,
            password,
            mobile,
            role: role || 'student',
            status: role === 'admin' ? 'active' : 'pending' // Auto-approve admin accounts
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please wait for approval.',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

/**
 * @desc    Login user and return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if account is approved
        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Your account is pending approval'
            });
        }

        // Check if account is suspended
        if (user.status === 'suspended') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been suspended'
            });
        }

        // Check if account is locked
        if (user.isAccountLocked()) {
            const lockoutTime = Math.ceil((user.lockoutUntil - new Date()) / (60 * 1000));
            return res.status(403).json({
                success: false,
                message: `Account is temporarily locked. Try again in ${lockoutTime} minutes.`
            });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            await user.handleFailedLogin();

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset failed login attempts
        await user.resetFailedLoginAttempts();

        // Update last login timestamp
        user.lastLogin = Date.now();
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        // Send token in HTTP-only cookie
        res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

/**
 * @desc    Logout user by clearing the cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = (req, res, next) => {
    res.clearCookie('authToken');
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                profilePicture: user.profilePicture,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching profile'
        });
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, mobile, profilePicture } = req.body;

        // Find user
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update fields
        if (name) user.name = name;
        if (mobile) {
            // Check if mobile already exists for another user
            const existingMobile = await User.findOne({
                mobile,
                _id: { $ne: req.user.id }
            });

            if (existingMobile) {
                return res.status(409).json({
                    success: false,
                    message: 'Mobile number is already registered'
                });
            }

            user.mobile = mobile;
        }
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update'
        });
    }
};

/**
 * @desc    Change user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;

        // Find user with password
        const user = await User.findById(req.user.id).select('+password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if current password is correct
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password change'
        });
    }
};

/**
 * @desc    Request password reset (send OTP)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If your email is registered, you will receive a reset OTP'
            });
        }

        // Generate OTP
        const otp = await user.generateResetPasswordToken();

        // Send email with OTP using the emailService
        try {
            await emailService.sendPasswordResetOTP(user.email, otp);
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Don't expose email failure to client for security reasons
        }

        res.status(200).json({
            success: true,
            message: 'If your email is registered, you will receive a reset OTP'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset request'
        });
    }
};

/**
 * @desc    Reset password with OTP
 * @route   POST /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, otp, newPassword } = req.body;

        // Find user
        const user = await User.findOne({
            email,
            resetPasswordExpiry: { $gt: Date.now() }
        }).select('+resetPasswordOTP');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, user.resetPasswordOTP);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Update password
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during password reset'
        });
    }
};

/**
 * @desc    Check if email exists (for registration)
 * @route   POST /api/auth/check-email
 * @access  Public
 */
export const checkEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        res.status(200).json({
            success: true,
            exists: !!user
        });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking email'
        });
    }
};