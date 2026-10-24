import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getBrands,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from '../controllers/productController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, isAdmin, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);
router.get('/brands', getBrands);
router
  .route('/:identifier')
  .get(getProductById)
  .put(protect, isAdmin, updateProduct)
  .delete(protect, isAdmin, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

export default router;
