import { Router } from 'express';
import {
  getExpenses,
  createExpense,
  getExpense,
  updateExpense,
  approveExpense,
  rejectExpense,
  deleteExpense
} from '../controllers/expenseController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getExpenses);
router.post('/', authorizeRole('admin', 'accountant'), createExpense);
router.get('/:id', getExpense);
router.put('/:id', authorizeRole('admin', 'accountant'), updateExpense);
router.put('/:id/approve', authorizeRole('admin', 'accountant'), approveExpense);
router.put('/:id/reject', authorizeRole('admin', 'accountant'), rejectExpense);
router.delete('/:id', authorizeRole('admin', 'accountant'), deleteExpense);

export default router;
