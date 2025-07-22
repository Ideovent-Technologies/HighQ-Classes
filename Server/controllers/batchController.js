import Batch from "../models/Batch.js";

// Controller to create a new batch
export const CreateBatch = async (req, res) => {
    const { name, courseId, teacherId, students, schedule, startDate, endDate } = req.body;
    try {

        // Validate required fields
        if (!name || !courseId || !teacherId) {
            return res.status(400).json({ message: "Name, courseId, and teacherId are required." });
        }
        // Create a new batch instance
        if (!Array.isArray(students)) {
            return res.status(400).json({ message: "Students must be an array." });
        }
        const newBatch = new Batch({
            name,
            courseId,
            teacherId,
            students,
            schedule,
            startDate,
            endDate
        });

        const savedBatch = await newBatch.save();
        res.status(201).json(savedBatch);
    } catch (error) {
        res.status(500).json({ message: "Error creating batch", error: error.message });
    }       

}

// Controller to get all batches
export const GetAllBatch = async (req, res) => {
    try {
        const batches = await Batch.find().populate('courseId').populate('teacherId').populate('students');
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching batches", error: error.message });
    }

}

// Controller to update an existing batch
export const UpdateBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const updateData = req.body;

        // Validate required fields
        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required." });
        }

        // Find and update the batch
        const updatedBatch = await Batch.findByIdAndUpdate(batchId, updateData, { new: true })
            .populate('courseId')
            .populate('teacherId')
            .populate('students');

        if (!updatedBatch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json(updatedBatch);
        
    } catch (error) {
        res.status(500).json({ message: "Error updating batch", error: error.message });
        
    }

}

// Controller to delete a batch
export const deleteBatch = async (req, res) => {
    try{
        const { batchId } = req.params;

        // Validate required fields
        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required." });
        }

        // Find and delete the batch
        const deletedBatch = await Batch.findByIdAndDelete(batchId);

        if (!deletedBatch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        res.status(200).json({ message: "Batch deleted successfully." });

    }
catch(error) {
        res.status(500).json({ message: "Error deleting batch", error: error.message });    

}
}

// Controller to assign a student to a batch
export const assignStudentToBatch = async (req, res) => {
    const { batchId, studentId } = req.body;
    try {
        // Validate required fields
        if (!batchId || !studentId) {
            return res.status(400).json({ message: "Batch ID and Student ID are required." });
        }

        // Find the batch and add the student
        const batch = await Batch.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        // Check if student is already assigned
        if (batch.students.includes(studentId)) {
            return res.status(400).json({ message: "Student is already assigned to this batch." });
        }

        batch.students.push(studentId);
        await batch.save();

        res.status(200).json({ message: "Student assigned to batch successfully.", batch });
    } catch (error) {
        res.status(500).json({ message: "Error assigning student to batch", error: error.message });
    }

}

// Controller to get batches by course
export const getBatchesByCourse = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Validate required fields
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        // Find batches by course ID
        const batches = await Batch.find({ courseId }).populate('teacherId').populate('students');
        if (batches.length === 0) {
            return res.status(404).json({ message: "No batches found for this course." });
        }

        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: "Error fetching batches by course", error: error.message });
    }

}
