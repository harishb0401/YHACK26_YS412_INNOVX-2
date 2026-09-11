import express from 'express';
import {
  getRecyclerDashboard,
  getRecyclerProfile,
  updateRecyclerProfile
} from '../controllers/recyclerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Recycler Dashboard stats
router.get(
  '/dashboard',
  authMiddleware,
  requireRole('recycler'),
  getRecyclerDashboard
);

// Recycler profile get
router.get(
  '/profile',
  authMiddleware,
  requireRole('recycler'),
  getRecyclerProfile
);

// Recycler profile update
router.put(
  '/profile',
  authMiddleware,
  requireRole('recycler'),
  updateRecyclerProfile
);

export default router;
