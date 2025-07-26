import asyncHandler from 'express-async-handler';
import Notice from '../models/Notice.js';

// Create a notice
export const createNotice = asyncHandler(async (req, res) => {
  const notice = new Notice(req.body);
  const savedNotice = await notice.save();
  res.status(201).json(savedNotice);
});

// Get all notices (admin)
export const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notice.find().sort({ createdAt: -1 });
  res.status(200).json(notices);
});

// Get notices by batch
export const getNoticesByBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const notices = await Notice.find({
    targetAudience: 'batch',
    targetBatchIds: batchId,
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: notices.length,
    data: notices,
  });
});

// Update a notice
export const updateNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await Notice.findByIdAndUpdate(id, req.body, { new: true });

  if (!updated) {
    res.status(404);
    throw new Error('Notice not found');
  }

  res.status(200).json(updated);
});

// Delete a notice
export const deleteNotice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await Notice.findByIdAndDelete(id);

  if (!deleted) {
    res.status(404);
    throw new Error('Notice not found');
  }

  res.status(200).json({ message: 'Notice deleted successfully' });
});

/**
 * @desc    Get notices for student dashboard
 * @route   GET /api/student/dashboard/notices
 * @access  Private (Student only)
 */
export const getStudentNotices = asyncHandler(async (req, res) => {
  const student = req.user;

  const notices = await Notice.find({
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: 'students' },
      {
        targetAudience: 'batch',
        targetBatchIds: { $in: [student.batchId] },
      },
    ],
    $or: [
      { isScheduled: false },
      { isScheduled: true, scheduledAt: { $lte: new Date() } },
    ],
  }).sort({ createdAt: -1 });

  res.status(200).json({ notices });
});
