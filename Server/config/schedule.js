import cron from 'node-cron';
import Notice from '../models/Notice.js';

// ⏱️ Runs every minute
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();

    // 📌 Find scheduled notices that should now be published
    const notices = await Notice.find({
      isScheduled: true,
      scheduledAt: { $lte: now },
      published: false, // only pick unpublished ones
    });

    // 📤 Mark them as published
    for (const notice of notices) {
      notice.published = true;
      await notice.save();
    }

    if (notices.length > 0) {
      console.log(`✅ ${notices.length} scheduled notices published.`);
    }
  } catch (err) {
    console.error('❌ Scheduled Notice Error:', err);
  }
});
