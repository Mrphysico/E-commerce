import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialCoupons } from './seedData.js';
import { getDbStatus } from '../config/db.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Cart from '../models/Cart.js';
import Wishlist from '../models/Wishlist.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import ContactMessage from '../models/ContactMessage.js';

// In-memory fallback data store for standalone/offline mode
const memoryStore = {
  users: [],
  categories: JSON.parse(JSON.stringify(initialCategories)),
  products: JSON.parse(JSON.stringify(initialProducts)),
  coupons: JSON.parse(JSON.stringify(initialCoupons)),
  carts: {}, // userId -> { items: [] }
  wishlists: {}, // userId -> [productId]
  orders: [],
  reviews: [
    {
      _id: '65e04a010000000000000001',
      product: '65e02a010000000000000001',
      user: '65e00a010000000000000002',
      userName: 'Rahul Sharma',
      rating: 5,
      title: 'Flawless engineering and display',
      comment: 'The OLED display on this AeroBook is breathtaking. Compiling code is lightning fast and thermal performance is whisper quiet even under heavy load.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      _id: '65e04a010000000000000002',
      product: '65e02a010000000000000009',
      user: '65e00a010000000000000002',
      userName: 'Rahul Sharma',
      rating: 5,
      title: 'Best typing experience I have had',
      comment: 'The factory lubrication on switches is buttery smooth. Gasket mount makes every keystroke feel deep and satisfying. Worth every rupee.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      _id: '65e04a010000000000000003',
      product: '65e02a010000000000000011',
      user: '65e00a010000000000000002',
      userName: 'Rahul Sharma',
      rating: 5,
      title: 'Audiophile grade sound with top notch ANC',
      comment: 'Battery life easily lasts me a week of work. The noise cancellation completely silences metro commute. Highly recommended!',
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    },
  ],
  contactMessages: [],
};

// Initialize default users in memory store
(async () => {
  const adminSalt = await bcrypt.genSalt(10);
  const adminHashed = await bcrypt.hash('Admin@12345', adminSalt);
  
  const customerSalt = await bcrypt.genSalt(10);
  const customerHashed = await bcrypt.hash('Customer@12345', customerSalt);

  memoryStore.users = [
    {
      _id: '65e00a010000000000000001',
      name: 'TechNova Administrator',
      email: 'admin@technova.com',
      password: adminHashed,
      role: 'admin',
      phone: '+91 98765 43210',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      addresses: [
        {
          _id: '65e00b010000000000000001',
          street: 'TechNova HQ, Cyber City Phase 2',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true,
        },
      ],
      createdAt: new Date(),
    },
    {
      _id: '65e00a010000000000000002',
      name: 'Rahul Sharma',
      email: 'customer@technova.com',
      password: customerHashed,
      role: 'user',
      phone: '+91 98123 45678',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      addresses: [
        {
          _id: '65e00b010000000000000002',
          street: 'Flat 402, Skyline Residency, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true,
        },
      ],
      createdAt: new Date(),
    },
  ];

  // Pre-populate sample order in memory
  memoryStore.orders.push({
    _id: '65e05a010000000000000001',
    user: '65e00a010000000000000002',
    orderNumber: 'TN-984210',
    orderItems: [
      {
        product: '65e02a010000000000000009',
        name: 'CyberStrike Pro Wireless Mechanical Keyboard',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        price: 8999,
        quantity: 1,
        sku: 'KBD-CS-PRO75',
      },
    ],
    shippingAddress: {
      name: 'Rahul Sharma',
      email: 'customer@technova.com',
      phone: '+91 98123 45678',
      street: 'Flat 402, Skyline Residency, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
    },
    paymentMethod: 'COD',
    paymentStatus: 'Pending',
    itemsPrice: 8999,
    shippingPrice: 0,
    discountPrice: 899.9,
    couponCode: 'TECHNOVA10',
    totalPrice: 8099.1,
    orderStatus: 'Shipped',
    statusHistory: [
      { status: 'Pending', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Order placed' },
      { status: 'Processing', timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), note: 'Packed at Bengaluru Warehouse' },
      { status: 'Shipped', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), note: 'Handed over to Express Courier (Tracking: TN-EXP-7721)' },
    ],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  });
})();

