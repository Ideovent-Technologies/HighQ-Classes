import Material from '../models/Material.js';
// import { uploadMaterial } from '../services/cloudinaryService.js';
import mongoose from 'mongoose';


// Upload a new study material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, fileType, batchIds, courseId } = req.body;
    const uploader = req.user; // Auth middleware should add this

    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    // Upload to Cloudinary
    const uploadedFile = await cloudinary.uploadFile(req.file.path);

    const material = new Material({
      title,
      description,
      fileUrl: uploadedFile.secure_url,
      fileType,
      uploadedBy: uploader._id,
      batchIds: batchIds.map(id => new mongoose.Types.ObjectId(id)),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    await material.save();

    res.status(201).json({ message: 'Material uploaded successfully', material });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading material' });
  }
};

// Get materials for specific batch
export const getMaterialsByBatch = async (req, res) => {
  try {
    const studentBatchId = req.user.batch; // Assuming student
    const materials = await Material.find({
      batchIds: studentBatchId,
    })
      .populate('uploadedBy', 'name role')
      .populate('courseId', 'name')
      .sort({ createdAt: -1 });

    res.json(materials);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
};

// Get all materials (for admin or teachers)
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

// Search materials by title
export const searchMaterials = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i');

    const results = await Material.find({
      title: { $regex: searchRegex },
    }).sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
};

// Delete a material
export const deleteMaterial = async (req, res) => {
  try {
    const { materialId } = req.params;
    const deleted = await Material.findByIdAndDelete(materialId);

    if (!deleted) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Error deleting material' });
  }
};
