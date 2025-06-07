import express from 'express';
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  updateOrder
} from '../controllers/orderController.js';
// import { requireAdmin } from '../middleware/auth.js'; // Uncomment if you have admin middleware

const router = express.Router();

// User routes
router.post('/orders', placeOrder);
router.get('/orders/user/:userId', getUserOrders);
router.get('/orders/:id', getOrderById);

// Admin routes
router.get('/orders', /* requireAdmin, */ getAllOrders);
router.put('/orders/:id/status', /* requireAdmin, */ updateOrderStatus);
router.put('/orders/:id', /* requireAdmin, */ updateOrder);
router.delete('/orders/:id', /* requireAdmin, */ deleteOrder);

export default router;
