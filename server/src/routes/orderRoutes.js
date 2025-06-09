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

const router = express.Router();

// Admin routes (place these first to avoid conflict with :id route)
router.get('/', getAllOrders); // Changed from /orders to / for getting all orders
router.put('/:id/status', updateOrderStatus); // Keep this for updating status

// User routes (place these after to avoid conflicts)
router.post('/', placeOrder);
router.get('/user/:userId', getUserOrders);
router.get('/:id', getOrderById);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

export default router;
