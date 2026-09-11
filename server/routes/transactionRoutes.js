import express from 'express';
import {
  getMyTransactions,
  getTransactionById
} from '../controllers/transactionController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get active user's transactions
router.get('/my', authMiddleware, getMyTransactions);

// Get specific transaction details by ID
router.get('/:transactionId', authMiddleware, getTransactionById);

export default router;
