import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function migrateTeacherData() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check current teacher documents
        const teachers = await mongoose.connection.db.collection('teachers').find({}).toArray();
        console.log('Found teachers:', teachers.length);

        if (teachers.length > 0) {
            console.log('Sample teacher document structure:');
            console.log(JSON.stringify(teachers[0], null, 2));

            // If teachers have a 'user' field referencing User documents, we need to handle this
            // For now, let's check if there's a User collection
            const users = await mongoose.connection.db.collection('users').find({}).toArray();
            console.log('Found users:', users.length);

            if (users.length > 0) {
                console.log('Sample user document structure:');
                console.log(JSON.stringify(users[0], null, 2));
            }
        }

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

migrateTeacherData();
