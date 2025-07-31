import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const createTestAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to database');

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });

        if (existingAdmin) {
            console.log('Test admin already exists:');
            console.log('Email: admin@example.com');
            console.log('Password: SecurePass123');
            console.log('Status:', existingAdmin.status);
            console.log('Role: admin');
        } else {
            // Create test admin
            const testAdmin = new Admin({
                name: 'Test Admin',
                email: 'admin@example.com',
                password: 'SecurePass123',
                mobile: '9999999999',
                employeeId: 'ADMIN001',
                department: 'Administration',
                designation: 'System Administrator',
                status: 'active' // Admin accounts are auto-approved
            });

            await testAdmin.save();
            console.log('✅ Test admin created successfully:');
            console.log('Email: admin@example.com');
            console.log('Password: SecurePass123');
            console.log('Role: admin');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createTestAdmin();
