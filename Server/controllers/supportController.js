// controllers/supportController.js
import SupportTicket from "../models/SupportTicket.js";
import configureCloudinary from "../config/cloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// ✅ Configure Cloudinary (if environment variables exist)
try {
  configureCloudinary();
} catch (e) {
  console.warn("Cloudinary not configured:", e.message);
}

// @desc Create a support ticket
// @route POST /api/support
// @access Private
export const createSupportTicket = async (req, res) => {
  try {
    const user = req.user; // set by auth middleware
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    let fileUrl = undefined;
    let fileName = undefined;

    // ✅ Handle file upload if provided
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
          folder: "support_tickets",
        });
        fileUrl = uploadResult.secure_url;
        fileName = req.file.originalname;

        // Remove local file
        fs.unlink(req.file.path, () => {});
      } else {
        // Store locally
        fileUrl = `/uploads/${req.file.filename}`;
        fileName = req.file.originalname;
      }
    } else if (req.body.fileUrl) {
      // Client provided a file URL (already uploaded)
      fileUrl = req.body.fileUrl;
      fileName = req.body.fileName || "";
    }

    // ✅ Save ticket in database
    const ticket = await SupportTicket.create({
      userId: user._id,
      name: user.name || req.body.name || "Unknown",
      email: user.email || req.body.email,
      role: user.role || req.body.role || "other",
      subject,
      message,
      fileUrl,
      fileName,
    });

    res.status(201).json({
      success: true,
      message: "Support ticket created successfully",
      data: ticket,
    });
  } catch (err) {
    console.error("Error creating support ticket:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Server error",
    });
  }
};
