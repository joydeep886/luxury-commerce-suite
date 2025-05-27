
import { Router } from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { 
  getDashboardStats, 
  getOrderAnalytics, 
  getInventoryAlerts,
  updateProductStock,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  getCustomerDetails,
  updateCustomer,
  deleteCustomer,
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  getSystemSettings,
  updateSystemSettings,
  getSecurityLogs,
  getUserRoles,
  createUserRole,
  updateUserRole,
  deleteUserRole,
  getSalesAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  getInventoryStats,
  bulkUpdateProducts,
  processRefund,
  sendBulkEmail,
  getContentPages,
  updateContentPage,
  getMediaLibrary,
  uploadMedia,
  deleteMedia
} from '../controllers/adminController';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);
router.get('/analytics/orders', getOrderAnalytics);
router.get('/analytics/sales', getSalesAnalytics);
router.get('/analytics/customers', getCustomerAnalytics);
router.get('/analytics/products', getProductAnalytics);

// Product Management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);
router.put('/products/:productId/stock', updateProductStock);
router.put('/products/bulk-update', bulkUpdateProducts);

// Inventory Management
router.get('/inventory/alerts', getInventoryAlerts);
router.get('/inventory/stats', getInventoryStats);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:orderId/status', updateOrderStatus);
router.post('/orders/:orderId/refund', processRefund);

// Customer Management
router.get('/customers', getAllCustomers);
router.get('/customers/:customerId', getCustomerDetails);
router.put('/customers/:customerId', updateCustomer);
router.delete('/customers/:customerId', deleteCustomer);

// Coupon Management
router.get('/coupons', getAllCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:couponId', updateCoupon);
router.delete('/coupons/:couponId', deleteCoupon);

// Marketing
router.post('/marketing/bulk-email', sendBulkEmail);

// Content Management
router.get('/content/pages', getContentPages);
router.put('/content/pages/:pageId', updateContentPage);
router.get('/content/media', getMediaLibrary);
router.post('/content/media', uploadMedia);
router.delete('/content/media/:mediaId', deleteMedia);

// System Settings
router.get('/settings', getSystemSettings);
router.put('/settings', updateSystemSettings);

// Security & User Management
router.get('/security/logs', getSecurityLogs);
router.get('/security/roles', getUserRoles);
router.post('/security/roles', createUserRole);
router.put('/security/roles/:roleId', updateUserRole);
router.delete('/security/roles/:roleId', deleteUserRole);

export default router;
