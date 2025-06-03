import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/userController.js';

const router = express.Router();

router.post('/:userId/wishlist', addToWishlist);
router.delete('/:userId/wishlist/:productId', removeFromWishlist);
router.get('/:userId/wishlist', getWishlist);

export default router;
