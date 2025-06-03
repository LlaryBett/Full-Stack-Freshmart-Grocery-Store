import express from 'express';
import { placeOrder, getUserOrders, getOrderById } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', placeOrder);
router.get('/user/:userId', getUserOrders);
router.get('/:id', getOrderById); // <-- already exists, returns order details by id

export default router;
