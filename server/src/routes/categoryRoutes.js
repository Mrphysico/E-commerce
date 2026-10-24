import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getCategories).post(protect, isAdmin, createCategory);
router
  .route('/:slug')
  .get(getCategoryBySlug)
  .put(protect, isAdmin, updateCategory)
  .delete(protect, isAdmin, deleteCategory);

export default router;
