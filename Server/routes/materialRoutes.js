import express from 'express';
import * as materialController from '../controllers/materialController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = express.Router();

// Routes for teacher & admin
router.post(
    '/upload',
    protect,
    authorize('teacher', 'admin'),
    fileUpload,
    materialController.uploadMaterial
);

router.delete(
    '/:materialId',
    protect,
    authorize('teacher', 'admin'),
    materialController.deleteMaterial
);

// Routes for all roles
router.get('/search', protect, materialController.searchMaterials);
router.get('/', protect, authorize('teacher', 'admin'), materialController.getAllMaterials);
router.get('/batch', protect, authorize('student'), materialController.getMaterialsByBatch);

export default router;
