import { dataStore } from '../utils/dataStore.js';

// Helper to calculate totals based strictly on server-side product prices
const calculateCartTotals = async (items) => {
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await dataStore.getProductBySlugOrId(item.product._id || item.product);
    if (!product) continue;

    // Validate quantity against available stock
    const safeQuantity = Math.min(Math.max(1, item.quantity), product.stock);
    const itemTotal = product.price * safeQuantity;
    subtotal += itemTotal;

    verifiedItems.push({
      _id: item._id || 'item_' + Date.now().toString(16),
      product,
      quantity: safeQuantity,
      price: product.price,
      isOutOfStock: product.stock === 0,
      availableStock: product.stock,
      itemTotal,
    });
  }

  // Free shipping above ₹1,999, else ₹99
  const shipping = subtotal > 1999 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18); // 18% GST informative or included
  const total = subtotal + shipping;

  return {
    items: verifiedItems,
    subtotal,
    shipping,
    tax,
    total,
    totalItems: verifiedItems.reduce((acc, curr) => acc + curr.quantity, 0),
  };
};

// @desc    Get user cart with fresh server calculated totals
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await dataStore.getCartByUserId(req.user._id);
    const calculated = await calculateCartTotals(cart.items || []);

    res.json({
      success: true,
      ...calculated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await dataStore.getProductBySlugOrId(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'This item is currently out of stock' });
    }

    const currentCart = await dataStore.getCartByUserId(req.user._id);
    const items = [...(currentCart.items || [])];

    const existingIndex = items.findIndex(
      (item) => (item.product._id || item.product).toString() === product._id.toString()
    );

    if (existingIndex > -1) {
      const newQty = items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock`,
        });
      }
      items[existingIndex].quantity = newQty;
    } else {
      const initialQty = Math.min(Number(quantity), product.stock);
      items.push({
        product: product._id,
        quantity: initialQty,
        price: product.price,
      });
    }

    await dataStore.saveCartItems(req.user._id, items);
    const calculated = await calculateCartTotals(items);

    res.json({
      success: true,
      message: `${product.name} added to cart`,
      ...calculated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await dataStore.getProductBySlugOrId(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock`,
      });
    }

    const currentCart = await dataStore.getCartByUserId(req.user._id);
    let items = [...(currentCart.items || [])];

    if (Number(quantity) <= 0) {
      // Remove item
      items = items.filter(
        (item) => (item.product._id || item.product).toString() !== product._id.toString()
      );
    } else {
      const idx = items.findIndex(
        (item) => (item.product._id || item.product).toString() === product._id.toString()
      );
      if (idx > -1) {
        items[idx].quantity = Number(quantity);
      }
    }

    await dataStore.saveCartItems(req.user._id, items);
    const calculated = await calculateCartTotals(items);

    res.json({
      success: true,
      message: 'Cart updated',
      ...calculated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const currentCart = await dataStore.getCartByUserId(req.user._id);

    const items = (currentCart.items || []).filter(
      (item) => (item.product._id || item.product).toString() !== productId.toString()
    );

    await dataStore.saveCartItems(req.user._id, items);
    const calculated = await calculateCartTotals(items);

    res.json({
      success: true,
      message: 'Item removed from cart',
      ...calculated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    await dataStore.saveCartItems(req.user._id, []);
    res.json({
      success: true,
      message: 'Cart cleared',
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      totalItems: 0,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Recalculate guest cart totals without persisting
// @route   POST /api/cart/calculate
// @access  Public
export const calculateGuestCart = async (req, res, next) => {
  try {
    const { items = [] } = req.body;
    const calculated = await calculateCartTotals(items);
    res.json({
      success: true,
      ...calculated,
    });
  } catch (error) {
    next(error);
  }
};
