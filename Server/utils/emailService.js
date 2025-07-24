import nodemailer from 'nodemailer';

/**
 * Email service for sending emails throughout the application
 * Uses nodemailer with configurable transport
 */
class EmailService {
    constructor() {
        this.transporter = null;
        this.initialized = false;
    }

    /**
     * Initialize the email service
     * @returns {boolean} - Whether initialization was successful
     */
    init() {
        try {
            // Check if required environment variables are set
            if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
                console.warn('Email service not configured: Missing EMAIL_USERNAME or EMAIL_PASSWORD');
                return false;
            }

            // Create reusable transporter
            const transportConfig = {
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD
                }
            };

            // If using Gmail, use service
            if (process.env.EMAIL_SERVICE === 'gmail') {
                transportConfig.service = 'gmail';
            }
            // If using SMTP, use host and port
            else if (process.env.EMAIL_HOST && process.env.EMAIL_PORT) {
                transportConfig.host = process.env.EMAIL_HOST;
                transportConfig.port = process.env.EMAIL_PORT;
                transportConfig.secure = process.env.EMAIL_PORT === '465';
            }
            // Default to Gmail
            else {
                transportConfig.service = 'gmail';
            }

            this.transporter = nodemailer.createTransport(transportConfig);

            this.initialized = true;
            console.log('Email service initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize email service:', error);
            return false;
        }
    }

    /**
     * Send an email
     * @param {Object} options - Email options
     * @param {string} options.to - Recipient email
     * @param {string} options.subject - Email subject
     * @param {string} options.html - Email HTML content
     * @param {string} [options.from] - Sender email (defaults to EMAIL_FROM env var)
     * @returns {Promise<Object>} - Send mail response
     */
    async sendEmail(options) {
        if (!this.initialized) {
            const initialized = this.init();
            if (!initialized) {
                throw new Error('Email service not initialized');
            }
        }

        const mailOptions = {
            from: options.from || process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }

    /**
     * Send password reset OTP email
     * @param {string} to - Recipient email
     * @param {string} otp - One-time password
     * @returns {Promise<Object>} - Send mail response
     */
    async sendPasswordResetOTP(to, otp) {
        return this.sendEmail({
            to,
            subject: 'Password Reset OTP - HighQ Classes',
            html: `
                <h1>Password Reset</h1>
                <p>You requested a password reset for your HighQ Classes account.</p>
                <p>Your OTP is: <strong>${otp}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        });
    }

    /**
     * Send welcome email to new user
     * @param {string} to - Recipient email
     * @param {string} name - User's name
     * @returns {Promise<Object>} - Send mail response
     */
    async sendWelcomeEmail(to, name) {
        return this.sendEmail({
            to,
            subject: 'Welcome to HighQ Classes!',
            html: `
                <h1>Welcome to HighQ Classes, ${name}!</h1>
                <p>Thank you for registering with us.</p>
                <p>Your account is currently pending approval. You will be notified once it's approved.</p>
                <p>If you have any questions, please contact our support team.</p>
            `
        });
    }
}

// Create a singleton instance
const emailService = new EmailService();

export default emailService;