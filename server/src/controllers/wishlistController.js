import { dataStore } from '../utils/dataStore.js';

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await dataStore.getWishlistByUserId(req.user._id);
    res.json({
      success: true,
      wishlist: wishlist.products || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle item in wishlist (Add/Remove)
// @route   POST /api/wishlist/toggle
// @access  Private
export const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const updated = await dataStore.toggleWishlistItem(req.user._id, productId);
    const isNowInWishlist = (updated.products || []).some(
      (p) => (p._id || p).toString() === productId.toString()
    );

    res.json({
      success: true,
      message: isNowInWishlist ? 'Added to wishlist' : 'Removed from wishlist',
      isWishlisted: isNowInWishlist,
      wishlist: updated.products || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Move wishlist product to cart
// @route   POST /api/wishlist/move-to-cart
// @access  Private
export const moveToCart = async (req, res, next) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Remove from wishlist
    await dataStore.toggleWishlistItem(req.user._id, productId);

    // Add to cart
    const product = await dataStore.getProductBySlugOrId(productId);
    if (!product || product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Product is currently unavailable or out of stock',
      });
    }

    const currentCart = await dataStore.getCartByUserId(req.user._id);
    const items = [...(currentCart.items || [])];
    const existingIdx = items.findIndex(
      (item) => (item.product._id || item.product).toString() === product._id.toString()
    );

    if (existingIdx > -1) {
      items[existingIdx].quantity += 1;
    } else {
      items.push({
        product: product._id,
        quantity: 1,
        price: product.price,
      });
    }

    await dataStore.saveCartItems(req.user._id, items);

    res.json({
      success: true,
      message: `${product.name} moved to cart`,
    });
  } catch (error) {
    next(error);
  }
};
