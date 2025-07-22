import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// @desc    Mark attendance for students
// @route   POST /api/teacher/attendance
// @access  Private (Teacher)
export const markAttendance = async (req, res) => {
  try {
    const { batchId, date, attendance } = req.body;
    const teacherId = req.user._id;

    if (
      !batchId ||
      !date ||
      !Array.isArray(attendance) ||
      attendance.length === 0
    ) {
      return res.status(400).json({ message: "Invalid attendance data." });
    }

    const formattedDate = new Date(date);

    // Create attendance records
    const attendanceRecords = attendance.map((entry) => ({
      studentId: entry.studentId,
      batchId,
      date: formattedDate,
      status: entry.status || "present",
      markedBy: teacherId,
    }));

    // Delete existing records for the batch & date to allow re-marking
    await Attendance.deleteMany({ batchId, date: formattedDate });

    // Insert updated records
    const saved = await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      count: saved.length,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error.message);
    res.status(500).json({ message: "Server error while marking attendance." });
  }
};

// @desc    Get attendance for a batch on a specific date
// @route   GET /api/teacher/attendance?batchId=...&date=...
// @access  Private (Teacher)
export const getAttendanceByBatchAndDate = async (req, res) => {
  try {
    const { batchId, date } = req.query;

    if (!batchId || !date) {
      return res
        .status(400)
        .json({ message: "Batch ID and date are required." });
    }

    const formattedDate = new Date(date);

    const records = await Attendance.find({ batchId, date: formattedDate })
      .populate("studentId", "name rollNumber")
      .lean();

    res.json({
      success: true,
      data: records,
    });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error.message);
    res
      .status(500)
      .json({ message: "Server error while fetching attendance." });
  }
};

// Example: Return summary counts for today across teacher's batches

export const getAttendanceSummary = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { date } = req.query;
    const formattedDate = date ? new Date(date) : new Date();

    const summary = await Attendance.aggregate([
      {
        $match: {
          markedBy: teacherId,
          date: formattedDate,
        },
      },
      {
        $group: {
          _id: { batchId: "$batchId", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({ success: true, data: summary });
  } catch (error) {
    console.error("❌ Error fetching summary:", error.message);
    res.status(500).json({ message: "Failed to get attendance summary." });
  }
};
