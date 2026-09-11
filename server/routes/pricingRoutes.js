import express from 'express';
import { validateQuote, getCategories } from '../controllers/pricingController.js';

const router = express.Router();

// Public / Semi-public quote validation helper
router.post('/validate-quote', validateQuote);

// Get structured e-waste category reference data
router.get('/categories', getCategories);

export default router;
