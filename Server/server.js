import dotenv from "dotenv";
dotenv.config({ debug: true });

import express from "express";
import cors from "cors";
import connectToDb from "./config/db.js";
import corsOptions from "./config/corsOptions.js";

const app = express();

// Cors middleware
app.use(cors(corsOptions))

// Built-in middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (like from forms)
app.use(express.static("public")); // Serve static files from the "public" directory


// Example route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});

// Global error handler --> it will prevent to crash the server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    connectToDb()
    console.log(`Server is running on http://localhost:${port}/`);
});
