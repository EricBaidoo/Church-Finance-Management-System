import { Router } from 'express';
import {
  getOfferingTypes,
  createOfferingType,
  getOfferingType,
  updateOfferingType,
  deleteOfferingType,
  getActiveOfferingTypes
} from '../controllers/offeringTypeController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

// Public endpoints
router.get('/active', getActiveOfferingTypes);

// Admin-only endpoints
router.get('/', authorizeRole('admin'), getOfferingTypes);
router.post('/', authorizeRole('admin'), createOfferingType);
router.get('/:id', authorizeRole('admin'), getOfferingType);
router.put('/:id', authorizeRole('admin'), updateOfferingType);
router.delete('/:id', authorizeRole('admin'), deleteOfferingType);

export default router;
