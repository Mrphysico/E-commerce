import { dataStore } from '../utils/dataStore.js';

// @desc    Validate coupon code and return discount amount
// @route   POST /api/coupons/validate
// @access  Public / Private
export const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Please provide a coupon code' });
    }

    const coupon = await dataStore.getCouponByCode(code.trim().toUpperCase());

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code or promotion has expired',
      });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired',
      });
    }

    if (orderAmount < (coupon.minOrderAmount || 0)) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum order of ₹${coupon.minOrderAmount}`,
      });
    }

    const rawDiscount = Math.round((Number(orderAmount) * coupon.discountPercent) / 100);
    const discount = Math.min(rawDiscount, coupon.maxDiscount || rawDiscount);

    res.json({
      success: true,
      valid: true,
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      maxDiscount: coupon.maxDiscount,
      discountAmount: discount,
      message: `${coupon.discountPercent}% discount applied!`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Private/Admin
export const getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await dataStore.getAllCoupons();
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = async (req, res, next) => {
  try {
    const { code, discountPercent, maxDiscount, minOrderAmount, expiresAt } = req.body;

    if (!code || !discountPercent) {
      return res.status(400).json({
        success: false,
        message: 'Please provide coupon code and discount percentage',
      });
    }

    const coupon = await dataStore.createCoupon({
      code: code.toUpperCase(),
      discountPercent: Number(discountPercent),
      maxDiscount: maxDiscount ? Number(maxDiscount) : 5000,
      minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
      expiresAt: expiresAt ? new Date(expiresAt) : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error) {
    next(error);
  }
};
