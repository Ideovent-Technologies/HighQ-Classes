import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import emailService from '../utils/emailService.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
    try {
        console.log('Registration request received:', req.body);

        const { name, email, password, mobile, role, ...additionalData } = req.body;
        const userRole = role || 'student';

        console.log('Parsed data:', { name, email, mobile, userRole, additionalData });

        // Check if email already exists across all models
        const existingEmail = await Promise.all([
            Student.findOne({ email }),
            Teacher.findOne({ email }),
            Admin.findOne({ email })
        ]);

        if (existingEmail.some(user => user !== null)) {
            console.log('Email already exists:', email);
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
            console.log('Mobile already exists:', mobile);
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
            status: userRole === 'admin' ? 'active' : 'pending'
        };

        console.log('Common data:', commonData);

        // Create user based on role
        switch (userRole) {
            case 'student':
                const studentData = {
                    ...commonData,
                    parentName: additionalData.parentName || 'Parent Name',
                    parentContact: additionalData.parentContact || '0000000000',
                    grade: additionalData.grade || '10th',
                    schoolName: additionalData.schoolName || 'School Name',
                    gender: additionalData.gender,
                    dateOfBirth: additionalData.dateOfBirth,
                    // Handle address properly - convert string to object if needed
                    address: typeof additionalData.address === 'string' && additionalData.address.trim()
                        ? { street: additionalData.address }
                        : additionalData.address
                };
                console.log('Creating student with data:', studentData);
                newUser = new Student(studentData);
                break;

            case 'teacher':
                newUser = new Teacher({
                    ...commonData,
                    employeeId: additionalData.employeeId || `T${Date.now()}`,
                    qualification: additionalData.qualification || 'B.Ed',
                    experience: additionalData.experience || 0,
                    specialization: additionalData.specialization || 'General',
                    department: additionalData.department || 'Other',
                    ...additionalData
                });
                break;

            case 'admin':
                newUser = new Admin({
                    ...commonData,
                    employeeId: additionalData.employeeId || `A${Date.now()}`,
                    department: additionalData.department || 'Administrative',
                    designation: additionalData.designation || 'System Administrator',
                    ...additionalData
                });
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role specified'
                });
        }

        console.log('Attempting to save user...');
        await newUser.save();
        console.log('User saved successfully:', newUser._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please wait for approval.',
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: userRole,
                status: newUser.status
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validationErrors
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(409).json({
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already registered`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
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

        // Find user across all models
        let user = null;
        let userRole = null;

        // Check Student model
        user = await Student.findOne({ email }).select('+password');
        if (user) userRole = 'student';

        // Check Teacher model if not found in Student
        if (!user) {
            user = await Teacher.findOne({ email }).select('+password');
            if (user) userRole = 'teacher';
        }

        // Check Admin model if not found in Teacher
        if (!user) {
            user = await Admin.findOne({ email }).select('+password');
            if (user) userRole = 'admin';
        }

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

        // Check if account is active
        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                message: 'Your account is not active. Please contact admin.'
            });
        }

        // Check if account is locked
        if (user.isLocked) {
            return res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts'
            });
        }

        // Check password
        const isPasswordCorrect = await user.matchPassword(password);
        if (!isPasswordCorrect) {
            // Increment login attempts
            await user.incLoginAttempts();

            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Reset login attempts on successful login
        if (user.loginAttempts > 0) {
            await user.resetLoginAttempts();
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateToken();

        // Set HTTP-only cookie
        const cookieOptions = {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
        };

        res.cookie('authToken', token, cookieOptions);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: userRole,
                status: user.status,
                lastLogin: user.lastLogin
            }
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
        // User is already attached to req by protect middleware
        const user = req.user;

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
                status: user.status,
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
        const { name, mobile, profilePicture } = req.body;
        const user = req.user; // Get user from protect middleware
        const userRole = user.role;

        // Check if mobile already exists for another user across all models
        if (mobile && mobile !== user.mobile) {
            const existingMobile = await Promise.all([
                Student.findOne({ mobile, _id: { $ne: user._id } }),
                Teacher.findOne({ mobile, _id: { $ne: user._id } }),
                Admin.findOne({ mobile, _id: { $ne: user._id } })
            ]);

            if (existingMobile.some(u => u !== null)) {
                return res.status(409).json({
                    success: false,
                    message: 'Mobile number is already registered'
                });
            }
        }

        // Find and update user in appropriate model
        let updatedUser;
        const updateData = {};
        if (name) updateData.name = name;
        if (mobile) updateData.mobile = mobile;
        if (profilePicture) updateData.profilePicture = profilePicture;

        switch (userRole) {
            case 'student':
                updatedUser = await Student.findByIdAndUpdate(
                    user._id,
                    updateData,
                    { new: true, select: '-password' }
                );
                break;
            case 'teacher':
                updatedUser = await Teacher.findByIdAndUpdate(
                    user._id,
                    updateData,
                    { new: true, select: '-password' }
                );
                break;
            case 'admin':
                updatedUser = await Admin.findByIdAndUpdate(
                    user._id,
                    updateData,
                    { new: true, select: '-password' }
                );
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user role'
                });
        }

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                mobile: updatedUser.mobile,
                role: userRole,
                profilePicture: updatedUser.profilePicture
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
        const { currentPassword, newPassword } = req.body;
        const user = req.user; // Get user from protect middleware
        const userRole = user.role;

        // Find user with password in appropriate model
        let userWithPassword;
        switch (userRole) {
            case 'student':
                userWithPassword = await Student.findById(user._id).select('+password');
                break;
            case 'teacher':
                userWithPassword = await Teacher.findById(user._id).select('+password');
                break;
            case 'admin':
                userWithPassword = await Admin.findById(user._id).select('+password');
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user role'
                });
        }

        if (!userWithPassword) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if current password is correct
        const isMatch = await userWithPassword.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        userWithPassword.password = newPassword;
        await userWithPassword.save();

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
        const { email } = req.body;

        // Find user across all models
        let user = null;
        user = await Student.findOne({ email });
        if (!user) user = await Teacher.findOne({ email });
        if (!user) user = await Admin.findOne({ email });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If your email is registered, you will receive a reset OTP'
            });
        }

        // Generate OTP and save to user
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const hashedOTP = await bcrypt.hash(otp, 12);

        user.passwordResetToken = hashedOTP;
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();

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
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Find user across all models with valid reset token
        let user = null;
        user = await Student.findOne({
            email,
            passwordResetExpires: { $gt: Date.now() }
        });
        if (!user) {
            user = await Teacher.findOne({
                email,
                passwordResetExpires: { $gt: Date.now() }
            });
        }
        if (!user) {
            user = await Admin.findOne({
                email,
                passwordResetExpires: { $gt: Date.now() }
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Verify OTP
        const isMatch = await bcrypt.compare(otp, user.passwordResetToken);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Update password
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
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

        // Check if email exists across all models
        const existingEmail = await Promise.all([
            Student.findOne({ email }),
            Teacher.findOne({ email }),
            Admin.findOne({ email })
        ]);

        const exists = existingEmail.some(user => user !== null);

        res.status(200).json({
            success: true,
            exists
        });
    } catch (error) {
        console.error('Check email error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while checking email'
        });
    }
};