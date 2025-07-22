import express from "express";
import {

CreateFee,
UpdateFee,
getFeesByStudent,
getFeesByBatch,
getUpcomingDueFees,
getMonthlyFeeReport
} from "../controllers/feeController.js";

const router = express.Router();

// Create a new fee entry
router.post("/", CreateFee);

// Update an existing fee entry
router.put("/:id", UpdateFee);

// Get all fees for a specific student
router.get("/student/:studentId", getFeesByStudent);

// Get all fees for a specific batch
router.get("/batch/:batchId", getFeesByBatch);

// Get all upcoming due fees
router.get("/upcoming-due", getUpcomingDueFees);

// Get monthly fee report
router.get("/monthly-report", getMonthlyFeeReport);

export default router;