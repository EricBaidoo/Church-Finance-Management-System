import express from 'express';
import {
  getPledges,
  getPledge,
  createPledge,
  updatePledge,
  deletePledge,
  recordPledgePayment,
  getPledgeSummary
} from '../controllers/pledgeController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get pledge summary
router.get('/summary', getPledgeSummary);

// Get all pledges
router.get('/', getPledges);

// Get single pledge
router.get('/:id', getPledge);

// Create pledge
router.post('/', authorizeRole(['admin', 'accountant', 'pastor']), createPledge);

// Record payment towards a pledge
router.post('/:id/payments', authorizeRole(['admin', 'accountant', 'pastor']), recordPledgePayment);

// Update pledge
router.put('/:id', authorizeRole(['admin', 'accountant', 'pastor']), updatePledge);

// Delete pledge (admin only)
router.delete('/:id', authorizeRole(['admin']), deletePledge);

export default router;
