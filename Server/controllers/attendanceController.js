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

    // Parse the date and create a date range for the entire day
    const inputDate = new Date(date);
    const startOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    const endOfDay = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate() + 1);

    // Create attendance records
    const attendanceRecords = attendance.map((entry) => ({
      studentId: entry.studentId,
      batchId,
      date: startOfDay,
      status: entry.status || "present",
      notes: entry.notes || "",
      markedBy: teacherId,
    }));

    // Delete existing records for the batch & date range to allow re-marking
    await Attendance.deleteMany({
      batchId,
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    // Insert updated records
    const saved = await Attendance.insertMany(attendanceRecords);

    // Update student attendance summaries
    await updateStudentAttendanceSummaries(attendance.map(entry => entry.studentId));

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

// @desc    Get student's own attendance records
// @route   GET /api/attendance/student
// @access  Private (Student)
export const getStudentAttendance = async (req, res) => {
  try {
    const studentUserId = req.user._id;
    const { startDate, endDate, limit = 50, page = 1 } = req.query;

    // The student IS the user, so use the user ID directly
    const student = await Student.findById(studentUserId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student record not found"
      });
    }

    // Build date filter
    const dateFilter = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    // Build query - use studentUserId directly as it's the student's _id
    const query = { studentId: studentUserId };
    if (Object.keys(dateFilter).length > 0) {
      query.date = dateFilter;
    }

    // Get total count for pagination
    const totalRecords = await Attendance.countDocuments(query);

    // Get attendance records with pagination
    const attendanceRecords = await Attendance.find(query)
      .populate('batchId', 'name')
      .populate('markedBy', 'name')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    // Calculate attendance statistics
    const stats = await Attendance.aggregate([
      { $match: { studentId: studentUserId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalDays = stats.reduce((sum, stat) => sum + stat.count, 0);
    const presentDays = stats.find(stat => stat._id === 'present')?.count || 0;
    const absentDays = stats.find(stat => stat._id === 'absent')?.count || 0;
    const leaveDays = stats.find(stat => stat._id === 'leave')?.count || 0;
    const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        attendance: attendanceRecords,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalRecords / parseInt(limit)),
          totalRecords,
          limit: parseInt(limit)
        },
        statistics: {
          totalDays,
          presentDays,
          absentDays,
          leaveDays,
          attendancePercentage
        }
      }
    });

  } catch (error) {
    console.error("❌ Error fetching student attendance:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching attendance records"
    });
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

    // First, get the batch with all students
    const Batch = (await import("../models/Batch.js")).default;
    const batch = await Batch.findById(batchId)
      .populate("students", "name email rollNumber")
      .lean();

    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    // Get existing attendance records for this batch and date
    const attendanceRecords = await Attendance.find({ batchId, date: formattedDate })
      .populate("studentId", "name rollNumber email")
      .lean();

    // Create a map of student attendance records
    const attendanceMap = new Map();
    attendanceRecords.forEach(record => {
      attendanceMap.set(record.studentId._id.toString(), record);
    });

    // Combine all batch students with their attendance status
    const studentsWithAttendance = batch.students.map(student => {
      const attendanceRecord = attendanceMap.get(student._id.toString());
      return {
        studentId: student._id,
        studentName: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        attendanceStatus: attendanceRecord ? attendanceRecord.status : "present", // default to present
        notes: attendanceRecord ? attendanceRecord.notes : "",
        markedAt: attendanceRecord ? attendanceRecord.markedAt : null,
        _id: student._id
      };
    });

    res.json({
      success: true,
      data: {
        batchId: batch._id,
        batchName: batch.name,
        date: formattedDate,
        students: studentsWithAttendance,
        totalStudents: studentsWithAttendance.length
      }
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

// @desc    Get attendance records with pagination and filters
// @route   GET /api/attendance/records?batchId=...&page=1&limit=50
// @access  Private (Teacher)
export const getAttendanceRecords = async (req, res) => {
  try {
    const {
      batchId,
      courseId,
      studentId,
      startDate,
      endDate,
      status,
      page = 1,
      limit = 50
    } = req.query;

    const teacherId = req.user._id;

    console.log("🔍 Teacher requesting attendance records:", {
      teacherId,
      batchId,
      startDate,
      endDate,
      status,
      page,
      limit
    });

    // Build filter query
    const filter = {
      markedBy: teacherId, // Only show records marked by this teacher
    };

    if (batchId) filter.batchId = batchId;
    if (courseId) filter.courseId = courseId;
    if (studentId) filter.studentId = studentId;
    if (status) filter.status = status;

    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    console.log("🔍 Final filter query:", filter);

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Get records with pagination
    const records = await Attendance.find(filter)
      .populate("studentId", "name email rollNumber")
      .populate("batchId", "name")
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Get total count for pagination
    const totalRecords = await Attendance.countDocuments(filter);

    console.log("📊 Query results:", {
      recordsFound: records.length,
      totalRecords,
      sampleRecord: records[0] || "No records found"
    });

    res.json({
      success: true,
      data: {
        records,
        pagination: {
          total: totalRecords,
          page: parseInt(page),
          pages: Math.ceil(totalRecords / limitNum),
          limit: limitNum
        }
      }
    });
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error.message);
    res.status(500).json({ message: "Failed to get attendance records." });
  }
};

// Helper function to update student attendance summaries
const updateStudentAttendanceSummaries = async (studentIds) => {
  try {
    for (const studentId of studentIds) {
      // Get all attendance records for this student
      const attendanceRecords = await Attendance.find({ studentId }).lean();

      // Calculate summary statistics
      const totalClasses = attendanceRecords.length;
      const attendedClasses = attendanceRecords.filter(record =>
        record.status === 'present' || record.status === 'late'
      ).length;
      const percentage = totalClasses > 0 ? Math.round((attendedClasses / totalClasses) * 100) : 0;

      // Create records array for student document
      const records = attendanceRecords.map(record => ({
        date: record.date,
        status: record.status,
        batchId: record.batchId,
        notes: record.notes || ""
      }));

      // Update student document
      await Student.findByIdAndUpdate(
        studentId,
        {
          $set: {
            "attendance.percentage": percentage,
            "attendance.totalClasses": totalClasses,
            "attendance.attendedClasses": attendedClasses,
            "attendance.records": records
          }
        },
        { new: true }
      );
    }
    console.log(` Updated attendance summaries for ${studentIds.length} students`);
  } catch (error) {
    console.error("❌ Error updating student attendance summaries:", error);
  }
};

// @desc    Rebuild attendance summaries for all students (utility endpoint)
// @route   POST /api/attendance/rebuild-summaries
// @access  Private (Teacher/Admin)
export const rebuildAttendanceSummaries = async (req, res) => {
  try {
    // Get all students who have attendance records
    const studentsWithAttendance = await Attendance.distinct('studentId');

    if (studentsWithAttendance.length === 0) {
      return res.json({
        success: true,
        message: "No students with attendance records found.",
        updated: 0
      });
    }

    // Update summaries for all students
    await updateStudentAttendanceSummaries(studentsWithAttendance);

    res.json({
      success: true,
      message: `Attendance summaries rebuilt for ${studentsWithAttendance.length} students.`,
      updated: studentsWithAttendance.length
    });
  } catch (error) {
    console.error("❌ Error rebuilding attendance summaries:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rebuild attendance summaries."
    });
  }
};
