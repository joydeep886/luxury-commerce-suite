
import { Router } from 'express';
import { 
  updateProfile, 
  getUserAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.put('/profile', authenticateToken, updateProfile);
router.get('/addresses', authenticateToken, getUserAddresses);
router.post('/addresses', authenticateToken, addAddress);
router.put('/addresses/:id', authenticateToken, updateAddress);
router.delete('/addresses/:id', authenticateToken, deleteAddress);
router.get('/wishlist', authenticateToken, getWishlist);
router.post('/wishlist', authenticateToken, addToWishlist);
router.delete('/wishlist/:productId', authenticateToken, removeFromWishlist);

export default router;
