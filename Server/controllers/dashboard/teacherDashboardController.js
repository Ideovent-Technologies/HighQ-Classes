import Schedule from "../../models/Schedule.js";
import Notice from "../../models/Notice.js";
import Attendance from "../../models/Attendance.js";
import Material from "../../models/Material.js";
import Recording from "../../models/Recording.js";
import Student from "../../models/Student.js";
import Course from "../../models/Course.js";
import Batch from "../../models/Batch.js";
import mongoose from "mongoose";

/**
 * @desc    Get teacher dashboard overview
 * @route   GET /api/teacher/dashboard
 * @access  Private (Teacher only)
 */
export const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 📅 Today's Schedule for Logged-in Teacher
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    const todaySchedule = await Schedule.find({ teacherId, day: dayOfWeek })
      .populate("batchId", "name")
      .populate("courseId", "title")
      .sort({ startTime: 1 })
      .lean();

    // 🛎 Recent Notices (limit to 5 latest active notices)
    const recentNotices = await Notice.find({
      postedBy: teacherId,
      isActive: true,
      isScheduled: false,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // 📝 Attendance Summary (for today)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceStats = await Attendance.aggregate([
      {
        $match: {
          markedBy: new mongoose.Types.ObjectId(teacherId),
          date: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const attendanceSummary = {
      present: 0,
      absent: 0,
      leave: 0,
      totalMarked: 0,
    };

    attendanceStats.forEach((entry) => {
      if (["present", "absent", "leave"].includes(entry._id)) {
        attendanceSummary[entry._id] = entry.count;
        attendanceSummary.totalMarked += entry.count;
      }
    });

    // 📚 Materials Summary (uploaded by this teacher)
    const materialsCount = await Material.countDocuments({
      uploadedBy: teacherId,
    });

    // 📺 Recordings Summary (active & valid)
    const recordingsCount = await Recording.countDocuments({
      teacher: teacherId,
      isActive: true,
      accessExpires: { $gt: new Date() },
    });

    // 🧑‍🏫 Assigned Students (by batch)
    const teacherBatchIds = await Schedule.distinct("batchId", {
      teacherId,
    });

    const batchStudents = await Student.find({
      batch: { $in: teacherBatchIds },
    })
      .select("name email batch")
      .populate("batch", "name")
      .lean();

    const studentsByBatch = batchStudents.reduce((acc, student) => {
      const batchName = student.batch?.name || "Unknown";
      if (!acc[batchName]) {
        acc[batchName] = [];
      }
      acc[batchName].push({
        _id: student._id,
        name: student.name,
        email: student.email,
      });
      return acc;
    }, {});

    // 📚 Course Content Overview (material + recording stats)
    const materialCourseStats = await Material.aggregate([
      {
        $match: {
          uploadedBy: new mongoose.Types.ObjectId(teacherId),
        },
      },
      {
        $group: {
          _id: "$courseId",
          materialCount: { $sum: 1 },
        },
      },
    ]);

    const recordingCourseStats = await Recording.aggregate([
      {
        $match: {
          teacher: new mongoose.Types.ObjectId(teacherId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$course",
          recordingCount: { $sum: 1 },
        },
      },
    ]);

    // Merge course-wise material & recording stats
    const courseStatsMap = {};

    materialCourseStats.forEach((item) => {
      courseStatsMap[item._id?.toString()] = {
        courseId: item._id,
        materials: item.materialCount,
        recordings: 0,
      };
    });

    recordingCourseStats.forEach((item) => {
      const id = item._id?.toString();
      if (!courseStatsMap[id]) {
        courseStatsMap[id] = {
          courseId: item._id,
          materials: 0,
          recordings: item.recordingCount,
        };
      } else {
        courseStatsMap[id].recordings = item.recordingCount;
      }
    });

    // Fetch course titles to map in final response
    const courseIds = Object.values(courseStatsMap).map((c) => c.courseId);
    const courses = await Course.find({ _id: { $in: courseIds } }).select("title");

    const courseContentOverview = Object.values(courseStatsMap).map((stat) => {
      const course = courses.find((c) => c._id.toString() === stat.courseId.toString());
      return {
        courseTitle: course?.title || "Untitled Course",
        materials: stat.materials,
        recordings: stat.recordings,
      };
    });

    // 🏫 Assigned Batches (via Batch model)
  /** ───────────────────────────────────────
 * 8️⃣ Assigned Batches (via Batch model)
 * Pulls batches assigned to this teacher
 * ─────────────────────────────────────── */
  const assignedBatches = await Batch.find({ teacherId: teacherId })
  .select("name courseId startDate endDate") // Ensure courseId is selected, not 'course'
  .populate("courseId", "name"); // Populate courseId with the course's name


    // ✅ Final Response
    res.json({
      todaySchedule,
      recentNotices,
      attendanceSummary,
      materialsSummary: {
        totalUploaded: materialsCount,
        courseContentOverview,
      },
      recordingsSummary: {
        totalActive: recordingsCount,
      },
      assignedStudents: studentsByBatch,
      assignedBatches,
    });

  } catch (error) {
    console.error("Teacher Dashboard Error:", error);
    res.status(500).json({
      message: "Server error while fetching dashboard.",
    });
  }
};
