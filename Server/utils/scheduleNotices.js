import cron from 'node-cron';
import Notice from '../models/Notice.js';

export const scheduleNoticePublishing = () => {
  cron.schedule('*/1 * * * *', async () => {
    const now = new Date();
    try {
      const notices = await Notice.find({
        isScheduled: true,
        scheduledAt: { $lte: now },
        isActive: false,
      });

      for (let notice of notices) {
        notice.isActive = true;
        notice.isScheduled = false;
        await notice.save();
        console.log(`📢 Notice activated: ${notice.title}`);
      }
    } catch (error) {
      console.error("❌ Scheduled Notice Error:", error);
    }
  });
};
