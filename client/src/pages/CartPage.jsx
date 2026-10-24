import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';

const CartPage = () => {
  const {
    items,
    totalItems,
    subtotal,
    shipping,
    discount,
    total,
    coupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Looks like you haven't added any electronic gear yet. Check out our high-performance laptops and gaming rigs!"
          actionText="Start Shopping"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{totalItems}</strong> items in your cart
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
        >
          <Trash2 size={14} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Items Table / List (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-subtle overflow-hidden divide-y divide-gray-100">
            {items.map((item) => {
              const product = item.product || {};
              const pId = product._id || item.product;
              const price = product.price || item.price || 0;
              const image =
                product.images?.[0] ||
                'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={item._id || pId}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Meta */}
                  <div className="flex items-center space-x-4 flex-1">
                    <img
                      src={image}
                      alt={product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-50 flex-shrink-0 border border-gray-100"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {product.brand}
                      </span>
                      <Link
                        to={`/products/${product.slug || pId}`}
                        className="text-sm font-bold text-gray-900 hover:text-[#14213D] transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <p className="text-xs text-gray-500 font-mono">
                        SKU: {product.sku || 'TECH-ITEM'}
                      </p>
                      <p className="text-sm font-bold text-gray-900 sm:hidden">
                        ₹{price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
                      <button
                        onClick={() => updateQuantity(pId, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-xs font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(pId, item.quantity + 1)}
                        disabled={item.quantity >= (product.stock || 999)}
                        className="p-2 hover:bg-gray-200 disabled:opacity-40 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(pId)}
                      className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="hidden sm:block text-right min-w-[100px]">
                    <span className="text-base font-extrabold text-gray-900 block">
                      ₹{(price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[11px] text-gray-400">
                        (₹{price.toLocaleString('en-IN')} each)
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <Link to="/products" className="font-semibold text-[#14213D] hover:underline flex items-center gap-1">
              &larr; Continue Shopping
            </Link>
            <span>Prices are inclusive of applicable taxes</span>
          </div>
        </div>

        {/* Right: Order Summary Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Summary
            </h3>

            {/* Subtotal */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Cart Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold">
                {shipping === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${shipping}`
                )}
              </span>
            </div>

            {/* Coupon discount line */}
            {discount > 0 && (
              <div className="flex justify-between text-sm text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                <span className="flex items-center gap-1 font-medium">
                  <Tag size={14} /> Coupon ({coupon.code})
                </span>
                <span className="font-bold">-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            {/* Total */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <div>
                <span className="text-base font-bold text-gray-900 block">Total Amount</span>
                <span className="text-[11px] text-gray-400">Includes all taxes & delivery</span>
              </div>
              <span className="text-2xl font-black text-gray-900">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Coupon Box */}
            <div className="pt-2">
              {coupon ? (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl text-xs">
                  <div>
                    <span className="font-bold">{coupon.code}</span> applied: {coupon.discountPercent}% OFF
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 hover:bg-amber-100 rounded text-amber-800"
                    title="Remove coupon"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-600">
                    Promo or Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. TECHNOVA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full text-xs uppercase px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#14213D]"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-rose-600 mt-1">{couponError}</p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    Use <strong className="text-gray-600">TECHNOVA10</strong> for 10% off orders &gt; ₹1,999
                  </p>
                </form>
              )}
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-[#14213D] hover:bg-[#233862] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-subtle hover:shadow-card flex items-center justify-center space-x-2 active:scale-95"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Secure Guarantee */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-xs text-gray-500">
            <div className="flex items-center space-x-2 text-gray-700 font-semibold">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span>Safe & Encrypted Checkout</span>
            </div>
            <p className="text-[11px] text-gray-400">
              All transactions are secured with 256-bit encryption. Cash on Delivery is fully supported across all pin codes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
