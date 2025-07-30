import jwt from "jsonwebtoken";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";
import Admin from "../models/Admin.js";

/**
 * Authentication middleware to protect routes
 * Verifies JWT token and adds user data to request
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check cookies if not in header
    else if (req.cookies?.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user based on role from token
    let user;
    switch (decoded.role) {
      case 'student':
        user = await Student.findById(decoded.id).select('-password');
        break;
      case 'teacher':
        user = await Teacher.findById(decoded.id).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(401).json({
          success: false,
          message: "Invalid user role in token"
        });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: "Account is not active. Please contact admin."
      });
    }

    // Add role to user object for consistency
    user.role = decoded.role;
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed"
    });
  }
};

/**
 * For backward compatibility - same as protect
 */
export const authenticate = protect;

/**
 * Middleware to check if user has required role
 * @param {string|string[]} roles - Single role or array of roles
 */
export const authorize = (roles) => {
  // Convert to array if a single role is passed
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied. User role not found."
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.user.role} role not authorized.`
      });
    }

    next();
  };
};

/**
 * Student-specific authorization
 * Ensures the student can only access their own resources
 */
export const authorizeStudent = (req, res, next) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: "Access denied. This endpoint is for students only."
    });
  }

  // Only check for req.params.id if it's present
  if (req.params.id && req.user._id.toString() !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Students can only access their own data."
    });
  }

  next();
};

