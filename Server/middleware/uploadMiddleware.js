// middleware/fileUpload.js
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

export const fileUploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

// Optional: Ensure upload directory exists
export const moveProfilePicToUploads = (req, res, next) => {
 if (!req.files || !req.files.profilePic) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadDir = path.join('uploads/profile_pics');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const file = req.files.profilePic;
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  file.mv(filePath, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    req.profilePicPath = filePath; // Store path for controller
    next();
  });
};
