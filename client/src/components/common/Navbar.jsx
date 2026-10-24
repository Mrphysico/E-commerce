import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const categories = [
    { name: 'Laptops', slug: 'laptops' },
    { name: 'Desktop PCs', slug: 'desktop-pcs' },
    { name: 'Smartphones', slug: 'smartphones' },
    { name: 'Monitors', slug: 'monitors' },
    { name: 'Keyboards & Mice', slug: 'keyboards-and-mice' },
    { name: 'Headphones & Audio', slug: 'headphones-and-speakers' },
    { name: 'Graphics Cards', slug: 'graphics-cards' },
    { name: 'Accessories', slug: 'computer-accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      {/* 1. Announcement Bar */}
      <div className="bg-[#14213D] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-[#FCA311] text-slate-900 font-bold px-1.5 py-0.5 rounded text-[10px]">
              LIMITED DEAL
            </span>
            <span className="font-medium text-slate-200 text-xs">
              Free Express Shipping on orders over ₹1,999 | Use coupon{' '}
              <strong className="text-[#FCA311]">TECHNOVA10</strong> for 10% off
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-4 text-xs text-slate-300">
            <Link to="/about" className="hover:text-white transition-colors">
              Why TechNova
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">
              24/7 Tech Support
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#14213D] flex items-center justify-center text-[#FCA311] shadow-subtle group-hover:scale-105 transition-transform">
              <Sparkles size={22} className="fill-[#FCA311]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#14213D] flex items-center">
                Tech<span className="text-[#FCA311]">Nova</span>
              </span>
              <span className="text-[10px] tracking-wider text-gray-500 font-medium block -mt-1">
                TECHNOLOGY. SIMPLIFIED.
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop & Tablet) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-lg relative"
          >
            <input
              type="text"
              placeholder="Search laptops, RTX GPUs, OLED monitors, mechanical keyboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:bg-white focus:outline-none focus:border-[#14213D] focus:ring-1 focus:ring-[#14213D] transition-all"
            />
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#14213D] hover:bg-[#233862] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Navigation Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2.5 text-gray-700 hover:text-[#14213D] hover:bg-gray-100 rounded-full transition-colors"
              title="Saved Wishlist"
            >
              <Heart size={22} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#FCA311] text-slate-900 text-[10px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Link */}
            <Link
              to="/cart"
              className="relative p-2.5 text-gray-700 hover:text-[#14213D] hover:bg-gray-100 rounded-full transition-colors flex items-center"
              title="Shopping Cart"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#14213D] text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors text-sm font-medium text-gray-800 bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#14213D] text-white text-xs font-bold flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {userDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-hover border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            ADMINISTRATOR
                          </span>
                        )}
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2.5 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-50"
                        >
                          <LayoutDashboard size={16} />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <Link
                        to="/profile"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User size={16} className="text-gray-400" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to="/orders"
                        className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Package size={16} className="text-gray-400" />
                        <span>My Orders</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#14213D] px-3 py-2 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="hidden sm:inline-block bg-[#14213D] hover:bg-[#233862] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-subtle"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 3. Category Bar (Desktop) */}
        <nav className="hidden md:flex items-center justify-between border-t border-gray-100 py-2.5 text-sm font-medium">
          <div className="flex items-center space-x-6">
            <Link
              to="/products"
              className={`hover:text-[#FCA311] transition-colors ${
                location.pathname === '/products' && !location.search
                  ? 'text-[#14213D] font-bold border-b-2 border-[#14213D] pb-1'
                  : 'text-gray-700'
              }`}
            >
              All Electronics
            </Link>
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`hover:text-[#14213D] transition-colors ${
                  location.pathname === `/category/${cat.slug}`
                    ? 'text-[#14213D] font-bold'
                    : 'text-gray-600'
                }`}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/categories"
              className="text-xs font-bold text-[#FCA311] hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-gray-500">
            <Link to="/about" className="hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="hover:text-gray-900">
              Contact
            </Link>
          </div>
        </nav>
      </div>

      {/* 4. Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#14213D]"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </form>

          <div className="border-t border-gray-100 pt-2 space-y-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
              Product Categories
            </p>
            <Link
              to="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:bg-gray-50"
            >
              All Products
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              About TechNova
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
            >
              Customer Support
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
