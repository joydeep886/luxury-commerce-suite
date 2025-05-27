
import { Router } from 'express';
import { createOrder, getUserOrders, getOrder } from '../controllers/orderController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', createOrder);
router.get('/', authenticateToken, getUserOrders);
router.get('/:id', authenticateToken, getOrder);

export default router;
