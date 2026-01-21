import { Router } from 'express';
import {
  getReports,
  generateReport,
  getReport,
  getDashboard
} from '../controllers/reportController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/dashboard', getDashboard);
router.get('/', getReports);
router.post('/generate', authorizeRole('admin', 'accountant', 'pastor'), generateReport);
router.get('/:id', getReport);

export default router;
