import { dataStore } from '../utils/dataStore.js';

// @desc    Create new order with strict server-side validation and stock check
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod = 'COD',
      couponCode,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items provided' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.state ||
      !shippingAddress.postalCode ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide complete shipping address details',
      });
    }

    // Server-side recalculation and inventory verification
    let itemsPrice = 0;
    const verifiedOrderItems = [];

    for (const item of orderItems) {
      const productId = item.product._id || item.product;
      const product = await dataStore.getProductBySlugOrId(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.name || productId} is no longer available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient inventory for ${product.name}. Only ${product.stock} units remaining.`,
        });
      }

      const itemTotal = product.price * item.quantity;
      itemsPrice += itemTotal;

      verifiedOrderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
        price: product.price,
        quantity: item.quantity,
        sku: product.sku,
      });
    }

    // Shipping calculation: Free over ₹1,999
    const shippingPrice = itemsPrice > 1999 ? 0 : 99;

    // Coupon discount calculation
    let discountPrice = 0;
    let validatedCoupon = null;
    if (couponCode) {
      const coupon = await dataStore.getCouponByCode(couponCode);
      if (coupon && itemsPrice >= (coupon.minOrderAmount || 0)) {
        const calculatedDiscount = Math.round((itemsPrice * coupon.discountPercent) / 100);
        discountPrice = Math.min(calculatedDiscount, coupon.maxDiscount || calculatedDiscount);
        validatedCoupon = coupon.code;
      }
    }

    const totalPrice = Math.max(0, itemsPrice + shippingPrice - discountPrice);
    const orderNumber = 'TN-' + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      user: req.user._id,
      orderNumber,
      orderItems: verifiedOrderItems,
      shippingAddress: {
        ...shippingAddress,
        country: shippingAddress.country || 'India',
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      itemsPrice,
      shippingPrice,
      discountPrice,
      couponCode: validatedCoupon || '',
      totalPrice,
      orderStatus: 'Pending',
    };

    const order = await dataStore.createOrder(orderData);

    // Clear user cart upon successful order
    await dataStore.saveCartItems(req.user._id, []);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await dataStore.getOrdersByUserId(req.user._id);
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await dataStore.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization: must be order owner or admin
    if (
      req.user.role !== 'admin' &&
      order.user.toString() !== req.user._id.toString() &&
      order.user._id?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order',
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const result = await dataStore.getAllOrders({ page, limit, status });
    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updated = await dataStore.updateOrderStatus(req.params.id, status, note);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updated,
    });
  } catch (error) {
    next(error);
  }
};
