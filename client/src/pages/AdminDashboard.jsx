import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  DollarSign,
  Tag,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'categories' | 'customers'
  const [loading, setLoading] = useState(true);

  // Overview stats & chart data
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    lowStockProducts: [],
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    brand: '',
    categorySlug: 'laptops',
    price: '',
    originalPrice: '',
    discount: 0,
    stock: '',
    sku: '',
    description: '',
    image: '',
  });

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  // Categories Tab State
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDesc, setCategoryDesc] = useState('');
  const [categoryImage, setCategoryImage] = useState('');

  // Customers Tab State
  const [customers, setCustomers] = useState([]);

  // Feedback notifications
  const [adminNotice, setAdminNotice] = useState(null);

  const notifyAdmin = (msg) => {
    setAdminNotice(msg);
    setTimeout(() => setAdminNotice(null), 3000);
  };

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, prodRes, orderRes, catRes, custRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/products?limit=100'),
        api.get('/orders?limit=100'),
        api.get('/categories'),
        api.get('/admin/customers'),
      ]);

      if (dashRes.data.success) {
        setStats(dashRes.data.stats);
        setSalesTrend(dashRes.data.salesTrend || []);
        setSalesByCategory(dashRes.data.salesByCategory || []);
        setRecentOrders(dashRes.data.recentOrders || []);
      }
      if (prodRes.data.success) setProducts(prodRes.data.products || []);
      if (orderRes.data.success) setOrders(orderRes.data.orders || []);
      if (catRes.data.success) setCategories(catRes.data.categories || []);
      if (custRes.data.success) setCustomers(custRes.data.customers || []);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Product CRUD
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      brand: '',
      categorySlug: categories[0]?.slug || 'laptops',
      price: '',
      originalPrice: '',
      discount: 0,
      stock: '10',
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      description: 'High-performance computing device built with premium materials.',
      image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80',
    });
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      brand: prod.brand,
      categorySlug: prod.categorySlug,
      price: String(prod.price),
      originalPrice: String(prod.originalPrice || prod.price),
      discount: prod.discount || 0,
      stock: String(prod.stock),
      sku: prod.sku,
      description: prod.description || '',
      image: prod.images?.[0] || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productFormData.name,
        brand: productFormData.brand,
        categorySlug: productFormData.categorySlug,
        price: Number(productFormData.price),
        originalPrice: Number(productFormData.originalPrice || productFormData.price),
        discount: Number(productFormData.discount),
        stock: Number(productFormData.stock),
        sku: productFormData.sku,
        description: productFormData.description,
        images: [productFormData.image],
      };

      if (editingProduct) {
        const res = await api.put(`/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          notifyAdmin('Product updated successfully!');
          setShowProductModal(false);
          loadDashboardData();
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data.success) {
          notifyAdmin('Product created successfully!');
          setShowProductModal(false);
          loadDashboardData();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        notifyAdmin('Product removed from catalog');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product');
    }
  };

  // Order Status Update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, {
        status: newStatus,
        note: `Status updated by ${user?.name || 'Administrator'}`,
      });
      if (res.data.success) {
        notifyAdmin(`Order marked as ${newStatus}`);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName) return;
    try {
      const res = await api.post('/categories', {
        name: categoryName,
        description: categoryDesc,
        image: categoryImage || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      });
      if (res.data.success) {
        notifyAdmin('Category created!');
        setShowCategoryModal(false);
        setCategoryName('');
        setCategoryDesc('');
        setCategoryImage('');
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create category');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders =
    orderStatusFilter === 'all'
      ? orders
      : orders.filter((o) => o.orderStatus === orderStatusFilter);

  // Maximum value for SVG chart height scaling
  const maxRevenue = Math.max(...salesTrend.map((d) => d.revenue), 10000);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Notice Banner */}
      {adminNotice && (
        <div className="fixed top-24 right-6 z-50 bg-[#14213D] text-[#FCA311] px-5 py-3 rounded-2xl shadow-hover border border-white/20 text-xs font-bold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4">
          <Check size={16} />
          <span>{adminNotice}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-[#14213D] text-[#FCA311] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-gray-400">Authenticated Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            TechNova Store Operations
          </h1>
        </div>

        {/* Global Action Button */}
        <button
          onClick={handleOpenCreateProduct}
          className="bg-[#14213D] hover:bg-[#233862] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-subtle self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-gray-200 space-x-1 sm:space-x-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-[#14213D] text-[#14213D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <LayoutDashboard size={16} />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-[#14213D] text-[#14213D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Package size={16} />
          <span>Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#14213D] text-[#14213D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <ShoppingCart size={16} />
          <span>Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-[#14213D] text-[#14213D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Tag size={16} />
          <span>Categories ({categories.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-3 text-xs sm:text-sm font-bold border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
            activeTab === 'customers'
              ? 'border-[#14213D] text-[#14213D]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={16} />
          <span>Customers ({customers.length})</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Revenue
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                ₹{Number(stats.totalSales || 0).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ArrowUpRight size={14} /> Based on completed & active orders
              </span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Total Orders
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {stats.totalOrders}
              </p>
              <span className="text-[11px] text-gray-400">Processed across India</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Catalog Products
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {stats.totalProducts}
              </p>
              <span className="text-[11px] text-gray-400">Across 8 active categories</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Registered Users
              </span>
              <p className="text-2xl sm:text-3xl font-black text-gray-900">
                {stats.totalUsers}
              </p>
              <span className="text-[11px] text-gray-400">Verified accounts</span>
            </div>
          </div>

          {/* Low Stock Alert Table if any */}
          {stats.lowStockProducts?.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-3">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <AlertTriangle size={18} className="text-amber-600" />
                <span>Inventory Warning: {stats.lowStockProducts.length} Products Low on Stock</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {stats.lowStockProducts.map((p) => (
                  <div
                    key={p._id}
                    className="bg-white p-3 rounded-xl border border-amber-100 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-gray-400 font-mono">SKU: {p.sku}</p>
                    </div>
                    <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded">
                      {p.stock} left
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Real-time Sales Trend SVG Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Weekly Sales Volume & Trends
                </h3>
                <p className="text-xs text-gray-500">
                  Daily revenue computed from order timestamps
                </p>
              </div>
              <span className="text-xs font-bold text-[#14213D] bg-slate-100 px-3 py-1 rounded-full">
                Past 7 Days
              </span>
            </div>

            {/* Interactive Responsive SVG Bar Chart */}
            <div className="w-full h-64 flex items-end justify-between gap-3 sm:gap-6 pt-8 pb-4 px-2">
              {salesTrend.map((item, idx) => {
                const heightPercent = Math.min(100, Math.max(15, (item.revenue / maxRevenue) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <span className="text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      ₹{(item.revenue / 1000).toFixed(0)}k
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[48px] bg-[#14213D] group-hover:bg-[#FCA311] rounded-t-xl transition-all duration-300 shadow-sm"
                    />
                    <span className="text-xs font-bold text-gray-600 mt-1">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales By Category Breakdown */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Sales Performance by Hardware Category
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {salesByCategory.map((cat) => (
                <div key={cat.categorySlug} className="p-4 bg-slate-50/70 rounded-2xl border border-gray-100 space-y-1">
                  <p className="font-bold text-xs text-gray-900">{cat.categoryName}</p>
                  <p className="text-lg font-black text-[#14213D]">
                    ₹{(cat.revenue || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {cat.unitsSold || 0} units sold &bull; {cat.productCount || 0} catalog items
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB (CRUD) */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:max-w-md">
              <input
                type="text"
                placeholder="Search products by title, brand, SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#14213D]"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <button
              onClick={handleOpenCreateProduct}
              className="bg-[#14213D] hover:bg-[#233862] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 shadow-subtle w-full sm:w-auto justify-center"
            >
              <Plus size={16} />
              <span>Add Product</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Item & Title</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (₹)</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 flex items-center space-x-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-gray-400">{p.brand}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 capitalize text-gray-600">
                        {p.categorySlug?.replace(/-/g, ' ')}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                            p.stock === 0
                              ? 'bg-rose-100 text-rose-800'
                              : p.stock <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-500">{p.sku}</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100"
                          title="Edit product"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          title="Delete product"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  orderStatusFilter === st
                    ? 'bg-[#14213D] text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                  <tr>
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Total Amount</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-gray-900">{ord.shippingAddress?.name}</p>
                        <p className="text-[10px] text-gray-400">{ord.shippingAddress?.city}</p>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-gray-900">
                        ₹{ord.totalPrice?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.orderStatus === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.orderStatus === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.orderStatus === 'Processing'
                              ? 'bg-amber-100 text-amber-800'
                              : ord.orderStatus === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                          className="p-1 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-gray-900">Product Categories</h3>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="bg-[#14213D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((c) => (
              <div key={c.slug} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-subtle space-y-2">
                <img
                  src={c.image}
                  alt={c.name}
                  className="w-full h-32 rounded-xl object-cover bg-slate-50"
                />
                <h4 className="font-bold text-sm text-gray-900">{c.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                <span className="text-[10px] font-mono text-gray-400 block">
                  Slug: {c.slug} &bull; {c.productCount || 0} items
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-gray-600 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
                <tr>
                  <th className="py-3.5 px-4">Customer Name</th>
                  <th className="py-3.5 px-4">Email</th>
                  <th className="py-3.5 px-4">Phone</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4">Total Orders</th>
                  <th className="py-3.5 px-4">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map((cust) => (
                  <tr key={cust._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-gray-900">{cust.name}</td>
                    <td className="py-3.5 px-4 text-gray-600">{cust.email}</td>
                    <td className="py-3.5 px-4 text-gray-500">{cust.phone || 'N/A'}</td>
                    <td className="py-3.5 px-4 text-gray-400">
                      {new Date(cust.joinedDate).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-800">
                      {cust.totalOrders} order(s)
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-[#14213D]">
                      {cust.totalSpentFormatted || `₹${cust.totalSpent?.toLocaleString('en-IN')}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Create/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Hardware Product'}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AeroBook Pro 16 Max"
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="NovaTech, CyberStrike, Vortex..."
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={productFormData.categorySlug}
                    onChange={(e) => setProductFormData({ ...productFormData, categorySlug: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl capitalize"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="89999"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="99999"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Inventory Units in Stock *</label>
                  <input
                    type="number"
                    required
                    value={productFormData.stock}
                    onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">SKU Identification *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.sku}
                    onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl uppercase font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/..."
                    value={productFormData.image}
                    onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">Product Description</label>
                  <textarea
                    rows={3}
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#14213D] text-white rounded-xl font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="font-extrabold text-base text-gray-900">Add New Category</h3>
            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Category Name (e.g. Smart Watches)"
                required
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
              <textarea
                placeholder="Category Description"
                rows={2}
                value={categoryDesc}
                onChange={(e) => setCategoryDesc(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
              <input
                type="url"
                placeholder="Image URL"
                value={categoryImage}
                onChange={(e) => setCategoryImage(e.target.value)}
                className="w-full p-2.5 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#14213D] text-white rounded-xl font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
