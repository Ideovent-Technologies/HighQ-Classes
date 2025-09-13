import asyncHandler from 'express-async-handler';
import Notice from '../models/Notice.js';
import Student from '../models/Student.js';

/**
 * @desc    Create a new notice
 * @route   POST /teacher/notices
 * @access  Private (Teacher only)
 */
export const createNotice = asyncHandler(async (req, res) => {
  const { title, description, targetBatchIds, targetAudience, scheduledAt, isScheduled } = req.body;

  const notice = new Notice({
    title,
    description,
    targetBatchIds,
    targetAudience,
    isScheduled: !!isScheduled,
    scheduledAt: isScheduled ? new Date(scheduledAt) : null,
    postedBy: req.user._id,
  });

  await notice.save();

  res.status(201).json({
    success: true,
    message: 'Notice created successfully.',
    data: notice,
  });
});

/**
 * @desc    Update a notice
 * @route   PUT /teacher/notices/:id
 * @access  Private (Teacher only)
 */
export const updateNotice = asyncHandler(async (req, res) => {
  const noticeId = req.params.id;
  const updates = req.body;

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }

  if (notice.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  Object.assign(notice, updates);
  const updatedNotice = await notice.save();

  res.status(200).json({ success: true, message: 'Notice updated successfully', data: updatedNotice });
});

/**
 * @desc    Delete a notice
 * @route   DELETE /teacher/notices/:id
 * @access  Private (Teacher only)
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return res.status(404).json({ success: false, message: 'Notice not found' });
  }

  if (notice.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Unauthorized' });
  }

  await notice.deleteOne();

  res.status(200).json({ success: true, message: 'Notice deleted successfully' });
});


/**
 * @desc    Get all notices (role-aware)
 * @route   GET /api/notices
 * @access  Private (Teacher, Admin, Student)
 */
export const getAllNotices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, targetAudience, targetBatchId, keyword, date } = req.query;
  const skip = (page - 1) * limit;

  const baseFilter = {
    $or: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { $lte: new Date() } },
    ],
  };

  const filter = { ...baseFilter };

  if (req.user.role === "teacher") {
    filter.postedBy = req.user._id;
  }

  if (targetAudience) filter.targetAudience = targetAudience;
  if (targetBatchId) filter.targetBatchIds = { $in: [targetBatchId] };

  if (keyword) {
    filter.$and = [
      baseFilter,
      {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }
        ]
      }
    ];
    delete filter.$or;
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  const total = await Notice.countDocuments(filter);
  const notices = await Notice.find(filter)
    .populate("postedBy", "name role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  // Sending a consistent response format with a 'data' key
  res.json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: notices,
  });
});

/**
 * @desc    Get a single notice by ID (role-aware)
 * @route   GET /api/notices/:id
 * @access  Private (Teacher, Admin)
 */
export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate("postedBy", "name role");

  if (!notice) {
    return res.status(404).json({ success: false, message: "Notice not found" });
  }

  if (req.user.role === "teacher" && notice.postedBy._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  res.json({ success: true, data: notice });
});


/**
 * @desc    Get all notices for a student
 * @route   GET /api/notices/student
 * @access  Private (Student only)
 */
export const getNoticesForStudent = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const student = await Student.findById(studentId).populate("batches");

  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found" });
  }

  const batchIds = student.batches.map((b) => b._id);

  const notices = await Notice.find({
    isActive: true,
    $and: [
      {
        $or: [
          { targetAudience: "all" },
          { targetAudience: "students" },
          { targetAudience: "batch", targetBatchIds: { $in: batchIds } },
        ]
      },
      {
        $or: [
          { isScheduled: false },
          { isScheduled: true, scheduledAt: { $lte: new Date() } },
        ]
      }
    ]
  })
    .populate("postedBy", "name role")
    .sort({ createdAt: -1 });

  // Sending a consistent response format with a 'data' key
  res.json({ success: true, count: notices.length, data: notices });
});
