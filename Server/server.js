import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import teacherRoutes from './routes/teacherRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import cron from 'node-cron';
import scheduleNotices from './schedule/schedule.js';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// ✅ Routes
app.use('/api/teacher/notices', teacherRoutes);

// ✅ Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Error Handling
app.use(notFound);
app.use(errorHandler);

// ✅ Scheduled Job: Every minute
cron.schedule('* * * * *', async () => {
  console.log('⏰ Running scheduled notice check...');
  await scheduleNotices(); // runs your logic to auto-publish scheduled notices
});

// ✅ Server Listen
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
