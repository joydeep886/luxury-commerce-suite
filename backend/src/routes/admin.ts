
import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { 
  getDashboardStats, 
  getOrderAnalytics, 
  getInventoryAlerts,
  updateProductStock 
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/orders', getOrderAnalytics);
router.get('/inventory/alerts', getInventoryAlerts);

// Product Management
router.put('/products/:productId/stock', updateProductStock);

export default router;