export const dataStore = {
  isMongoActive: () => getDbStatus(),
  rawMemory: memoryStore,

  // User methods
  findUserByEmail: async (email) => {
    if (getDbStatus()) {
      return await User.findOne({ email: email.toLowerCase() }).select('+password');
    }
    return memoryStore.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  findUserById: async (id) => {
    if (getDbStatus()) {
      return await User.findById(id).select('-password');
    }
    const user = memoryStore.users.find((u) => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  },

  createUser: async (userData) => {
    if (getDbStatus()) {
      const user = await User.create(userData);
      return user;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = {
      _id: 'usr_' + Date.now().toString(16),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      role: userData.role || 'user',
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      addresses: userData.addresses || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.users.push(newUser);
    return newUser;
  },

  updateUser: async (id, updateData) => {
    if (getDbStatus()) {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    }
    const index = memoryStore.users.findIndex((u) => u._id.toString() === id.toString());
    if (index === -1) return null;
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    memoryStore.users[index] = { ...memoryStore.users[index], ...updateData, updatedAt: new Date() };
    const { password, ...rest } = memoryStore.users[index];
    return rest;
  },

  getAllUsers: async () => {
    if (getDbStatus()) {
      return await User.find({}).select('-password').sort({ createdAt: -1 });
    }
    return memoryStore.users.map(({ password, ...rest }) => rest);
  },

  // Category methods
  getCategories: async () => {
    if (getDbStatus()) {
      return await Category.find({}).sort({ name: 1 });
    }
    return memoryStore.categories;
  },

  getCategoryBySlug: async (slug) => {
    if (getDbStatus()) {
      return await Category.findOne({ slug });
    }
    return memoryStore.categories.find((c) => c.slug === slug) || null;
  },

  createCategory: async (categoryData) => {
    if (getDbStatus()) {
      return await Category.create(categoryData);
    }
    const newCategory = {
      _id: 'cat_' + Date.now().toString(16),
      ...categoryData,
      createdAt: new Date(),
    };
    memoryStore.categories.push(newCategory);
    return newCategory;
  },

  updateCategory: async (id, categoryData) => {
    if (getDbStatus()) {
      return await Category.findByIdAndUpdate(id, categoryData, { new: true });
    }
    const idx = memoryStore.categories.findIndex((c) => c._id.toString() === id.toString());
    if (idx === -1) return null;
    memoryStore.categories[idx] = { ...memoryStore.categories[idx], ...categoryData };
    return memoryStore.categories[idx];
  },

  deleteCategory: async (id) => {
    if (getDbStatus()) {
      return await Category.findByIdAndDelete(id);
    }
    const idx = memoryStore.categories.findIndex((c) => c._id.toString() === id.toString());
    if (idx === -1) return null;
    const deleted = memoryStore.categories.splice(idx, 1);
    return deleted[0];
  },

  // Product methods
  getProducts: async ({ search, category, brand, minPrice, maxPrice, sort, page = 1, limit = 12, inStock }) => {
    if (getDbStatus()) {
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (category && category !== 'all') {
        query.categorySlug = category;
      }
      if (brand && brand !== 'all') {
        query.brand = brand;
      }
      if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) query.price.$gte = Number(minPrice);
        if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
      }
      if (inStock === 'true' || inStock === true) {
        query.stock = { $gt: 0 };
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'price-low') sortOption = { price: 1 };
      else if (sort === 'price-high') sortOption = { price: -1 };
      else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
      else if (sort === 'newest') sortOption = { createdAt: -1 };
      else if (sort === 'popularity') sortOption = { 'ratings.count': -1 };

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Product.countDocuments(query);
      const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

      return {
        products,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)) || 1,
        total,
      };
    }

    // Memory Store filtering
    let filtered = [...memoryStore.products];

    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.brand.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s)
      );
    }
    if (category && category !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === category);
    }
    if (brand && brand !== 'all') {
      filtered = filtered.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    if (inStock === 'true' || inStock === true) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
    } else if (sort === 'popularity') {
      filtered.sort((a, b) => (b.ratings?.count || 0) - (a.ratings?.count || 0));
    } else {
      // newest
      filtered.sort((a, b) => (b._id > a._id ? 1 : -1));
    }

    const total = filtered.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(skip, skip + Number(limit));

    return {
      products: paginated,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      total,
    };
  },

  getProductBySlugOrId: async (identifier) => {
    if (getDbStatus()) {
      let product = null;
      if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(identifier);
      }
      if (!product) {
        product = await Product.findOne({ slug: identifier });
      }
      return product;
    }
    return (
      memoryStore.products.find(
        (p) => p._id.toString() === identifier.toString() || p.slug === identifier
      ) || null
    );
  },

  createProduct: async (productData) => {
    if (getDbStatus()) {
      return await Product.create(productData);
    }
    const newProduct = {
      _id: 'prd_' + Date.now().toString(16),
      ratings: { average: 5, count: 1 },
      ...productData,
      createdAt: new Date(),
    };
    memoryStore.products.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id, productData) => {
    if (getDbStatus()) {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    }
    const idx = memoryStore.products.findIndex((p) => p._id.toString() === id.toString());
    if (idx === -1) return null;
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...productData, updatedAt: new Date() };
    return memoryStore.products[idx];
  },

  deleteProduct: async (id) => {
    if (getDbStatus()) {
      return await Product.findByIdAndDelete(id);
    }
    const idx = memoryStore.products.findIndex((p) => p._id.toString() === id.toString());
    if (idx === -1) return null;
    const removed = memoryStore.products.splice(idx, 1);
    return removed[0];
  },

  getFeaturedProducts: async (limit = 8) => {
    if (getDbStatus()) {
      return await Product.find({ isFeatured: true }).limit(limit);
    }
    return memoryStore.products.filter((p) => p.isFeatured).slice(0, limit);
  },

  getBestSellers: async (limit = 8) => {
    if (getDbStatus()) {
      return await Product.find({ isBestSeller: true }).limit(limit);
    }
    return memoryStore.products.filter((p) => p.isBestSeller).slice(0, limit);
  },

  getNewArrivals: async (limit = 8) => {
    if (getDbStatus()) {
      return await Product.find({ isNewArrival: true }).limit(limit);
    }
    return memoryStore.products.filter((p) => p.isNewArrival).slice(0, limit);
  },

  // Cart methods
  getCartByUserId: async (userId) => {
    if (getDbStatus()) {
      let cart = await Cart.findOne({ user: userId }).populate('items.product');
      if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
      }
      return cart;
    }
    if (!memoryStore.carts[userId]) {
      memoryStore.carts[userId] = { user: userId, items: [] };
    }
    // populate product objects in memory
    const items = memoryStore.carts[userId].items
      .map((item) => {
        const product = memoryStore.products.find((p) => p._id.toString() === item.product.toString());
        if (!product) return null;
        return {
          _id: item._id || 'item_' + Math.random().toString(16).slice(2),
          product,
          quantity: item.quantity,
          price: product.price,
        };
      })
      .filter(Boolean);

    return { user: userId, items };
  },

  saveCartItems: async (userId, items) => {
    if (getDbStatus()) {
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
      cart.items = items.map((i) => ({
        product: i.product._id || i.product,
        quantity: i.quantity,
        price: i.price,
      }));
      await cart.save();
      return await Cart.findOne({ user: userId }).populate('items.product');
    }
    memoryStore.carts[userId] = {
      user: userId,
      items: items.map((i) => ({
        _id: i._id || 'item_' + Date.now().toString(16),
        product: i.product._id || i.product,
        quantity: i.quantity,
        price: i.price,
      })),
    };
    return await dataStore.getCartByUserId(userId);
  },

  // Wishlist methods
  getWishlistByUserId: async (userId) => {
    if (getDbStatus()) {
      let wishlist = await Wishlist.findOne({ user: userId }).populate('products');
      if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, products: [] });
      }
      return wishlist;
    }
    if (!memoryStore.wishlists[userId]) {
      memoryStore.wishlists[userId] = [];
    }
    const products = memoryStore.wishlists[userId]
      .map((pId) => memoryStore.products.find((p) => p._id.toString() === pId.toString()))
      .filter(Boolean);

    return { user: userId, products };
  },

  toggleWishlistItem: async (userId, productId) => {
    if (getDbStatus()) {
      let wishlist = await Wishlist.findOne({ user: userId });
      if (!wishlist) {
        wishlist = new Wishlist({ user: userId, products: [productId] });
        await wishlist.save();
      } else {
        const exists = wishlist.products.some((p) => p.toString() === productId.toString());
        if (exists) {
          wishlist.products = wishlist.products.filter((p) => p.toString() !== productId.toString());
        } else {
          wishlist.products.push(productId);
        }
        await wishlist.save();
      }
      return await Wishlist.findOne({ user: userId }).populate('products');
    }

    if (!memoryStore.wishlists[userId]) {
      memoryStore.wishlists[userId] = [];
    }
    const idx = memoryStore.wishlists[userId].indexOf(productId.toString());
    if (idx > -1) {
      memoryStore.wishlists[userId].splice(idx, 1);
    } else {
      memoryStore.wishlists[userId].push(productId.toString());
    }
    return await dataStore.getWishlistByUserId(userId);
  },

  // Order methods
  createOrder: async (orderData) => {
    if (getDbStatus()) {
      const order = await Order.create(orderData);
      // decrement inventory
      for (const item of orderData.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
      return order;
    }

    // Deduct stock in memory
    for (const item of orderData.orderItems) {
      const p = memoryStore.products.find((prod) => prod._id.toString() === item.product.toString());
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    }

    const newOrder = {
      _id: 'ord_' + Date.now().toString(16),
      ...orderData,
      createdAt: new Date(),
      statusHistory: [
        {
          status: 'Pending',
          timestamp: new Date(),
          note: 'Order successfully created',
        },
      ],
    };
    memoryStore.orders.unshift(newOrder);
    return newOrder;
  },

  getOrdersByUserId: async (userId) => {
    if (getDbStatus()) {
      return await Order.find({ user: userId }).sort({ createdAt: -1 });
    }
    return memoryStore.orders
      .filter((o) => o.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById: async (id) => {
    if (getDbStatus()) {
      return await Order.findById(id).populate('user', 'name email');
    }
    return (
      memoryStore.orders.find(
        (o) => o._id.toString() === id.toString() || o.orderNumber === id
      ) || null
    );
  },

  getAllOrders: async ({ page = 1, limit = 20, status }) => {
    if (getDbStatus()) {
      const query = {};
      if (status && status !== 'all') query.orderStatus = status;
      const total = await Order.countDocuments(query);
      const orders = await Order.find(query)
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));
      return { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 };
    }

    let filtered = [...memoryStore.orders];
    if (status && status !== 'all') {
      filtered = filtered.filter((o) => o.orderStatus === status);
    }
    const total = filtered.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(skip, skip + Number(limit));
    return { orders: paginated, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 };
  },

  updateOrderStatus: async (id, status, note = '') => {
    if (getDbStatus()) {
      const order = await Order.findById(id);
      if (!order) return null;
      order.orderStatus = status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        order.paymentStatus = 'Completed';
      }
      order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status updated to ${status}`,
      });
      await order.save();
      return order;
    }

    const order = memoryStore.orders.find((o) => o._id.toString() === id.toString());
    if (!order) return null;
    order.orderStatus = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.paymentStatus = 'Completed';
    }
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status updated to ${status}`,
    });
    return order;
  },

  // Review methods
  getReviewsByProductId: async (productId) => {
    if (getDbStatus()) {
      return await Review.find({ product: productId }).sort({ createdAt: -1 });
    }
    return memoryStore.reviews
      .filter((r) => r.product.toString() === productId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  createReview: async (reviewData) => {
    if (getDbStatus()) {
      const review = await Review.create(reviewData);
      // update product average rating
      const reviews = await Review.find({ product: reviewData.product });
      const avg = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await Product.findByIdAndUpdate(reviewData.product, {
        'ratings.average': Number(avg.toFixed(1)),
        'ratings.count': reviews.length,
      });
      return review;
    }

    // check existing in memory
    const existing = memoryStore.reviews.find(
      (r) =>
        r.product.toString() === reviewData.product.toString() &&
        r.user.toString() === reviewData.user.toString()
    );
    if (existing) {
      throw new Error('You have already submitted a review for this product');
    }

    const newReview = {
      _id: 'rev_' + Date.now().toString(16),
      ...reviewData,
      createdAt: new Date(),
    };
    memoryStore.reviews.unshift(newReview);

    // update product rating
    const prodReviews = memoryStore.reviews.filter(
      (r) => r.product.toString() === reviewData.product.toString()
    );
    const avg = prodReviews.reduce((acc, item) => item.rating + acc, 0) / prodReviews.length;
    const prod = memoryStore.products.find(
      (p) => p._id.toString() === reviewData.product.toString()
    );
    if (prod) {
      prod.ratings = {
        average: Number(avg.toFixed(1)),
        count: prodReviews.length,
      };
    }
    return newReview;
  },

  // Coupon methods
  getCouponByCode: async (code) => {
    if (getDbStatus()) {
      return await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    }
    return (
      memoryStore.coupons.find(
        (c) => c.code === code.toUpperCase() && c.isActive
      ) || null
    );
  },

  getAllCoupons: async () => {
    if (getDbStatus()) {
      return await Coupon.find({}).sort({ createdAt: -1 });
    }
    return memoryStore.coupons;
  },

  createCoupon: async (couponData) => {
    if (getDbStatus()) {
      return await Coupon.create(couponData);
    }
    const newCoupon = {
      _id: 'cpn_' + Date.now().toString(16),
      ...couponData,
      code: couponData.code.toUpperCase(),
      createdAt: new Date(),
    };
    memoryStore.coupons.push(newCoupon);
    return newCoupon;
  },

  // Contact messages
  createContactMessage: async (msgData) => {
    if (getDbStatus()) {
      return await ContactMessage.create(msgData);
    }
    const msg = {
      _id: 'msg_' + Date.now().toString(16),
      ...msgData,
      status: 'Unread',
      createdAt: new Date(),
    };
    memoryStore.contactMessages.unshift(msg);
    return msg;
  },

  getContactMessages: async () => {
    if (getDbStatus()) {
      return await ContactMessage.find({}).sort({ createdAt: -1 });
    }
    return memoryStore.contactMessages;
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    if (getDbStatus()) {
      const totalProducts = await Product.countDocuments();
      const totalUsers = await User.countDocuments({ role: 'user' });
      const orders = await Order.find({});
      const totalOrders = orders.length;
      const totalSales = orders.reduce((sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.totalPrice : 0), 0);
      const lowStockProducts = await Product.find({ stock: { $lte: 5 } });

      return {
        totalProducts,
        totalUsers,
        totalOrders,
        totalSales,
        lowStockProducts,
      };
    }

    const totalProducts = memoryStore.products.length;
    const totalUsers = memoryStore.users.filter((u) => u.role === 'user').length;
    const totalOrders = memoryStore.orders.length;
    const totalSales = memoryStore.orders.reduce(
      (sum, o) => sum + (o.orderStatus !== 'Cancelled' ? o.totalPrice : 0),
      0
    );
    const lowStockProducts = memoryStore.products.filter((p) => p.stock <= 5);

    return {
      totalProducts,
      totalUsers,
      totalOrders,
      totalSales,
      lowStockProducts,
    };
  },
};
