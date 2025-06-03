import express from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/:userId', getWishlist);
router.post('/:userId', addToWishlist);
router.delete('/:userId', removeFromWishlist);

export default router;
