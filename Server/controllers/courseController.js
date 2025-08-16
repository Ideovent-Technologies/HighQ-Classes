// controllers/courseController.js
import Course from '../models/Course.js';

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { name, description, duration, fee, topics } = req.body;
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) return res.status(400).json({ error: 'Course already exists' });

    const course = new Course({
      name,
      description,
      duration,
      fee,
      topics
    });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// get course by ID
export const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ error: 'Course not found' });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate({
      path: 'batches.teacher',
      select: 'name email'
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update course details
export const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;
    const course = await Course.findByIdAndUpdate(courseId, updates, { new: true });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a batch to a course
export const addBatchToCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { batchName, schedule, teacher, startDate, endDate, students } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.batches.push({ batchName, schedule, teacher, startDate, endDate, students });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update batch details (including teacher, schedule, dates)
export const updateBatch = async (req, res) => {
  try {
    const { courseId, batchId } = req.params;
    const batchUpdates = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const batch = course.batches.id(batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    Object.assign(batch, batchUpdates);
    await course.save();
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or remove student from batch
export const updateStudentsInBatch = async (req, res) => {
  try {
    const { courseId, batchId } = req.params;
    const { addStudents = [], removeStudents = [] } = req.body;  // Array of student IDs

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const batch = course.batches.id(batchId);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });

    // Add students (only if not already in array)
    addStudents.forEach(sid => {
      if (!batch.students.includes(sid)) batch.students.push(sid);
    });

    // Remove students
    batch.students = batch.students.filter(sid => !removeStudents.includes(sid.toString()));

    await course.save();
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
