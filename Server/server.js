import dotenv from "dotenv";
dotenv.config({ debug: true });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import fileUpload from "express-fileupload";
import connectToDb from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
import configureCloudinary from "./config/cloudinary.js";
import "./config/schedule.js"; // Import to initialize scheduled tasks

// Import routes
import authRoutes from "./routes/authRoutes.js";
import recordingRoutes from "./routes/recordingRoutes.js";

const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers
app.use(mongoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS

// Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
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
app.use("/api/auth", authRoutes);
app.use("/api/recordings", recordingRoutes);

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
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong!",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectToDb();
    configureCloudinary();
    console.log(`Server is running on http://localhost:${port}/`);
});
