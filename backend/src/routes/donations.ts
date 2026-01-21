import { Router } from 'express';
import {
  getDonations,
  createDonation,
  getDonation,
  updateDonation,
  deleteDonation
} from '../controllers/donationController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getDonations);
router.post('/', authorizeRole('admin', 'accountant'), createDonation);
router.get('/:id', getDonation);
router.put('/:id', authorizeRole('admin', 'accountant'), updateDonation);
router.delete('/:id', authorizeRole('admin', 'accountant'), deleteDonation);

export default router;
