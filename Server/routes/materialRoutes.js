import express from 'express';
import * as resourceController from '../controllers/materialController.js';
import * as authMiddleware from '../middleware/authMiddleware.js';
import { fileUpload } from '../middleware/fileUpload.js';

const router = express.Router();

router.post(
  '/upload',
  authMiddleware.protect,
  fileUpload, // <-- use this middleware directly, no .single()
  resourceController.uploadMaterial
);

router.get('/batch', authMiddleware.protect, resourceController.getMaterialsByBatch);

router.get('/', authMiddleware.protect, resourceController.getAllMaterials);

router.get('/search', authMiddleware.protect, resourceController.searchMaterials);

router.delete('/:materialId', authMiddleware.protect, resourceController.deleteMaterial);

export default router;
