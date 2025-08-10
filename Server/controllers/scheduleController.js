import Schedule from "../models/Schedule.js";

// @desc    Create a new schedule
// @route   POST /api/teacher/schedule
// @access  Private (Teacher only)
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

// @desc    Get schedules for a teacher (with optional day filter)
// @route   GET /api/teacher/schedule
// @access  Private (Teacher only)
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
