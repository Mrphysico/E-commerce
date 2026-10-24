import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { initialCategories, initialProducts, initialCoupons } from '../src/utils/seedData.js';
import User from '../src/models/User.js';
import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Coupon from '../src/models/Coupon.js';
import Review from '../src/models/Review.js';
import Order from '../src/models/Order.js';

const seedData = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/technova';

  try {
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully!');

    // Clear existing data
    console.log('Clearing old database records...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
      Review.deleteMany(),
      Order.deleteMany(),
    ]);

    // Create Categories
    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(initialCategories);
    console.log(`Created ${createdCategories.length} categories.`);

    // Map category slugs to created category ObjectIds
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Create Products with mapped Category IDs
    console.log('Seeding products...');
    const productsWithCategoryIds = initialProducts.map((p) => ({
      ...p,
      category: categoryMap[p.categorySlug] || createdCategories[0]._id,
    }));
    const createdProducts = await Product.insertMany(productsWithCategoryIds);
    console.log(`Created ${createdProducts.length} products.`);

    // Seed Admin and Demo User
    console.log('Seeding administrative and customer accounts...');
    const adminPassword = await bcrypt.hash('Admin@12345', 10);
    const customerPassword = await bcrypt.hash('Customer@12345', 10);

    const adminUser = await User.create({
      name: 'TechNova Administrator',
      email: 'admin@technova.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98765 43210',
      addresses: [
        {
          street: 'TechNova HQ, Cyber City Phase 2',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560001',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: 'Rahul Sharma',
      email: 'customer@technova.com',
      password: customerPassword,
      role: 'user',
      phone: '+91 98123 45678',
      addresses: [
        {
          street: 'Flat 402, Skyline Residency, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true,
        },
      ],
    });
    console.log('Created accounts: admin@technova.com, customer@technova.com');

    // Seed Coupons
    console.log('Seeding coupons...');
    await Coupon.insertMany(initialCoupons);
    console.log('Created coupons: TECHNOVA10, TECHNOVA20, WELCOME500');

    // Seed Sample Reviews
    console.log('Seeding sample reviews...');
    if (createdProducts.length > 0) {
      await Review.create({
        product: createdProducts[0]._id,
        user: customerUser._id,
        userName: customerUser.name,
        rating: 5,
        title: 'Flawless engineering and display',
        comment: 'The OLED display on this machine is breathtaking. Thermal performance is whisper quiet even under heavy compiling loads.',
      });
    }

    console.log('Database seeded successfully with rich electronics dataset!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    console.log('\nNote: If local MongoDB is not running, the application will automatically run in In-Memory Demo Mode with pre-populated records.');
    process.exit(1);
  }
};

seedData();
