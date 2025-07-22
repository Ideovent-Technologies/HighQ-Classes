import expressFileUpload from 'express-fileupload';

/**
 * Middleware for handling file uploads
 * Configures express-fileupload with optimal settings
 */
export const fileUpload = expressFileUpload({
    createParentPath: true, // Create parent path if it doesn't exist
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB max file size
        files: 5 // Maximum number of files
    },
    abortOnLimit: true, // Return 413 if limit is reached
    useTempFiles: false, // Store files in memory
    debug: process.env.NODE_ENV === 'development',
    safeFileNames: true, // Remove special characters from file names
    preserveExtension: true // Preserve file extension
});