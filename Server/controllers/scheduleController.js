// controllers/scheduleController.js

import Schedule from "../models/Schedule.js";
import Student from "../models/Student.js";

// @desc    Create a new schedule (Teacher Only)
// @route   POST /api/teacher/schedule
export const createSchedule = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { courseId, day, startTime, endTime, room, batchId } = req.body;

    const newSchedule = new Schedule({
      teacherId,
      courseId,
      batchId,
      day,
      startTime,
      endTime,
      room,
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: newSchedule,
    });
  } catch (error) {
    console.error("❌ Create Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while creating schedule" });
  }
};

// @desc    Get schedules for a teacher (optionally filtered by day)
// @route   GET /api/teacher/schedule[?day=Monday]
// @access  Private (Teacher)
export const getSchedulesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { day } = req.query;

    const filter = { teacherId };
    if (day) filter.day = day;

    const schedules = await Schedule.find(filter)
      .populate("batchId", "name")
      .populate("courseId", "name")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("❌ Get Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while fetching schedule" });
  }
};

// ==================== STUDENT DASHBOARD ENDPOINT ====================

// @desc    Get schedule for a student's batch (optionally filtered by day)
// @route   GET /api/student/:id/schedule[?day=Monday]
// @access  Private (Student)
export const getScheduleByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { day } = req.query;

    // Fetch student (may have batch on req.user or Student model)
    let student = req.user;
    if (!student.batch) {
      student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
    }

    const filter = { batchId: student.batch };
    if (day) filter.day = day;

    const schedules = await Schedule.find(filter)
      .populate("teacherId", "name")
      .populate("courseId", "name")
      .sort({ startTime: 1 });

    res.json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    console.error("❌ Get Student Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while fetching schedule" });
  }
};
