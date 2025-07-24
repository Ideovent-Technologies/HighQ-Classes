// Script to test the email service

import dotenv from 'dotenv';
dotenv.config();

import emailService from '../utils/emailService.js';

async function testEmailService() {
    try {
        console.log('Testing email service...');

        // Check if environment variables are set
        console.log('EMAIL_USERNAME:', process.env.EMAIL_USERNAME ? '✅ Set' : '❌ Not set');
        console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Not set');
        console.log('EMAIL_FROM:', process.env.EMAIL_FROM ? '✅ Set' : '❌ Not set');

        // Initialize email service
        const initialized = emailService.init();
        console.log('Email service initialized:', initialized ? '✅ Success' : '❌ Failed');

        if (!initialized) {
            console.error('Failed to initialize email service. Check your environment variables.');
            process.exit(1);
        }

        // Test email (use a real email address for testing)
        const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USERNAME;

        if (!testEmail) {
            console.error('No test email provided. Set TEST_EMAIL in your .env file.');
            process.exit(1);
        }

        console.log(`Sending test email to: ${testEmail}`);

        try {
            const result = await emailService.sendEmail({
                to: testEmail,
                subject: 'Test Email from HighQ Classes',
                html: `
          <h1>Test Email</h1>
          <p>This is a test email from the HighQ Classes email service.</p>
          <p>If you received this email, the email service is working correctly!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `
            });

            console.log('Email sent successfully:', result);
            console.log('✅ Email service is working correctly!');
        } catch (emailError) {
            console.error('❌ Error sending email:', emailError);

            if (emailError.message.includes('Invalid login')) {
                console.error('\nPossible solutions:');
                console.error('1. Make sure your EMAIL_USERNAME and EMAIL_PASSWORD are correct');
                console.error('2. If using Gmail, enable "Less secure app access" or create an App Password');
                console.error('3. Check if your email provider requires additional configuration');
            }

            process.exit(1);
        }
    } catch (error) {
        console.error('❌ Error testing email service:', error);
        process.exit(1);
    }
}

testEmailService();
