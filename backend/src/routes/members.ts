import express from 'express';
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMemberTitheHistory
} from '../controllers/memberController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all members (accessible to all authenticated users)
router.get('/', getMembers);

// Get single member
router.get('/:id', getMember);

// Get member's tithe history
router.get('/:id/tithe-history', getMemberTitheHistory);

// Create member (admin, accountant, pastor)
router.post('/', authorizeRole(['admin', 'accountant', 'pastor']), createMember);

// Update member (admin, accountant, pastor)
router.put('/:id', authorizeRole(['admin', 'accountant', 'pastor']), updateMember);

// Delete member (admin only)
router.delete('/:id', authorizeRole(['admin']), deleteMember);

export default router;
