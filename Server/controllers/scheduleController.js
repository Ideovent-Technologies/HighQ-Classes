// controllers/scheduleController.js

import Schedule from "../models/Schedule.js";

// @desc    Create a new schedule
// @route   POST /api/teacher/schedule
// @access  Private (Teacher only)
export const createSchedule = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { title, description, date, startTime, endTime, batchId } = req.body;

    const schedule = new Schedule({
      teacher: teacherId,
      title,
      description,
      date,
      startTime,
      endTime,
      batch: batchId,
    });

    await schedule.save();

    res.status(201).json({ success: true, data: schedule });
  } catch (error) {
    console.error("❌ Create Schedule Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get schedules for a teacher (with optional date filter)
// @route   GET /api/teacher/schedule
// @access  Private (Teacher only)
export const getSchedulesByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { date } = req.query;

    const filter = { teacher: teacherId };
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const schedules = await Schedule.find(filter)
      .populate("batch", "name")
      .sort({ date: 1, startTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error("❌ Get Schedule Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
