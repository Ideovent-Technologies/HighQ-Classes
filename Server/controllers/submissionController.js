import Submission from "../models/Submission.js";
import Assignment from "../models/Assignment.js";

// POST /api/submissions
// Student submits an assignment
export const submitAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId, fileUrl } = req.body;

    // Validate required fields
    if (!assignmentId || !studentId || !fileUrl) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if submission already exists (optional: prevent multiple submissions)
    const existing = await Submission.findOne({ assignment: assignmentId, student: studentId });
    if (existing) {
      return res.status(400).json({ message: "Submission already exists" });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: studentId,
      fileUrl,
    });

    await submission.save();

    res.status(201).json({ message: "Submission created", data: submission });
  } catch (error) {
    console.error("Submit assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/assignments/:assignmentId/submissions
// Teacher fetches all submissions for an assignment
export const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")  // populate student info (name, email)
      .populate("assignment", "title dueDate") // optional assignment info

    res.json({ submissions });
  } catch (error) {
    console.error("Get submissions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/submissions/:id/grade
// Teacher grades a submission
export const gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, status } = req.body;

    const submission = await Submission.findById(id);
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    if (grade !== undefined) submission.grade = grade;
    if (status) submission.status = status;

    await submission.save();

    res.json({ message: "Submission graded", data: submission });
  } catch (error) {
    console.error("Grade submission error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSubmissionsByTeacher = async (req, res) => {
  try {
    const teacherId = req.user._id; // from auth middleware

    // Find assignments created by this teacher
    const assignments = await Assignment.find({ teacher: teacherId }).select("_id");
    const assignmentIds = assignments.map(a => a._id);

    // Find all submissions for these assignments
    const submissions = await Submission.find({ assignment: { $in: assignmentIds } })
      .populate("student", "name email")
      .populate("assignment", "title dueDate");

    res.json({ submissions });
  } catch (error) {
    console.error("Get submissions by teacher error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
