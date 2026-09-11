import express from 'express';
import {
  createOffer,
  getMyOffers,
  acceptOffer
} from '../controllers/offerController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validationMiddleware.js';
import { createOfferValidationRules } from '../validators/offerValidator.js';

const router = express.Router();

// Recycler submits an offer
router.post(
  '/',
  authMiddleware,
  requireRole('recycler'),
  createOfferValidationRules,
  validateRequest,
  createOffer
);

// Recycler retrieves their submitted offers
router.get(
  '/my',
  authMiddleware,
  requireRole('recycler'),
  getMyOffers
);

// Collector accepts an offer (Atomic transaction & Escrow Lock)
router.post(
  '/:offerId/accept',
  authMiddleware,
  requireRole('collector', 'admin'),
  acceptOffer
);

export default router;
