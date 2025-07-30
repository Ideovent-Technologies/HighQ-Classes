// scripts/cleanupOldIndexes.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const cleanupOldIndexes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for index cleanup');

        const db = mongoose.connection.db;

        // List of collections to check
        const collections = ['students', 'teachers', 'admins'];

        for (const collectionName of collections) {
            try {
                console.log(`\n🔍 Checking collection: ${collectionName}`);

                // Get the collection
                const collection = db.collection(collectionName);

                // List all indexes
                const indexes = await collection.indexes();
                console.log(`Current indexes in ${collectionName}:`, indexes.map(idx => idx.name));

                // Look for old 'user' related indexes
                const oldIndexes = indexes.filter(idx =>
                    idx.name.includes('user') ||
                    Object.keys(idx.key || {}).some(key => key === 'user')
                );

                if (oldIndexes.length > 0) {
                    console.log(`🗑️  Found old user-related indexes in ${collectionName}:`, oldIndexes.map(idx => idx.name));

                    // Drop each old index
                    for (const oldIndex of oldIndexes) {
                        if (oldIndex.name !== '_id_') { // Never drop the _id index
                            console.log(`   Dropping index: ${oldIndex.name}`);
                            await collection.dropIndex(oldIndex.name);
                            console.log(`   ✅ Dropped index: ${oldIndex.name}`);
                        }
                    }
                } else {
                    console.log(`✅ No old user-related indexes found in ${collectionName}`);
                }

            } catch (error) {
                if (error.message.includes('ns not found')) {
                    console.log(`   Collection ${collectionName} doesn't exist yet - skipping`);
                } else {
                    console.error(`   Error processing ${collectionName}:`, error.message);
                }
            }
        }

        console.log('\n🎉 Index cleanup completed successfully!');

    } catch (error) {
        console.error('❌ Error during index cleanup:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
};

// Run the cleanup
cleanupOldIndexes();
