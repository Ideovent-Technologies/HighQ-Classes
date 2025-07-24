import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token and protect routes
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Try to get token from cookies
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    }
    // 2. Or get it from Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 3. If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. No token found.',
      });
    }

    try {
      // 4. Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'highq-classes-secret-key'
      );

      // 5. Get user from DB
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists',
        });
      }

      // 6. Ensure account is active (optional)
      if (user.status && user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'Your account is not active',
        });
      }

      // 7. Attach minimal user info to request object
      req.user = {
        id: user._id.toString(), // always string for comparison
        email: user.email,
        name: user.name,
        role: user.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * Middleware to restrict access to specific roles
 * @param {...string} roles - allowed roles (e.g., "student", "admin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: 'User not found on request object.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

/**
 * Middleware: Only the student themselves can access their own resource
 */
export const authorizeStudent = (req, res, next) => {
  // important: compare strings to avoid mismatch between ObjectId and string
  if (
    req.user.role !== 'student' ||
    req.user.id.toString() !== req.params.id.toString()
  ) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};
