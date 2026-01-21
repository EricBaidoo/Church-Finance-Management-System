import { Router } from 'express';
import {
  getBudgets,
  createBudget,
  getBudget,
  updateBudget,
  deleteBudget
} from '../controllers/budgetController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getBudgets);
router.post('/', authorizeRole('admin', 'accountant'), createBudget);
router.get('/:id', getBudget);
router.put('/:id', authorizeRole('admin', 'accountant'), updateBudget);
router.delete('/:id', authorizeRole('admin', 'accountant'), deleteBudget);

export default router;
