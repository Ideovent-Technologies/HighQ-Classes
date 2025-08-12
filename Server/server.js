import dotenv from "dotenv";
dotenv.config({ debug: true });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileUpload } from "./middleware/fileUpload.js";
import connectToDb from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import configureCloudinary from "./config/cloudinary.js";
import "./config/schedule.js"; // Import to initialize scheduled tasks
import emailService from "./utils/emailService.js";

// Connect to MongoDB
connectToDb();

// Initialize Cloudinary configuration
configureCloudinary();

// Initialize email service
emailService.init();

// Scheduled Notice Publishing
import { scheduleNoticePublishing } from "./utils/scheduleNotices.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import noticeRoutes from "./routes/noticeRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

import recordingRoutes from "./routes/recordingRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import batchRouter from "./routes/batchRoutes.js";
import feeRouter from "./routes/feeRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import studentDashboardRoutes from "./routes/studentDashboardRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import contactRoutes from './routes/contactRoutes.js';
import supportRoutes from "./routes/supportRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";


const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 500, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes'
});

app.use('/api', limiter);

// Cors middleware
app.use(cors(corsOptions));

// Built-in middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies (like from forms)
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser()); // Parse cookies

// Mount routes
app.use("/api/auth", authRoutes);                     // /login, /register, /refresh-token
app.use("/api/teacher", teacherRoutes);               // /profile, /profile PUT
app.use("/api/teacher/notices", noticeRoutes);        // notices CRUD
app.use("/api/teacher/schedule", scheduleRoutes);     // schedule
app.use("/api/attendance", attendanceRoutes);
app.use("/api/student", studentRoutes);         // /:id/profile, pic, change-password
app.use("/api/student", studentDashboardRoutes);        // /dashboard
app.use("/api/courses", courseRoutes);                  // / | GET course list + topics      // attendance

app.use("/api/recordings", recordingRoutes);
app.use("/api/materials", materialRoutes);            // Study materials routes
app.use("/api/assignments", assignmentRoutes);        // Assignment routes

app.use("/api/admin", adminRoutes);
app.use("/api/batches", batchRouter);
app.use("/api/fee", feeRouter);
app.use('/api', contactRoutes); // your contact route
app.use("/api/support", supportRoutes);
app.use("/api/submissions", submissionRoutes);


// Home route
app.get("/", (req, res) => {
  res.send("Welcome to HighQ Classes API");
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler --> it will prevent to crash the server
app.use((err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(error => error.message).join(', ');
  }

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value entered for ${field}. Please use another value.`;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  // Handle JWT expiration
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`HighQ Classes API running on port ${port}`);
  console.log(`Server is running on http://localhost:${port}/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
