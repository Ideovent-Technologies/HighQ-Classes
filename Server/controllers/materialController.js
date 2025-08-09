// controllers/materialController.js
import Material from '../models/Material.js';
import mongoose from 'mongoose';
import configureCloudinary from '../config/cloudinary.js';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import path from 'path';

// Initialize Cloudinary configuration
configureCloudinary();

// ---------------------------
// 📁 Upload New Material
// ---------------------------
/**
 * @desc    Upload a new study material
 * @route   POST /api/materials
 * @access  Private (Teacher only)
 */
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, fileType, batchIds, courseId } = req.body;
    const uploader = req.user;
    const file = req.files?.file;
    if (!file) return res.status(400).json({ message: 'File is required' });

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const resourceType = file.mimetype === 'application/pdf' ? 'raw' : 'auto';
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: 'materials',
            public_id: `${Date.now()}_${path.parse(file.name).name}`,
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(file.data).pipe(stream);
      });
    };

    const uploadedFile = await streamUpload();

    let batchIdsArray = [];
    try {
      batchIdsArray = Array.isArray(batchIds) ? batchIds : JSON.parse(batchIds);
    } catch {
      return res.status(400).json({ message: 'Invalid batchIds format' });
    }

    const material = new Material({
      title,
      description,
      fileUrl: uploadedFile.secure_url,
      fileType: file.mimetype,
      originalFileName: file.name,
      uploadedBy: uploader.id,
      batchIds: batchIdsArray.map(id => new mongoose.Types.ObjectId(id)),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    await material.save();
    return res.status(201).json({ message: 'Material uploaded successfully', material });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ message: 'Error uploading material' });
  }
};

// ---------------------------
// 📥 Student Access - Get by Batch
// ---------------------------
/**
 * @desc    Student fetches materials assigned to their batch
 * @route   GET /api/materials/batch
 * @access  Private (Student only)
 */
export const getMaterialsByBatch = async (req, res) => {
  try {
    const studentBatchId = req.user.batch;
    const materials = await Material.find({ batchIds: studentBatchId })
      .populate('uploadedBy', 'name role')
      .populate('courseId', 'name')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
};

// ---------------------------
// 🔍 Search Materials by Title
// ---------------------------
/**
 * @desc    Search study materials by title (partial match)
 * @route   GET /api/materials/search?query=some-text
 * @access  Private (All roles)
 */
export const searchMaterials = async (req, res) => {
  try {
    const { query } = req.query;
    const user = req.user;
    if (!query || query.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query, 'i');
    let filter = { title: { $regex: searchRegex } };
    if (user.role === 'student') filter.batchIds = user.batch;

    const results = await Material.find(filter)
      .populate('uploadedBy', 'name')
      .populate('courseId', 'name')
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// ---------------------------
// 📚 Get All Materials (Admin/Teacher)
// ---------------------------
/**
 * @desc    Fetch all materials (for Admin or Teacher dashboards)
 * @route   GET /api/materials
 * @access  Private (Admin, Teacher)
 */
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate('uploadedBy', 'name role')
      .populate('batchIds', 'name')
      .populate('courseId', 'name')
      .sort({ createdAt: -1 });
    res.json(materials);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching all materials' });
  }
};

// ---------------------------
// ❌ Delete Material
// ---------------------------
/**
 * @desc    Delete a material by ID
 * @route   DELETE /api/materials/:materialId
 * @access  Private (Admin/Teacher only)
 */
export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const deleted = await Material.findByIdAndDelete(materialId);
    if (!deleted) return res.status(404).json({ message: 'Material not found' });
    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting material' });
  }
};

// ---------------------------
// 👀 Track Material Views by Students
// ---------------------------
/**
 * @desc    Track when a student views a material
 * @route   POST /api/materials/view/:materialId
 * @access  Private (Student only)
 */
export const studentViewMaterial = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { materialId } = req.params;
    const material = await Material.findById(materialId);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const alreadyViewed = material.viewedBy.some(
      view => view.user.toString() === studentId.toString()
    );
    if (!alreadyViewed) {
      material.viewedBy.push({ user: studentId, viewedAt: new Date() });
      await material.save();
    }

    res.json({ message: 'Material view recorded', materialId });
  } catch (error) {
    console.error('View tracking error:', error);
    res.status(500).json({ message: 'Error recording view' });
  }
};
