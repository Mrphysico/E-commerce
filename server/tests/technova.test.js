import request from 'supertest';
import app from '../src/app.js';

describe('TechNova Electronics Backend API Test Suite', () => {
  let adminToken;
  let userToken;
  let createdProductId;

  // Health Check
  describe('GET /api/health', () => {
    it('should return server health status ok', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.store).toContain('TechNova');
    });
  });

  // Authentication & Security
  describe('Auth Endpoints & Role Controls', () => {
    it('should login admin with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@technova.com',
          password: 'Admin@12345',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('admin');
      adminToken = res.body.token;
    });

    it('should login customer with valid credentials and return JWT token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@technova.com',
          password: 'Customer@12345',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.role).toBe('user');
      userToken = res.body.token;
    });

    it('should reject login with invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'customer@technova.com',
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should register a new customer', async () => {
      const testEmail = `newuser_${Date.now()}@example.com`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Jane Doe',
          email: testEmail,
          password: 'Password@123',
          phone: '+91 98765 00000',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(testEmail);
    });

    it('should reject registration with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Admin Clone',
          email: 'admin@technova.com',
          password: 'Password@123',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject access to admin dashboard for regular customer', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Administrator privileges required');
    });

    it('should grant access to admin dashboard for admin token', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.stats).toBeDefined();
    });
  });

  // Products and Filtering
  describe('Product Listing & Filtering', () => {
    it('should retrieve products list with pagination', async () => {
      const res = await request(app).get('/api/products?page=1&limit=6');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.products)).toBe(true);
      expect(res.body.products.length).toBeLessThanOrEqual(6);
      expect(res.body.total).toBeGreaterThan(0);
    });

    it('should filter products by category', async () => {
      const res = await request(app).get('/api/products?category=laptops');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.products.forEach((p) => {
        expect(p.categorySlug).toBe('laptops');
      });
    });

    it('should filter products by search keyword', async () => {
      const res = await request(app).get('/api/products?search=RTX');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.products.length).toBeGreaterThan(0);
    });

    it('should filter products by price range', async () => {
      const res = await request(app).get('/api/products?minPrice=5000&maxPrice=15000');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      res.body.products.forEach((p) => {
        expect(p.price).toBeGreaterThanOrEqual(5000);
        expect(p.price).toBeLessThanOrEqual(15000);
      });
    });

    it('should get single product by slug or id with related items', async () => {
      const res = await request(app).get('/api/products/aerobook-pro-16-max');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.name).toBe('AeroBook Pro 16 Max');
      expect(Array.isArray(res.body.related)).toBe(true);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/api/products/non-existent-product-slug-xyz');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // Cart & Calculation
  describe('Cart & Guest Price Calculation', () => {
    it('should calculate guest cart totals using server-side product pricing', async () => {
      const res = await request(app)
        .post('/api/cart/calculate')
        .send({
          items: [
            {
              product: { _id: '65e02a010000000000000009' }, // CyberStrike Keyboard ₹8,999
              quantity: 2,
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.subtotal).toBe(17998);
      expect(res.body.shipping).toBe(0); // Free shipping over 1999
      expect(res.body.total).toBe(17998);
    });

    it('should validate and apply coupons correctly', async () => {
      const res = await request(app)
        .post('/api/coupons/validate')
        .send({
          code: 'TECHNOVA10',
          orderAmount: 10000,
        });

      expect(res.status).toBe(200);
      expect(res.body.valid).toBe(true);
      expect(res.body.discountAmount).toBe(1000); // 10% of 10000
    });
  });

  // Order Placement Workflow
  describe('Order Creation & Inventory Deduction', () => {
    it('should create an order with COD, calculate total on server, and deduct inventory', async () => {
      // First get a product stock
      const prodRes = await request(app).get('/api/products/glidespeed-ultralight-wireless-gaming-mouse');
      const initialStock = prodRes.body.product.stock;

      const orderPayload = {
        orderItems: [
          {
            product: prodRes.body.product._id,
            name: prodRes.body.product.name,
            quantity: 1,
            price: prodRes.body.product.price,
            sku: prodRes.body.product.sku,
          },
        ],
        shippingAddress: {
          name: 'Rahul Sharma',
          email: 'customer@technova.com',
          phone: '+91 98123 45678',
          street: '402 Skyline Towers',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
        },
        paymentMethod: 'COD',
        couponCode: 'TECHNOVA10',
      };

      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send(orderPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.order.orderNumber).toBeDefined();
      expect(res.body.order.orderStatus).toBe('Pending');

      // Check stock deducted
      const prodAfter = await request(app).get('/api/products/glidespeed-ultralight-wireless-gaming-mouse');
      expect(prodAfter.body.product.stock).toBe(initialStock - 1);
    });

    it('should allow admin to update order status to Processing and Shipped', async () => {
      const ordersRes = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`);

      const firstOrder = ordersRes.body.orders[0];
      expect(firstOrder).toBeDefined();

      const updateRes = await request(app)
        .put(`/api/orders/${firstOrder._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'Processing', note: 'Items allocated and packed' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.success).toBe(true);
      expect(updateRes.body.order.orderStatus).toBe('Processing');
    });
  });

  // Admin Product Management
  describe('Admin Product Management (CRUD)', () => {
    it('should allow admin to create a new product', async () => {
      const newProductPayload = {
        name: 'TechNova Test Gaming Headset',
        brand: 'AcoustiQ',
        categorySlug: 'headphones-and-speakers',
        price: 4999,
        originalPrice: 6999,
        discount: 28,
        stock: 15,
        sku: 'AUD-TEST-HD01',
        description: 'Test high fidelity gaming headset',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'],
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProductPayload);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.product.sku).toBe('AUD-TEST-HD01');
      createdProductId = res.body.product._id;
    });

    it('should allow admin to update the created product', async () => {
      const res = await request(app)
        .put(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 4499, stock: 20 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.product.price).toBe(4499);
      expect(res.body.product.stock).toBe(20);
    });

    it('should allow admin to delete the test product', async () => {
      const res = await request(app)
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});
