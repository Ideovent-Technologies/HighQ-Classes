import Batch from "../models/Batch.js";
import Student from "../models/Student.js";
// Import Student model to update batch field

// ✅ Admin: Create a new batch
export const CreateBatch = async (req, res) => {
  const { name, courseId, teacherId, students, schedule, startDate, endDate } = req.body;
  try {
    if (!name || !courseId || !teacherId) {
      return res.status(400).json({ message: "Name, courseId, and teacherId are required." });
    }
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
      endDate,
    });

    const savedBatch = await newBatch.save();

    // Update students' batch reference
    await Student.updateMany(
      { _id: { $in: students } },
      { $set: { batch: savedBatch._id } }  // Update batch field for each student
    );

    res.status(201).json(savedBatch);
  } catch (error) {
    res.status(500).json({ message: "Error creating batch", error: error.message });
  }
};

// ✅ Admin: Get all batches
export const GetAllBatch = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("courseId")
      .populate("teacherId")
      .populate("students");  // Populate students' data
    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches", error: error.message });
  }
};

// ✅ Admin: Update batch
export const UpdateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const updateData = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required." });
    }

    const updatedBatch = await Batch.findByIdAndUpdate(batchId, updateData, { new: true })
      .populate("courseId")
      .populate("teacherId")
      .populate("students");  // Populate students after update

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    res.status(200).json(updatedBatch);
  } catch (error) {
    res.status(500).json({ message: "Error updating batch", error: error.message });
  }
};

// get batch by ID
export const getBatchById = async (req, res) => {
  try {
    const batchId = req.params.batchId;
    console.log("Batch ID received:", batchId);

    if (!batchId || batchId.length !== 24) {
      return res.status(400).json({ error: "Invalid batch ID format" });
    }

    const batch = await Batch.findById(batchId)
      .populate("courseId", "name")
      .populate("teacherId", "name email")
      .populate("students", "name email");

    if (!batch) {
      console.log("No batch found for this ID");
      return res.status(404).json({ error: "Batch not found" });
    }

    res.json(batch);
  } catch (err) {
    console.error("Error fetching batch:", err.message);
    res.status(500).json({ error: err.message });
  }
};


// ✅ Admin: Delete batch
export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required." });
    }

    const deletedBatch = await Batch.findByIdAndDelete(batchId);

    if (!deletedBatch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    res.status(200).json({ message: "Batch deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting batch", error: error.message });
  }
};

// ✅ Admin: Assign student to batch
export const assignStudentToBatch = async (req, res) => {
  const { studentId } = req.body;
  const { batchId } = req.params;  // ✅ Extract from URL path

  if (!batchId || !studentId) {
    return res.status(400).json({ message: "Batch ID and Student ID are required." });
  }

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: "Batch not found." });
    }

    if (batch.students.includes(studentId)) {
      return res.status(400).json({ message: "Student is already assigned to this batch." });
    }

    batch.students.push(studentId);
    await batch.save();

    // Update student's batch reference
    await Student.findByIdAndUpdate(studentId, { batch: batchId });

    res.status(200).json({ message: "Student assigned to batch successfully.", batch });
  } catch (error) {
    res.status(500).json({ message: "Error assigning student to batch", error: error.message });
  }
};

// ✅ Admin: Get batches by course
export const getBatchesByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required." });
    }

    const batches = await Batch.find({ courseId })
      .populate("teacherId")
      .populate("students");  // Populate students' data by course

    if (batches.length === 0) {
      return res.status(404).json({ message: "No batches found for this course." });
    }

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches by course", error: error.message });
  }
};

// ----------------------------------------------------
// 📘 TEACHER-SIDE CONTROLLERS 
// ----------------------------------------------------

// @desc   Get all batches assigned to the logged-in teacher
// @route  GET /api/teacher/batches
// @access Private (Teacher)
export const getBatchesForTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id;

    const batches = await Batch.find({ teacherId })
      .populate("courseId", "title topics")
      .populate("students", "name email");  // Ensure students are populated

    res.status(200).json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher batches", error: error.message });
  }
};

// @desc   Get details of a specific batch (by ID) assigned to the teacher
// @route  GET /api/teacher/batches/:batchId
// @access Private (Teacher)
export const getBatchDetailsByIdForTeacher = async (req, res) => {
  const { batchId } = req.params;
  const teacherId = req.user._id;

  try {
    const batch = await Batch.findOne({ _id: batchId, teacherId })
      .populate("students", "name email")
      .populate("courseId", "title topics")
      .populate("schedule");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found or unauthorized" });
    }

    res.status(200).json(batch);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batch details", error: error.message });
  }
};

// export const getBatchById = async (req, res) => {
//   try {
//     const batch = await Batch.findById(req.params.batchId);
//     if (!batch) {
//       return res.status(404).json({ message: "Batch not found." });
//     }
//     res.status(200).json(batch);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching batch", error: error.message });
//   }
// };
