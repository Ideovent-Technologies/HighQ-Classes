import emailService from '../utils/emailService.js';

/**
 * Middleware to initialize email service
 * This should be called at application startup
 */
export const initializeEmailService = (req, res, next) => {
    if (!emailService.initialized) {
        emailService.init();
    }
    next();
};

/**
 * Middleware to send password reset OTP
 */
export const sendPasswordResetOTP = async (req, res, next) => {
    try {
        if (!req.resetOTP || !req.userEmail) {
            return next(new Error('Missing OTP or email in request'));
        }

        await emailService.sendPasswordResetOTP(req.userEmail, req.resetOTP);
        next();
    } catch (error) {
        next(error);
    }
};

/**
 * Middleware to send welcome email
 */
export const sendWelcomeEmail = async (req, res, next) => {
    try {
        const { email, name } = req.newUser || req.body;
        if (!email || !name) {
            return next(new Error('Missing email or name in request'));
        }

        await emailService.sendWelcomeEmail(email, name);
        next();
    } catch (error) {
        next(error);
    }
};

export default {
    initializeEmailService,
    sendPasswordResetOTP,
    sendWelcomeEmail
};
