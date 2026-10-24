# TechNova — Premium Electronics E-Commerce Platform

> **Technology. Simplified.**  
> A full-stack, responsive electronics e-commerce web application built with React, Vite, Node.js, Express, MongoDB (with Mongoose), JWT authentication, Tailwind CSS, and Lucide React icons.

---

## 🚀 Features Overview

### 🛍️ Customer Experience
- **Home Page**: Announcement bar, search bar, hero call to action, category highlights, Deal of the Day with live countdown timer, best-selling hardware, new arrivals, promotional gaming & audio banners, customer testimonials, and newsletter signup.
- **Product Catalog & Filtering**:
  - Search by keyword, brand, or model.
  - Category filtering across 8 tech categories.
  - Brand filtering (NovaTech, CyberStrike, Vortex, AcoustiQ, ApexForge, HorizonVision).
  - Price range min/max filter and In-Stock-Only toggle.
  - Real-time sorting: Price Low-to-High, Price High-to-Low, Newest, Most Popular, Highest Rated.
  - Responsive pagination.
- **Product Details**:
  - Image gallery with thumbnail selection and zoom.
  - Price, discount percentage, and amount saved in Indian Rupees (`₹`).
  - Stock limit checks and inventory alerts.
  - Hardware specifications table (Processor, RAM, VRAM, Display, Warranty).
  - Customer review submission with 5-star rating system.
  - Related products recommendations from the same category.
- **Shopping Cart & Wishlist**:
  - Strict server-side price recalculation (client totals are never blindly trusted).
  - Free shipping calculation for orders over ₹1,999 (₹99 flat delivery for lower orders).
  - Coupon code system (e.g., `TECHNOVA10` for 10% off, `TECHNOVA20`, `WELCOME500`).
  - Guest cart persisted in `localStorage` and automatically synchronized upon login.
  - One-click "Move from Wishlist to Cart".
- **Checkout & Order Placement**:
  - Shipping address collection with saved address selector.
  - Cash on Delivery (COD) as a fully functional payment option.
  - Online Payment integration boundary (Razorpay test gateway mode).
  - Automatic inventory deduction upon order placement.
  - Order confirmation screen with printable invoice summary.
  - Visual order status tracking: **Order Placed &rarr; Processing &rarr; Dispatched &rarr; Delivered**.
- **Customer Account & Support**:
  - User registration & login with bcrypt password hashing and JWT tokens.
  - User Profile editor (Name, Phone, Password).
  - Delivery address book.
  - Interactive Contact & Support inquiry form with FAQ accordion.

### 🛡️ Administrator Operations (`/admin`)
- **Dashboard Overview**:
  - Real-time revenue metrics, order totals, catalog size, and user counts.
  - Interactive SVG sales volume trend chart.
  - Category revenue breakdown.
  - Low-stock inventory warnings (items with stock &le; 5 units).
- **Product Management (CRUD)**:
  - Add new products with image URLs, specs, price, and SKU.
  - Edit existing products and inventory levels.
  - Delete products with immediate database synchronization.
- **Order Management**:
  - Filter orders by status (Pending, Processing, Shipped, Delivered, Cancelled).
  - Update order delivery status with automatic customer timeline logging.
- **Customer Directory**:
  - View registered customer records, joined dates, order counts, and total lifetime spend.
- **Category Management**:
  - Create and manage tech categories with image banners.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Tailwind CSS, Axios, Lucide React icons |
| **Backend** | Node.js, Express.js, JWT (jsonwebtoken), bcryptjs, Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB with Mongoose (with built-in In-Memory Fallback dataset for zero-configuration startup) |
| **Testing** | Jest, Supertest (21 automated backend tests) |

---

## 🎨 Design System

TechNova adheres to a professional, modern, and accessible design system:
- **Primary**: `#14213D` (Deep Slate / Navy)
- **Accent**: `#FCA311` (Vibrant Amber / Gold)
- **Background**: `#F8FAFC` (Clean Slate 50)
- **Cards**: `#FFFFFF`
- **Text**: `#111827` (Gray 900)
- **Borders**: `#E5E7EB` (Gray 200)

---

## 📁 Project Architecture

```
E-COMMERCE/
├── client/                     # Frontend Vite + React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── common/         # Navbar, Footer, ProductCard, Rating, Skeleton, EmptyState
│   │   ├── context/            # AuthContext, CartContext, WishlistContext
│   │   ├── pages/              # All 16 pages
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── CategoriesPage.jsx
│   │   │   ├── SearchResultsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── NotFoundPage.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/           # Axios API instance with JWT interceptor
│   │   ├── App.jsx             # React Router route registry
│   │   ├── index.css           # Tailwind base styles & directives
│   │   └── main.jsx
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Node.js + Express REST API
│   ├── scripts/
│   │   └── seed.js             # MongoDB database seeder
│   ├── src/
│   │   ├── config/             # Database connection & memory fallback
│   │   ├── controllers/        # Business logic for auth, products, orders, cart, etc.
│   │   ├── middleware/         # JWT protect, isAdmin, centralized error handler
│   │   ├── models/             # Mongoose schemas (User, Product, Category, Order, Cart, etc.)
│   │   ├── routes/             # REST API endpoint route definitions
│   │   ├── utils/              # Token generation, fallback store, seed data
│   │   ├── app.js              # Express app setup, security headers, rate limiting
│   │   └── server.js           # Server entry point
│   ├── tests/
│   │   └── technova.test.js    # Jest + Supertest integration tests
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package with monorepo scripts
└── README.md                   # Complete documentation
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested and verified on Node v26)
- **npm**: v9.0.0 or higher
- **MongoDB** *(Optional)*: If you have MongoDB running locally or a MongoDB Atlas URI, specify it in `server/.env`. If not, TechNova automatically launches in In-Memory Demo Mode with pre-populated records!

### 2. Install Dependencies
Run the following from the root directory:
```bash
npm run install:all
```
*(Or install separately: `npm --prefix server install` and `npm --prefix client install`)*

### 3. Environment Configuration

#### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/technova
USE_MEMORY_DB=true
JWT_SECRET=technova_super_secure_jwt_secret_key_2026_electronics
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=rzp_test_placeholder_secret
```

