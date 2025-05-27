
import { Router } from 'express';
import { searchProducts, getProduct, getFeaturedProducts, getNewProducts } from '../controllers/productController';

const router = Router();

router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new', getNewProducts);
router.get('/:id', getProduct);

export default router;
