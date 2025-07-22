// controllers/attendanceController.js

import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// @desc    Mark attendance for students
// @route   POST /api/teacher/attendance
// @access  Private (Teacher)
export const markAttendance = async (req, res) => {
  try {
    const { batchId, date, attendance } = req.body;
    const teacherId = req.user._id;

    if (!batchId || !date || !attendance || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Invalid attendance data." });
    }

    const formattedDate = new Date(date);
    const attendanceRecords = attendance.map((entry) => ({
      studentId: entry.studentId,
      batchId,
      date: formattedDate,
      status: entry.status || "present",
      markedBy: teacherId,
    }));

    // Remove existing records for the same batch & date to allow re-submission
    await Attendance.deleteMany({ batchId, date: formattedDate });

    // Insert new attendance entries
    const saved = await Attendance.insertMany(attendanceRecords);

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully.",
      count: saved.length,
    });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get attendance for a batch on a specific date
// @route   GET /api/teacher/attendance?batchId=...&date=...
// @access  Private (Teacher)
export const getAttendanceByBatchAndDate = async (req, res) => {
  try {
    const { batchId, date } = req.query;

    if (!batchId || !date) {
      return res.status(400).json({ message: "Batch ID and date are required." });
    }

    const formattedDate = new Date(date);
    const records = await Attendance.find({ batchId, date: formattedDate })
      .populate("studentId", "name rollNumber")
      .lean();

    res.json({ success: true, data: records });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};
