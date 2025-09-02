import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import connectToDb from './config/db.js';  // use this
import Student from './models/Student.js';
import Batch from './models/Batch.js';
import Course from './models/Course.js';

const syncCourses = async () => {
  try {
    const batches = await Batch.find({}).populate("students").populate("courseId");

    for (const batch of batches) {
      const courseId = batch.courseId?._id;
      if (!courseId) continue;

      for (const student of batch.students) {
        await Student.findByIdAndUpdate(student._id, {
          $addToSet: { courses: courseId } // ensures no duplicates
        });
      }
    }

    console.log("Sync complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error syncing courses:", err);
    process.exit(1);
  }
};

connectToDb().then(syncCourses);
