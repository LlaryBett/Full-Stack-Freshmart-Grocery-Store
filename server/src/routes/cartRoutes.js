import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.put('/:userId/:productId', updateCartItem);
router.delete('/:userId', removeFromCart);
router.delete('/:userId/clear', clearCart);

export default router;
