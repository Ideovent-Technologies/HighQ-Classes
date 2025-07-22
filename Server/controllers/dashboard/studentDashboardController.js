//import Schedule from "../../models/Schedule.js";
//import Notice from "../../models/Notice.js";
import Attendance from "../../models/Attendance.js";
import Material from "../../models/Material.js";
import Recording from "../../models/Recording.js";
import Student from "../../models/Student.js";
import mongoose from "mongoose";

/**
 * @desc    Get student dashboard overview
 * @route   GET /api/student/dashboard
 * @access  Private (Student only)
 */
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // 🧠 Get Student Info (to know batch, course, etc.)
    const student = await Student.findById(studentId)
      .populate('batch') // assuming batch is ObjectId
      .populate('enrolledCourses')
      .lean();

    if (!student) return res.status(404).json({ message: "Student not found" });

    const batchId = student.batch?._id;
    const courseIds = student.enrolledCourses.map(course => course._id);

    // ---------- Get Today’s Day ----------
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    // ---------- 1. Today’s Schedule ----------
    const todaySchedule = await Schedule.find({
      studentIds: studentId,   // assuming student-specific or batch-mapped schedule
      day: dayOfWeek,
      batchId: batchId
    })
      .populate("batchId", "batchName")
      .populate("courseId", "name")
      .sort({ startTime: 1 });

    // ---------- 2. Active Notices (limit 5) ----------
    const recentNotices = await Notice.find({
      isActive: true,
      isScheduled: false,
      $or: [
        { batch: batchId },
        { course: { $in: courseIds } }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // ---------- 3. Attendance Summary (last 30 days) ----------
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
          date: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const attendanceSummary = {
      present: 0,
      absent: 0,
      leave: 0,
      totalDays: 0
    };

    attendanceStats.forEach((entry) => {
      if (["present", "absent", "leave"].includes(entry._id)) {
        attendanceSummary[entry._id] = entry.count;
        attendanceSummary.totalDays += entry.count;
      }
    });

    // ---------- 4. Materials Summary ----------
    const materialsCount = await Material.countDocuments({
      batch: batchId,
      isActive: true
    });

    // ---------- 5. Recordings Summary ----------
    const recordingsCount = await Recording.countDocuments({
      batch: batchId,
      isActive: true,
      accessExpires: { $gt: new Date() }
    });

    // ---------- 6. Final Dashboard Response ----------
    res.json({
      greeting: `Welcome, ${student.name}`,
      dashboardData: {
        todaySchedule,
        recentNotices,
        attendanceSummary,
        materialsSummary: {
          totalAvailable: materialsCount
        },
        recordingsSummary: {
          totalAvailable: recordingsCount
        },
        // ✅ Future Ideas:
        // upcomingExams: [], assignments: [], feeDueSummary: {}
      }
    });

  } catch (error) {
    console.error("Student Dashboard Error:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard."
    });
  }
};
