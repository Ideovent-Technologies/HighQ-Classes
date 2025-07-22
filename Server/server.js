// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// 🛣 Import Routes
import studentProfileRoutes from './routes/studentRoutes.js'; 
import studentDashboardRoutes from './routes/studentDashboardRoutes.js';// make sure name matches exact Route file

// 🔐 Load environment variables from .env file
dotenv.config();

// 🧠 ES6-compatible __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🚀 Initialize Express App
const app = express();

// 🧩 Middleware Setup
app.use(express.json());
 // Parse incoming JSON requests
app.use(cors());         // Enable CORS
app.use(morgan('dev'));  // Log incoming requests (development only)

// 📂 Serve static files (e.g. profile pictures, resources for download)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 📌 API Routes
app.use('/api/student', studentProfileRoutes);
app.use('/api/student', studentDashboardRoutes); // Example: /api/student/:id/profile

// 🚨 Root route (health check)
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ⚙ MongoDB Configuration
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/studentDB';

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(`✅ MongoDB Connected`);
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`❌ MongoDB connection error:\n`, err);
    process.exit(1);
  });
