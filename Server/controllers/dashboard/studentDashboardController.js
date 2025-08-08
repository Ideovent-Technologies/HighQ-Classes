// Required Imports
import Schedule from "../../models/Schedule.js";
import Notice from "../../models/Notice.js";
import Attendance from "../../models/Attendance.js";
import Material from "../../models/Material.js";
import Recording from "../../models/Recording.js";
import Student from "../../models/Student.js";
import Course from "../../models/Course.js";

import mongoose from "mongoose";


/**
 * @desc    Get student dashboard overview
 * @route   GET /api/student/dashboard
 * @access  Private (Student only)
 */
export const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // 🧠 1. Get student info
    const student = await Student.findById(studentId)
      .populate('batch')
      .populate('enrolledCourses')
      .lean();

    if (!student) return res.status(404).json({ message: "Student not found" });

    const batchId = student.batch?._id;
    const courseIds = student.enrolledCourses.map(course => course._id);

    // 📅 2. Get Today’s Day
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    // 📆 3. Today's Schedule
    const todaySchedule = await Schedule.find({
      studentIds: studentId,
      day: dayOfWeek,
      batchId: batchId
    })
      .populate("batchId", "batchName")
      .populate("courseId", "name")
      .sort({ startTime: 1 });

    // 🛎 4. Active Notices
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

    // 📝 5. Attendance Summary (Last 30 Days)
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

    // 📚 6. Course Content Overview (Topics from enrolled courses)
    const courseContents = await Course.find(
      { _id: { $in: courseIds } },
      { name: 1, topics: 1 }
    );

    // 📥 7. Material Engagement (viewed/downloaded)
    const materials = await Material.find({
      $or: [
        { batch: batchId },
        { course: { $in: courseIds } }
      ]
    }).lean();

    const materialEngagement = materials.map((m) => ({
      _id: m._id,
      title: m.title,
      fileUrl: m.fileUrl,
      totalDownloads: m.downloadCount || 0,
      viewedByStudent: Array.isArray(m.viewedBy) ? m.viewedBy.includes(studentId) : false
    }));

    // 📺 8. Recording Viewing Stats
    const recordings = await Recording.find({
      batch: batchId,
      isActive: true
    }).lean();

    const recordingStats = recordings.map((r) => ({
      _id: r._id,
      title: r.title,
      videoUrl: r.videoUrl,
      totalViews: Array.isArray(r.views) ? r.views.length : 0,
      viewedByStudent: Array.isArray(r.views) ? r.views.some((v) => v.student.toString() === studentId.toString()) : false
    }));

    // ✅ 9. Final Response
    res.json({
      greeting: `Welcome, ${student.name}`,
      dashboardData: {
        todaySchedule,
        recentNotices,
        attendanceSummary,
        materialsSummary: {
          totalAvailable: materials.length
        },
        recordingsSummary: {
          totalAvailable: recordings.length
        },
        // New Features:
        courseContent: courseContents,
        materialEngagement,
        recordingStats
      }
    });

  } catch (error) {
    console.error("Student Dashboard Error:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard."
    });
  }
};
