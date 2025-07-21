import Student from "../models/Student.js";
import { validationResult } from "express-validator";

// GET student profile
export const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId).select("-password");
    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// UPDATE email/mobile only
export const updateContactDetails = async (req, res) => {
  try {
    const { email, mobile } = req.body;
    const studentId = req.user.id;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { email, mobile },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err });
  }
};

// UPLOAD profile pic
export const uploadProfilePicture = async (req, res) => {
  try {
    const studentId = req.user.id;
    const filePath = req.file?.path;

    if (!filePath) return res.status(400).json({ message: "No file uploaded" });

    const student = await Student.findByIdAndUpdate(
      studentId,
      { profilePic: filePath },
      { new: true }
    ).select("-password");

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error });
  }
};
