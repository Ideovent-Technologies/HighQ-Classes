import asyncHandler from 'express-async-handler';
import Notice from '../models/Notice.js';

/**
 * @desc    Create a new notice
 * @route   POST /api/teacher/notices
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
    message: 'Notice created successfully.',
    notice,
  });
});

/**
 * @desc    Update a notice
 * @route   PUT /api/teacher/notices/:id
 * @access  Private (Teacher only)
 */
export const updateNotice = asyncHandler(async (req, res) => {
  const noticeId = req.params.id;
  const updates = req.body;

  const notice = await Notice.findById(noticeId);
  if (!notice) {
    return res.status(404).json({ message: 'Notice not found' });
  }

  if (notice.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  Object.assign(notice, updates);
  const updatedNotice = await notice.save();

  res.status(200).json(updatedNotice);
});

/**
 * @desc    Delete a notice
 * @route   DELETE /api/teacher/notices/:id
 * @access  Private (Teacher only)
 */
export const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return res.status(404).json({ message: 'Notice not found' });
  }

  if (notice.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  await notice.remove();

  res.status(200).json({ message: 'Notice deleted successfully' });
});

/**
 * @desc    Get all notices by teacher (filtered and paginated)
 * @route   GET /api/teacher/notices
 * @access  Private (Teacher only)
 */
export const getAllNotices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, targetAudience, targetBatchId, keyword, date } = req.query;
  const skip = (page - 1) * limit;

  const filter = {
    postedBy: req.user._id,
    $or: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { $lte: new Date() } },
    ],
  };

  if (targetAudience) filter.targetAudience = targetAudience;
  if (targetBatchId) filter.targetBatchIds = { $in: [targetBatchId] };
  if (keyword) {
    filter.$or.push({
      title: { $regex: keyword, $options: 'i' },
    }, {
      description: { $regex: keyword, $options: 'i' },
    });
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.createdAt = { $gte: start, $lte: end };
  }

  const total = await Notice.countDocuments(filter);
  const notices = await Notice.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.json({
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    notices,
  });
});

/**
 * @desc    Get a single notice by ID
 * @route   GET /api/teacher/notices/:id
 * @access  Private (Teacher only)
 */
export const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);
  if (!notice) {
    return res.status(404).json({ message: 'Notice not found' });
  }

  if (notice.postedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  res.json(notice);
});

/**
 * @desc    Get all notices for a specific batch
 * @route   GET /api/teacher/notices/batch/:batchId
 * @access  Private (Teacher only)
 */
export const getNoticesByBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  const notices = await Notice.find({
    targetBatchIds: batchId,
    $or: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { $lte: new Date() } },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notices.length,
    data: notices,
  });
});
