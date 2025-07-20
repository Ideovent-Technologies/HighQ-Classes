import asyncHandler from 'express-async-handler';
import Notice from '../models/Notice.js';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import Batch from '../models/Batch.js';

/**
 * @desc    Create a new notice (for all, batch, or individual student)
 * @route   POST /api/teacher/notices
 * @access  Private (Teacher only)
 */
export const createNotice = asyncHandler(async (req, res) => {
  const { title, description, batch, student, scheduledAt, audience } = req.body;

  const notice = new Notice({
    title,
    description,
    batch,
    student,
    audience,
    postedBy: req.user._id,
    isScheduled: scheduledAt ? true : false,
    scheduledAt: scheduledAt || null,
  });

  await notice.save();

  res.status(201).json({
    message: notice.isScheduled
      ? 'Notice scheduled successfully.'
      : 'Notice created successfully.',
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

  const updatedNotice = await Notice.findByIdAndUpdate(noticeId, updates, {
    new: true,
  });

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

  await Notice.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: 'Notice deleted successfully' });
});

/**
 * @desc    Get all notices by teacher (filtered and paginated)
 * @route   GET /api/teacher/notices
 * @access  Private (Teacher only)
 */
export const getAllNotices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, batch, audience, keyword } = req.query;
  const skip = (page - 1) * limit;

  const filter = {
    postedBy: req.user._id,
    $or: [{ isScheduled: false }, { scheduledAt: { $lte: new Date() } }],
  };

  if (batch) filter.batch = batch;
  if (audience) filter.audience = audience;
  if (keyword) {
    filter.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
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
    res.status(404);
    throw new Error('Notice not found');
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
    batch: batchId,
    $or: [{ isScheduled: false }, { scheduledAt: { $lte: new Date() } }],
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notices.length,
    data: notices,
  });
});
