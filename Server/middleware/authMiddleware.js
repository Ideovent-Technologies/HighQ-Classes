// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Auth token missing" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Only the student can access their profile
export const authorizeStudent = (req, res, next) => {
  if (req.user.role !== 'student' || req.user.id !== req.params.id) {
    return res.status(403).json({ error: "Access denied" });
  }
  next();
};
