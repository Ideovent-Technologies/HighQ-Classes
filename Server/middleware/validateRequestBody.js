import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for user registration
 */
export const validateRegistration = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('mobile')
        .matches(/^[0-9]{10}$/)
        .withMessage('Mobile number must be exactly 10 digits'),

    body('role')
        .optional()
        .isIn(['admin', 'teacher', 'student'])
        .withMessage('Role must be admin, teacher, or student'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for admin creating users
 */
export const validateAdminCreateUser = [
    body('name')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),

    body('mobile')
        .matches(/^[0-9]{10}$/)
        .withMessage('Mobile number must be exactly 10 digits'),

    body('role')
        .isIn(['admin', 'teacher', 'student'])
        .withMessage('Role must be admin, teacher, or student'),

    // Teacher-specific validation
    body('qualification')
        .if(body('role').equals('teacher'))
        .notEmpty()
        .withMessage('Qualification is required for teachers'),

    body('specialization')
        .if(body('role').equals('teacher'))
        .notEmpty()
        .withMessage('Specialization is required for teachers'),

    body('experience')
        .if(body('role').equals('teacher'))
        .optional()
        .isInt({ min: 0, max: 50 })
        .withMessage('Experience must be between 0 and 50 years'),

    // Admin-specific validation
    body('department')
        .if(body('role').equals('admin'))
        .optional()
        .isIn(['Academic', 'Administrative', 'IT', 'Finance', 'HR'])
        .withMessage('Invalid department for admin'),

    body('designation')
        .if(body('role').equals('admin'))
        .optional()
        .isLength({ min: 3, max: 100 })
        .withMessage('Designation must be between 3 and 100 characters'),

    // Student-specific validation  
    body('grade')
        .if(body('role').equals('student'))
        .optional()
        .isLength({ max: 20 })
        .withMessage('Grade must be less than 20 characters'),

    body('parentName')
        .if(body('role').equals('student'))
        .optional()
        .isLength({ min: 3, max: 50 })
        .withMessage('Parent name must be between 3 and 50 characters'),

    body('parentContact')
        .if(body('role').equals('student'))
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Parent contact must be exactly 10 digits'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for user login
 */
export const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .notEmpty()
        .withMessage('Password is required'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for forgot password
 */
export const validateForgotPassword = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for reset password
 */
export const validateResetPassword = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('otp')
        .isLength({ min: 6, max: 6 })
        .isNumeric()
        .withMessage('OTP must be exactly 6 digits'),

    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for profile update
 */
export const validateProfileUpdate = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),

    body('mobile')
        .optional()
        .matches(/^[0-9]{10}$/)
        .withMessage('Mobile number must be exactly 10 digits'),

    body('profilePicture')
        .optional()
        .isURL()
        .withMessage('Profile picture must be a valid URL'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

/**
 * Validation middleware for password change
 */
export const validatePasswordChange = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),

    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

    // Check for validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        next();
    }
];

export default {
    validateRegistration,
    validateLogin,
    validateForgotPassword,
    validateResetPassword,
    validateProfileUpdate,
    validatePasswordChange
};
