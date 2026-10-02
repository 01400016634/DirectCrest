import express from 'express';
import { getMyOrders, getOrderById, updateOrderStatus, createOrder } from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route for creating orders
router.post('/', createOrder);

router.use(protect);

router.get('/', getMyOrders);
router.get('/:id', getOrderById);

// Order status can only be updated by specific roles
router.put('/:id/status', authorize('ORDER_MANAGER', 'ADMIN', 'SUPER_ADMIN'), updateOrderStatus);

export default router;
