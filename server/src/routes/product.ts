import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  publishProduct, 
  unpublishProduct,
  addMedia,
  addVariant,
  parseSearchQuery
} from '../controllers/product.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/parse-query', parseSearchQuery);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected Admin/Manager routes
const productManagerRoles = ['ADMIN', 'SUPER_ADMIN', 'PRODUCT_MANAGER'];

router.post('/', protect, authorize(...productManagerRoles), createProduct);
router.put('/:id', protect, authorize(...productManagerRoles), updateProduct);
router.delete('/:id', protect, authorize(...productManagerRoles), deleteProduct);

// Status management
router.patch('/:id/publish', protect, authorize(...productManagerRoles), publishProduct);
router.patch('/:id/unpublish', protect, authorize(...productManagerRoles), unpublishProduct);

// Media & Variants
router.post('/:id/media', protect, authorize(...productManagerRoles), addMedia);
router.post('/:id/variants', protect, authorize(...productManagerRoles), addVariant);

export default router;
