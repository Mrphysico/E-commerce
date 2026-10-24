import { dataStore } from '../utils/dataStore.js';

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      inStock,
    } = req.query;

    const result = await dataStore.getProducts({
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
      inStock,
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug with related products
// @route   GET /api/products/:identifier
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await dataStore.getProductBySlugOrId(req.params.identifier);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Fetch related products in the same category
    const relatedResult = await dataStore.getProducts({
      category: product.categorySlug,
      limit: 5,
    });
    const related = (relatedResult.products || [])
      .filter((p) => p._id.toString() !== product._id.toString())
      .slice(0, 4);

    // Fetch reviews
    const reviews = await dataStore.getReviewsByProductId(product._id);

    res.json({
      success: true,
      product,
      related,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await dataStore.getFeaturedProducts(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get best-selling products
// @route   GET /api/products/bestsellers
// @access  Public
export const getBestSellers = async (req, res, next) => {
  try {
    const products = await dataStore.getBestSellers(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new arrival products
// @route   GET /api/products/new-arrivals
// @access  Public
export const getNewArrivals = async (req, res, next) => {
  try {
    const products = await dataStore.getNewArrivals(8);
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique brands
// @route   GET /api/products/brands
// @access  Public
export const getBrands = async (req, res, next) => {
  try {
    const allProductsResult = await dataStore.getProducts({ limit: 1000 });
    const brands = [
      ...new Set(allProductsResult.products.map((p) => p.brand).filter(Boolean)),
    ].sort();
    res.json({ success: true, brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      categorySlug,
      brand,
      price,
      originalPrice,
      discount = 0,
      images,
      stock = 0,
      sku,
      specifications = {},
      isFeatured = false,
      isNewArrival = true,
      isBestSeller = false,
    } = req.body;

    if (!name || !price || !brand || !categorySlug || !sku) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, brand, category, price, and SKU',
      });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const existingSku = await dataStore.getProducts({ limit: 1000 });
    if (existingSku.products.some((p) => p.sku === sku.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'A product with this SKU already exists',
      });
    }

    const product = await dataStore.createProduct({
      name,
      slug,
      description: description || 'High-performance electronics product from TechNova.',
      category: category || '65e01a010000000000000001',
      categorySlug,
      brand,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discount: Number(discount),
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'],
      stock: Number(stock),
      sku: sku.toUpperCase(),
      specifications: typeof specifications === 'object' ? specifications : {},
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isBestSeller: Boolean(isBestSeller),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:identifier
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.identifier || req.params.id;
    const updated = await dataStore.updateProduct(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:identifier
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.identifier || req.params.id;
    const deleted = await dataStore.deleteProduct(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, title } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both rating (1-5) and comment',
      });
    }

    const product = await dataStore.getProductBySlugOrId(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await dataStore.createReview({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      title: title || '',
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    if (error.message.includes('already submitted')) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
