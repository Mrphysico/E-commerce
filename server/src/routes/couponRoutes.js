import express from 'express';
import {
  validateCoupon,
  getAllCoupons,
  createCoupon,
} from '../controllers/couponController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.route('/').get(protect, isAdmin, getAllCoupons).post(protect, isAdmin, createCoupon);

export default router;