#### Frontend (`client/.env`):
```env
VITE_API_URL=http://localhost:5000/api
VITE_STORE_NAME=TechNova
```

---

## 🚀 Running the Application

### Option A: Run Both Together (Two Terminals)

**Terminal 1 — Backend Server:**
```bash
npm run server
```
*Server will start at `http://localhost:5000`*

**Terminal 2 — Frontend Client:**
```bash
npm run client
```
*Client will start at `http://localhost:5173`*

---

## 🔑 Default Credentials & Demo Accounts

For instant testing and grading, pre-configured accounts are available with one-click fill on the [Login Page](http://localhost:5173/login):

| Role | Email | Password | Access |
|---|---|---|---|
| **Administrator** | `admin@technova.com` | `Admin@12345` | Full access to `/admin` dashboard, product CRUD, order status updates |
| **Demo Customer** | `customer@technova.com` | `Customer@12345` | Standard customer access, saved orders, address book, reviews |

---

## 🎟️ Active Promotional Coupon Codes

Test coupon validation during checkout or in the cart:
- `TECHNOVA10` — **10% Off** (Max discount: ₹2,500, Min order: ₹1,999)
- `TECHNOVA20` — **20% Off** (Max discount: ₹5,000, Min order: ₹9,999)
- `WELCOME500` — **15% Off** (Max discount: ₹1,500, Min order: ₹1,499)

---

## 🧪 Running Automated Tests

Run the backend integration test suite:
```bash
npm --prefix server test
```
*Executes 21 automated tests covering authentication, route guards, product filters, cart calculations, coupon validation, inventory deductions, and admin operations.*

---

## 📡 REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server health status |
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `GET` | `/api/auth/profile` | Private | Get authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user details/password |
| `POST` | `/api/auth/address` | Private | Add saved delivery address |
| `GET` | `/api/products` | Public | List products (search, filter, sort, paginate) |
| `GET` | `/api/products/:id` | Public | Get product details & related items |
| `POST` | `/api/products` | Admin | Create new product |
| `PUT` | `/api/products/:id` | Admin | Update existing product |
| `DELETE` | `/api/products/:id` | Admin | Delete product |
| `POST` | `/api/products/:id/reviews` | Private | Submit star review for product |
| `GET` | `/api/categories` | Public | List categories with product counts |
| `GET` | `/api/cart` | Private | Get user cart with server calculated totals |
| `POST` | `/api/cart` | Private | Add item to cart |
| `PUT` | `/api/cart/:productId` | Private | Update item quantity |
| `DELETE` | `/api/cart/:productId` | Private | Remove item from cart |
| `POST` | `/api/cart/calculate` | Public | Recalculate guest cart totals on server |
| `GET` | `/api/wishlist` | Private | Get user wishlist |
| `POST` | `/api/wishlist/toggle` | Private | Toggle product in wishlist |
| `POST` | `/api/orders` | Private | Create order with inventory check & deduction |
| `GET` | `/api/orders/my-orders` | Private | Get logged-in user order history |
| `GET` | `/api/orders` | Admin | View all customer orders |
| `PUT` | `/api/orders/:id/status` | Admin | Update order status (Pending, Shipped, etc.) |
| `POST` | `/api/coupons/validate` | Public | Validate promotional coupon code |
| `GET` | `/api/admin/dashboard` | Admin | Dashboard stats, sales trends, category metrics |
| `GET` | `/api/admin/customers` | Admin | List customers with order count & spend |
| `POST` | `/api/contact` | Public | Submit support inquiry |

---

## 🚢 Production Deployment Guide

### Frontend (e.g. Vercel, Netlify, Cloudflare Pages)
1. Set the build command to `npm run build` and output directory to `dist`.
2. Configure environment variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g., `https://api.technova.com/api`).

### Backend (e.g. Render, Railway, DigitalOcean, AWS EC2)
1. Set the start command to `node src/server.js`.
2. Configure environment variables:
   - `PORT`: `5000` (or host-provided port).
   - `NODE_ENV`: `production`.
   - `MONGODB_URI`: Production MongoDB Atlas connection string.
   - `JWT_SECRET`: High-entropy 64-character secret key.
   - `CLIENT_URL`: Deployed frontend domain URL.
3. Run `npm run seed` once to populate initial categories and admin account.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
Technology. Simplified.
