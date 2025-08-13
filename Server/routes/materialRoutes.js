import express from 'express';
import {
  uploadMaterial,
  getMaterialsByBatch,
  getAllMaterials,
  searchMaterials,
  deleteMaterial,
  studentViewMaterial, //  NEW: Import view tracker
} from '../controllers/materialController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js'; //  Correct import

const router = express.Router();

/**
 * @route   POST /api/materials
 * @desc    Upload a new study material
 * @access  Private (Teachers only)
 */
router.post(
  '/',
  protect,
  authorize('teacher'),
  fileUpload, //  Use express-fileupload middleware
  uploadMaterial
);

/**
 * @route   GET /api/materials/student
 * @desc    Get materials assigned to logged-in student's batch
 * @access  Private (Students only)
 */
router.get(
  '/student',
  protect,
  authorize('student'),
  getMaterialsByBatch
);

/**
 * @route   GET /api/materials
 * @desc    Get all materials (for admin or teachers)
 * @access  Private (Admins, Teachers)
 */
router.get(
  '/',
  protect,
  authorize(['teacher', 'admin']),
  getAllMaterials
);

/**
 * @route   GET /api/materials/search
 * @desc    Search materials by title
 * @access  Private (All roles)
 */
router.get(
  '/search',
  protect,
  searchMaterials
);

/**
 * @route   DELETE /api/materials/:materialId
 * @desc    Delete a material by ID
 * @access  Private (Teachers or Admins)
 */
router.delete(
  '/:materialId',
  protect,
  // authorize('teacher', 'admin'),
  authorize(['teacher', 'admin']),
  deleteMaterial
);

/**
 *  NEW ROUTE
 * @route   POST /api/materials/view/:materialId
 * @desc    Track when a student views a material
 * @access  Private (Students only)
 */
router.post(
  '/view/:materialId',
  protect,
  authorize('student'),
  studentViewMaterial
);

export default router;
