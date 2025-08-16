import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

/**
 * Upload a file to Cloudinary
 * @param {Object} file Express file object
 * @param {String} folder Cloudinary folder name
 * @returns {Promise<Object>} Cloudinary response
 */
export const uploadToCloudinary = async (file, folder = 'general') => {
    try {
        // Create a temporary file path
        const tempFilePath = path.join(process.cwd(), 'temp', `${Date.now()}-${file.name}`);

        // Ensure the temp directory exists
        const tempDir = path.join(process.cwd(), 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Write the file buffer to a temporary file
        await writeFileAsync(tempFilePath, file.data);

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(tempFilePath, {
            resource_type: getResourceType(file.mimetype),
            folder,
            overwrite: false,
        });

        // Generate thumbnail URL for videos
        if (file.mimetype.startsWith('video/')) {
            result.thumbnail_url = cloudinary.url(result.public_id, {
                resource_type: 'video',
                transformation: [
                    { width: 300, crop: 'scale' },
                    { start_offset: '0', format: 'jpg' }
                ]
            });
        }

        // Delete the temporary file
        await unlinkAsync(tempFilePath);

        return result;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw new Error(`File upload failed: ${error.message}`);
    }
};

/**
 * Remove a file from Cloudinary
 * @param {String} publicId Cloudinary public ID
 * @returns {Promise<Object>} Cloudinary response
 */
export const removeFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error removing from Cloudinary:', error);
        throw new Error(`File deletion failed: ${error.message}`);
    }
};

/**
 * Get resource type based on MIME type
 * @param {String} mimetype File MIME type
 * @returns {String} Cloudinary resource type
 */
const getResourceType = (mimetype) => {
    if (mimetype.startsWith('image/')) {
        return 'image';
    } else if (mimetype.startsWith('video/')) {
        return 'video';
    } else {
        return 'raw'; //  FIXED: Always use 'raw' for PDFs, DOCX, etc.
    }
};


/**
 * Get file extension from MIME type
 * @param {String} mimetype File MIME type
 * @returns {String} File extension
 */
export const getFileExtension = (mimetype) => {
    const extensions = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'video/mp4': 'mp4',
        'video/webm': 'webm',
        'video/quicktime': 'mov',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/vnd.ms-excel': 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
        'application/vnd.ms-powerpoint': 'ppt',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
        'text/plain': 'txt'
    };

    return extensions[mimetype] || 'bin';
};

/**
 * Format file size in human-readable format
 * @param {Number} size File size in bytes
 * @returns {String} Formatted file size
 */
export const formatFileSize = (size) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
};