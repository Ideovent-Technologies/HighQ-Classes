import Schedule from "../models/Schedule.js";
import Batch from "../models/Batch.js"; // Needed for student schedules

// ------------------------ TEACHER ------------------------
export const createSchedule = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { courseId, day, startTime, endTime, room, batchId } = req.body;

    // Check if batchId is an array, and if so, handle each one.
    // This allows a teacher to create one schedule for multiple batches.
    const batchIdsToCreate = Array.isArray(batchId) ? batchId : [batchId];

    const schedulesToCreate = [];

    for (const id of batchIdsToCreate) {
      // Check for overlapping schedules for this teacher
      const overlap = await Schedule.findOne({
        teacherId,
        day,
        $or: [
          { startTime: { $lt: endTime, $gte: startTime } },
          { endTime: { $lte: endTime, $gt: startTime } },
        ],
      });

      if (overlap) {
        return res.status(400).json({ message: "Schedule overlaps with existing one." });
      }

      const newSchedule = {
        teacherId,
        courseId,
        batchId: id, // Use the individual batch ID
        day,
        startTime,
        endTime,
        room
      };
      schedulesToCreate.push(newSchedule);
    }

    // Insert all schedules at once for efficiency
    await Schedule.insertMany(schedulesToCreate);

    res.status(201).json({ success: true, message: "Schedule created successfully" });
  } catch (error) {
    console.error("❌ Create Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while creating schedule" });
  }
};

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

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error("❌ Get Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while fetching schedule" });
  }
};

// ------------------------ ADMIN ------------------------
export const getAllSchedules = async (req, res) => {
  try {
    const { teacherId, batchId, day } = req.query;
    const filter = {};
    if (teacherId) filter.teacherId = teacherId;
    if (batchId) filter.batchId = batchId;
    if (day) filter.day = day;

    const schedules = await Schedule.find(filter)
      .populate("batchId", "name")
      .populate("courseId", "name")
      .populate("teacherId", "name")
      .sort({ day: 1, startTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error("❌ Get All Schedules Error:", error.message);
    res.status(500).json({ message: "Server error while fetching schedules" });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndUpdate(id, req.body, { new: true });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json({ success: true, data: schedule });
  } catch (error) {
    console.error("❌ Update Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while updating schedule" });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json({ success: true, message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("❌ Delete Schedule Error:", error.message);
    res.status(500).json({ message: "Server error while deleting schedule" });
  }
};

// ------------------------ STUDENT ------------------------
export const getSchedulesForStudent = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Get all batches the student belongs to
    const studentBatches = await Batch.find({ students: studentId }).select("_id");
    const batchIds = studentBatches.map((b) => b._id);

    const schedules = await Schedule.find({ batchId: { $in: batchIds } })
      .populate("batchId", "name")
      .populate("courseId", "name")
      .populate("teacherId", "name")
      .sort({ day: 1, startTime: 1 });

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error("❌ Get Student Schedules Error:", error.message);
    res.status(500).json({ message: "Server error while fetching schedules" });
  }
};
