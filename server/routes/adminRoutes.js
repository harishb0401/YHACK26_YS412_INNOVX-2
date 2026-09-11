import express from 'express';
import {
  getDashboardStats,
  getCollectors,
  getRecyclers,
  getVerifications,
  verifyRecycler,
  rejectRecycler,
  cancelAbnormalOffer
} from '../controllers/adminController.js';
import { getAllTransactions } from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Enforce admin role on all /api/admin/* endpoints
router.use(authMiddleware, requireRole('admin'));

// Admin Dashboard stats
router.get('/dashboard', getDashboardStats);

// Collectors management list
router.get('/collectors', getCollectors);

// Recyclers management list
router.get('/recyclers', getRecyclers);

// Verification queue (pending recyclers & flagged pricing offers)
router.get('/verifications', getVerifications);

// Recycler approval
router.post('/recyclers/:id/verify', verifyRecycler);

// Recycler rejection
router.post('/recyclers/:id/reject', rejectRecycler);

// Global transactions oversight
router.get('/transactions', getAllTransactions);

// Cancel abnormal offer
router.post('/offers/:id/cancel', cancelAbnormalOffer);

export default router;
