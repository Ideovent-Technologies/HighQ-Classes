// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import Teacher from '../models/Teacher.js';

export const protectTeacher = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach teacher data to request
      req.user = await Teacher.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Teacher not found.' });
      }

      next();
    } catch (error) {
      console.error('Auth Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed.' });
    }
  } else {
    res.status(401).json({ message: 'No token, authorization denied.' });
  }
};
