import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
    // Check cookies if not in header - use 'authToken' to match the cookie name set in login
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

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

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
  if (req.user.role !== 'student' || req.user.id !== req.params.id) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Students can only access their own data."
    });
  }
  next();
};
