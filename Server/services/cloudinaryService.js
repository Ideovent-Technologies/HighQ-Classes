// Server/services/cloudinaryService.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload buffer directly to Cloudinary
 * @param {Buffer} buffer 
 * @param {String} filename - Original file name (for extension detection)
 */
export const uploadBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        folder: 'materials',
        public_id: filename.split('.')[0] // Optional: name it after original file (without extension)
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

export const deleteFileFromCloudinary = async (fileUrl) => {
  const publicId = fileUrl.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(`materials/${publicId}`, { resource_type: 'auto' });
};
