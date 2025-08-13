// Server/controllers/batchController.js
import Batch from "../models/Batch.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";
import Teacher from "../models/Teacher.js";

//  Admin: Create a new batch
export const CreateBatch = async (req, res) => {
  const { name, courseId, teacherId, students = [], schedule, startDate, endDate } = req.body;
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
    if (students.length > 0) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $set: { batch: savedBatch._id } }
      );
    }

    // Sync Course.batches (embedded) and Teacher arrays
    await Promise.all([
      // 1) Push batch info into Course.batches (embedded subdocs)
      Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: {
            batches: {
              name: savedBatch.name,
              startDate: savedBatch.startDate,
              teacher: savedBatch.teacherId
            }
          }
        },
        { new: true }
      ),

      // 2) Add batch id to Teacher.batches and courseId to Teacher.courseIds
      Teacher.findByIdAndUpdate(
        teacherId,
        {
          $addToSet: {
            batches: savedBatch._id,
            courseIds: savedBatch.courseId
          }
        },
        { new: true }
      )
    ]);

    res.status(201).json(savedBatch);
  } catch (error) {
    console.error("CreateBatch error:", error);
    res.status(500).json({ message: "Error creating batch", error: error.message });
  }
};

//  Admin: Get all batches
export const GetAllBatch = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate("courseId")
      .populate("teacherId")
      .populate("students");  // Populate students' data
    res.status(200).json(batches);
  } catch (error) {
    console.error("GetAllBatch error:", error);
    res.status(500).json({ message: "Error fetching batches", error: error.message });
  }
};

//  Admin: Update batch
export const UpdateBatch = async (req, res) => {
  try {
    const { batchId } = req.params;
    const updateData = req.body;

    if (!batchId) {
      return res.status(400).json({ message: "Batch ID is required." });
    }

    // Fetch old batch to compare changes
    const oldBatch = await Batch.findById(batchId).lean();
    if (!oldBatch) return res.status(404).json({ message: "Batch not found." });

    const oldCourseId = oldBatch.courseId ? oldBatch.courseId.toString() : null;
    const oldTeacherId = oldBatch.teacherId ? oldBatch.teacherId.toString() : null;
    const oldName = oldBatch.name;
    const oldStartDate = oldBatch.startDate;
    const oldStudents = Array.isArray(oldBatch.students) ? oldBatch.students.map(String) : [];

    // Update the batch
    const updatedBatch = await Batch.findByIdAndUpdate(batchId, updateData, { new: true })
      .populate("courseId")
      .populate("teacherId")
      .populate("students");

    if (!updatedBatch) {
      return res.status(404).json({ message: "Batch not found after update." });
    }

    const newCourseId = updatedBatch.courseId ? updatedBatch.courseId._id.toString() : null;
    const newTeacherId = updatedBatch.teacherId ? updatedBatch.teacherId._id.toString() : null;
    const newName = updatedBatch.name;
    const newStartDate = updatedBatch.startDate;
    const newStudents = Array.isArray(updatedBatch.students) ? updatedBatch.students.map(s => s._id.toString()) : [];

    // 1) Sync Course.batches: remove old embedded entry (if any) and add updated
    try {
      if (oldCourseId) {
        await Course.updateOne(
          { _id: oldCourseId },
          { $pull: { batches: { name: oldName, startDate: oldStartDate } } }
        );
      }

      if (newCourseId) {
        await Course.findByIdAndUpdate(
          newCourseId,
          {
            $addToSet: {
              batches: {
                name: newName,
                startDate: newStartDate,
                teacher: updatedBatch.teacherId
              }
            }
          },
          { new: true }
        );
      }
    } catch (err) {
      console.error("Course sync error:", err);
      // continue — do not block main update
    }

    // 2) Sync Teacher arrays (batches and courseIds)
    try {
      // If teacher changed, remove batchId from old teacher and add to new teacher
      if (oldTeacherId && oldTeacherId !== newTeacherId) {
        await Teacher.findByIdAndUpdate(oldTeacherId, { $pull: { batches: updatedBatch._id } });
      }

      if (newTeacherId) {
        await Teacher.findByIdAndUpdate(
          newTeacherId,
          {
            $addToSet: {
              batches: updatedBatch._id,
              courseIds: updatedBatch.courseId ? updatedBatch.courseId._id : null
            }
          },
          { new: true }
        );
      } else if (oldTeacherId && oldTeacherId === newTeacherId) {
        // same teacher - ensure courseId exists in their courseIds
        if (newCourseId) {
          await Teacher.findByIdAndUpdate(oldTeacherId, { $addToSet: { courseIds: updatedBatch.courseId._id } });
        }
      }
    } catch (err) {
      console.error("Teacher sync error:", err);
    }

    // 3) Sync students' batch references: set batch for newly added students, unset for removed students
    try {
      // Compute removed students
      const removedStudents = oldStudents.filter(s => !newStudents.includes(s));
      const addedStudents = newStudents.filter(s => !oldStudents.includes(s));

      if (removedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: removedStudents } },
          { $unset: { batch: "" } }
        );
      }

      if (addedStudents.length > 0) {
        await Student.updateMany(
          { _id: { $in: addedStudents } },
          { $set: { batch: updatedBatch._id } }
        );
      }
    } catch (err) {
      console.error("Student sync error:", err);
    }

    res.status(200).json(updatedBatch);
  } catch (error) {
    console.error("UpdateBatch error:", error);
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

//  Admin: Delete batch
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

    // Cleanup: remove references from course and teacher and unset student.batch
    try {
      // remove embedded batch from course
      if (deletedBatch.courseId) {
        await Course.updateOne(
          { _id: deletedBatch.courseId },
          { $pull: { batches: { name: deletedBatch.name, startDate: deletedBatch.startDate } } }
        );
      }
      // remove batch id from teacher
      if (deletedBatch.teacherId) {
        await Teacher.updateOne(
          { _id: deletedBatch.teacherId },
          { $pull: { batches: deletedBatch._id } }
        );
      }
      // unset students' batch
      if (Array.isArray(deletedBatch.students) && deletedBatch.students.length > 0) {
        await Student.updateMany(
          { _id: { $in: deletedBatch.students } },
          { $unset: { batch: "" } }
        );
      }
    } catch (cleanupErr) {
      console.error("Cleanup after delete error:", cleanupErr);
    }

    res.status(200).json({ message: "Batch deleted successfully." });
  } catch (error) {
    console.error("deleteBatch error:", error);
    res.status(500).json({ message: "Error deleting batch", error: error.message });
  }
};

//  Admin: Assign student to batch
export const assignStudentToBatch = async (req, res) => {
  const { studentId } = req.body;
  const { batchId } = req.params;  //  Extract from URL path

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
    console.error("assignStudentToBatch error:", error);
    res.status(500).json({ message: "Error assigning student to batch", error: error.message });
  }
};

//  Admin: Get batches by course
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
    console.error("getBatchesByCourse error:", error);
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
      .populate("courseId", "name topics")
      .populate("students", "name email");  // Ensure students are populated

    res.status(200).json(batches);
  } catch (error) {
    console.error("getBatchesForTeacher error:", error);
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
      .populate("courseId", "name topics")
      .populate("schedule");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found or unauthorized" });
    }

    res.status(200).json(batch);
  } catch (error) {
    console.error("getBatchDetailsByIdForTeacher error:", error);
    res.status(500).json({ message: "Error fetching batch details", error: error.message });
  }
};
