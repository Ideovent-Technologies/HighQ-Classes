import Fee from "../models/Fee.js";

// Create a new fee entry
export const CreateFee = async (req, res) => {
    try {
        const fee = new Fee(req.body);
        await fee.save();
        res.status(201).json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update an existing fee entry
export const UpdateFee = async (req, res) => {
    try {
        const { id } = req.params;
        const fee = await Fee.findByIdAndUpdate(id, req.body, { new: true });
        if (!fee) {
            return res.status(404).json({ error: "Fee not found" });
        }
        res.json(fee);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all fees for a specific student
export const getFeesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const fees = await Fee.find({ student: studentId });
        res.json(fees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all fees for a specific batch
export const getFeesByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const fees = await Fee.find({ batch: batchId });
        res.json(fees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all upcoming due fees (e.g., due date in the future)
export const getUpcomingDueFees = async (req, res) => {
    try {
        const today = new Date();
        const fees = await Fee.find({ dueDate: { $gte: today }, status: "pending" });
        res.json(fees);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get monthly fee report (grouped by month)
export const getMonthlyFeeReport = async (req, res) => {
    try {
        const report = await Fee.aggregate([
            {
                $group: {
                    _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);
        res.json(report);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};