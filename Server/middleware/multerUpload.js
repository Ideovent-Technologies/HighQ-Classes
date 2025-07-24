import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

/**
 * Configuration for multer storage
 */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Create subdirectories based on file type
        let subDir = 'misc';

        if (file.mimetype.startsWith('image/')) {
            subDir = 'images';
        } else if (file.mimetype.startsWith('video/')) {
            subDir = 'videos';
        } else if (file.mimetype.startsWith('audio/')) {
            subDir = 'audio';
        } else if (file.mimetype.includes('pdf')) {
            subDir = 'documents';
        }

        const finalDir = path.join(uploadDir, subDir);
        if (!fs.existsSync(finalDir)) {
            fs.mkdirSync(finalDir, { recursive: true });
        }

        cb(null, finalDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename using timestamp and random string
        const randomString = crypto.randomBytes(8).toString('hex');
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}-${randomString}${extension}`;
        cb(null, filename);
    }
});

/**
 * File filter to validate allowed file types
 */
const fileFilter = (req, file, cb) => {
    // Define allowed MIME types
    const allowedMimeTypes = [
        // Images
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        // Documents
        'application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        // Videos
        'video/mp4', 'video/webm', 'video/quicktime',
        // Audio
        'audio/mpeg', 'audio/wav', 'audio/mp3',
        // Others
        'application/zip', 'application/x-zip-compressed'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
};

/**
 * Base multer configuration
 */
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100 MB
    }
});

/**
 * Middleware for profile pictures (single image)
 */
export const uploadProfilePicture = upload.single('profilePicture');

/**
 * Middleware for course materials (multiple files)
 */
export const uploadMaterials = upload.array('materials', 10); // Max 10 files

/**
 * Middleware for assignments (single file)
 */
export const uploadAssignment = upload.single('assignment');

/**
 * Middleware for recordings (single video file)
 * With custom file filter for video files only
 */
export const uploadRecording = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed for recordings'), false);
        }
    },
    limits: {
        fileSize: 500 * 1024 * 1024, // 500 MB for videos
    }
}).single('recording');

/**
 * Error handler for multer errors
 */
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific error
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'File is too large'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        // Other errors
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

export default {
    uploadProfilePicture,
    uploadMaterials,
    uploadAssignment,
    uploadRecording,
    handleMulterError
};
