import expressFileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

/**
 * express-fileupload middleware with desired configuration
 */
export const fileUpload = expressFileUpload({
  createParentPath: true,            // auto-create folders
  limits: {
    fileSize: 100 * 1024 * 1024,     // 100MB max file size
    files: 5                         // max number of files per request
  },
  abortOnLimit: true,                // abort request on size limit
  useTempFiles: false,               // store files in memory
  debug: process.env.NODE_ENV === 'development',
  safeFileNames: true,               // sanitize file names
  preserveExtension: true            // keep original file extensions
});

/**
 * Middleware: Move uploaded profile picture to permanent folder and set req.profilePicPath
 */
export const moveProfilePicToUploads = (req, res, next) => {
  if (!req.files || !req.files.profilePic) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const uploadDir = path.join('uploads', 'profile_pics');

  // create folder if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const file = req.files.profilePic;
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  // Move file from memory buffer to disk
  file.mv(filePath, (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file' });
    }

    // Store relative path or absolute path as per your serving setup
    req.profilePicPath = filePath.replace(/\\/g, '/'); // fix for Windows slashes
    next();
  });
};
