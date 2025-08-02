import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function fixStudentData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Get the student
        const student = await mongoose.connection.db.collection('students').findOne({
            email: 'student@example.com'
        });

        if (!student) {
            console.log('Student not found');
            return;
        }

        console.log('Found student:', student.name, 'with batch:', student.batch);

        // 2. Get the batch details
        const batch = await mongoose.connection.db.collection('batches').findOne({
            _id: student.batch
        });

        if (!batch) {
            console.log('Student batch not found');
            return;
        }

        console.log('Found batch:', batch.batchName || batch.name);

        // 3. Get courses and add student to courses
        const courses = await mongoose.connection.db.collection('courses').find({}).toArray();
        console.log('Available courses:', courses.length);

        if (courses.length > 0) {
            // Take first 2-3 courses for the student
            const coursesToEnroll = courses.slice(0, 3).map(c => c._id);

            console.log('Enrolling student in courses:', coursesToEnroll);

            // Update student with enrolled courses
            await mongoose.connection.db.collection('students').updateOne(
                { _id: student._id },
                {
                    $set: {
                        enrolledCourses: coursesToEnroll,
                        batch: student.batch // Make sure batch is set
                    }
                }
            );

            console.log('✅ Student enrolled in courses');
        }

        // 4. Add student to batch if not already there
        await mongoose.connection.db.collection('batches').updateOne(
            { _id: student.batch },
            { $addToSet: { students: student._id } }
        );

        console.log('✅ Student added to batch');

        // 5. Create some sample schedule entries
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const scheduleEntries = [
            {
                batchId: student.batch,
                courseId: courses[0]?._id,
                day: today.toLocaleDateString("en-US", { weekday: "long" }),
                startTime: "10:00",
                endTime: "11:30",
                subject: courses[0]?.name || "Mathematics",
                teacherId: null,
                studentIds: [student._id],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                batchId: student.batch,
                courseId: courses[1]?._id,
                day: today.toLocaleDateString("en-US", { weekday: "long" }),
                startTime: "14:00",
                endTime: "15:30",
                subject: courses[1]?.name || "Physics",
                teacherId: null,
                studentIds: [student._id],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const schedule of scheduleEntries) {
            await mongoose.connection.db.collection('schedules').insertOne(schedule);
        }

        console.log('✅ Sample schedules created');

        // 6. Create a sample notice
        const notice = {
            title: "Welcome to HighQ Classes!",
            message: "Your dashboard is now set up with sample data. Start exploring your courses and schedule.",
            batch: student.batch,
            isActive: true,
            isScheduled: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await mongoose.connection.db.collection('notices').insertOne(notice);
        console.log('✅ Sample notice created');

        // 7. Create sample attendance records
        const attendanceEntries = [];
        for (let i = 1; i <= 10; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            attendanceEntries.push({
                student: student._id,
                batch: student.batch,
                date: date,
                status: i % 4 === 0 ? 'absent' : 'present', // 25% absent, 75% present
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        await mongoose.connection.db.collection('attendances').insertMany(attendanceEntries);
        console.log('✅ Sample attendance records created');

        console.log('\n🎉 Student data setup complete!');
        console.log('The student dashboard should now show:');
        console.log('- Today\'s schedule');
        console.log('- Recent notices');
        console.log('- Attendance summary');
        console.log('- Available materials and recordings');

    } catch (error) {
        console.error('Error fixing student data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixStudentData();
