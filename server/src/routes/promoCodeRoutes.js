import express from 'express';
import { validatePromoCode, subscribePromo } from '../controllers/promoCodeController.js';

const router = express.Router();

// POST /api/promo/validate
router.post('/validate', validatePromoCode);

// POST /api/promo/subscribe
router.post('/subscribe', subscribePromo);

export default router;
