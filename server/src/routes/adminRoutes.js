import express from 'express';
import { broadcastNotification } from '../controllers/adminController.js';
import {
  createPromoEvent,
  getPromoEvents,
  getPromoEvent,
  updatePromoEvent,
  deletePromoEvent
} from '../controllers/promoCodeController.js'; // updated import

const router = express.Router();

router.post('/broadcast', broadcastNotification);

// Promo Event CRUD routes
router.post('/promo-events', createPromoEvent);         // Create
router.get('/promo-events', getPromoEvents);            // Read all
router.get('/promo-events/:id', getPromoEvent);         // Read one
router.put('/promo-events/:id', updatePromoEvent);      // Update
router.delete('/promo-events/:id', deletePromoEvent);   // Delete

export default router;
