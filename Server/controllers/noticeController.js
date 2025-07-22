// @desc    Get all notices (by teacher) with filters & pagination
// @route   GET /api/teacher/notices
// @access  Private (Teacher only)
export const getAllNotices = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const { page = 1, limit = 10, batch, audience, date } = req.query;

    const parsedPage = parseInt(page) || 1;
    const parsedLimit = parseInt(limit) || 10;

    // 🧠 Build dynamic filter
    const filter = {
      postedBy: teacherId,
      $or: [{ isScheduled: false }, { scheduledAt: { $lte: new Date() } }],
    };

    if (batch) filter.targetBatchIds = { $in: [batch] };

    if (audience) filter.targetAudience = audience;


    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    const total = await Notice.countDocuments(filter);

    const notices = await Notice.find(filter)
      .sort({ createdAt: -1 })
      .skip((parsedPage - 1) * parsedLimit)
      .limit(parsedLimit)
      .lean(); // 🔹 Performance boost

    res.json({
      success: true,
      total,
      page: parsedPage,
      pages: Math.ceil(total / parsedLimit),
      data: notices,
    });
  } catch (error) {
    console.error("❌ Get Notices Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
