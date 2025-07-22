import express from 'express';
import { logMaterialEngagement } from '../controllers/materialController.js';
import { authenticate, authorizeStudent } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/:materialId/engage', authenticate, authorizeStudent, logMaterialEngagement);
// ...other material routes

export default router;
