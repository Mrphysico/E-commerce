import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Tag,
  Package,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { items, subtotal, shipping, discount, total, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0] || {};

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: defaultAddress.street || '',
    city: defaultAddress.city || '',
    state: defaultAddress.state || '',
    postalCode: defaultAddress.postalCode || '',
    country: defaultAddress.country || 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'Razorpay'
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [orderCompleted, setOrderCompleted] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData((prev) => ({
      ...prev,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.street ||
      !formData.city ||
      !formData.state ||
      !formData.postalCode
    ) {
      setError('Please fill in all required shipping address fields');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty. Add products to place an order.');
      return;
    }

    setSubmitting(true);

    try {
      const orderPayload = {
        orderItems: items.map((item) => ({
          product: item.product?._id || item.product,
          name: item.product?.name || item.name,
          quantity: item.quantity,
          price: item.product?.price || item.price,
          sku: item.product?.sku || 'SKU',
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod,
        couponCode: coupon?.code || '',
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        setOrderCompleted(res.data.order);
        await clearCart();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to place order. Please review your cart and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully placed, render Order Confirmation View
  if (orderCompleted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 text-center shadow-card space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Order Confirmed &bull; Preparing for Dispatch
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-gray-500">
              An order confirmation has been logged with reference number{' '}
              <strong className="text-gray-900 font-mono text-base">
                {orderCompleted.orderNumber}
              </strong>
            </p>
          </div>

          {/* Order Details Snippet */}
          <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200 text-xs">
              <span className="text-gray-500">Payment Mode:</span>
              <span className="font-bold text-gray-900">
                {orderCompleted.paymentMethod === 'COD'
                  ? 'Cash on Delivery (Pay at Doorstep)'
                  : 'Online Payment (Razorpay)'}
              </span>
            </div>

            <div className="flex justify-between items-center pb-3 border-b border-gray-200 text-xs">
              <span className="text-gray-500">Shipping To:</span>
              <span className="font-medium text-gray-900 text-right">
                {orderCompleted.shippingAddress.name}, {orderCompleted.shippingAddress.city},{' '}
                {orderCompleted.shippingAddress.postalCode}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-bold">
              <span>Total Amount Paid / Due:</span>
              <span className="text-lg text-[#14213D]">
                ₹{orderCompleted.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/orders"
              className="bg-[#14213D] hover:bg-[#233862] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-subtle flex items-center space-x-2"
            >
              <Package size={16} />
              <span>Track in My Orders</span>
            </Link>

            <Link
              to="/products"
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl font-semibold text-sm transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="pb-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Complete your shipping details and choose your preferred payment option
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <Lock size={14} />
          <span>256-bit SSL Protected</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Shipping & Payment (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Saved Addresses Pill Selector if user has addresses */}
          {user?.addresses?.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-subtle space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Choose from Saved Addresses
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {user.addresses.map((addr) => (
                  <button
                    type="button"
                    key={addr._id}
                    onClick={() => handleSelectSavedAddress(addr)}
                    className="p-3 text-left border rounded-xl border-gray-200 hover:border-[#14213D] hover:bg-slate-50 transition-all text-xs space-y-1"
                  >
                    <p className="font-bold text-gray-900">{addr.street}</p>
                    <p className="text-gray-500">{addr.city}, {addr.state} - {addr.postalCode}</p>
                    {addr.isDefault && (
                      <span className="inline-block bg-gray-100 text-[10px] font-semibold text-gray-700 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Address Inputs */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Truck size={18} className="text-[#14213D]" />
              <span>1. Shipping Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Mobile Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">
                  Street Address & House / Flat No. *
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  placeholder="e.g. 402 Skyline Towers, MG Road"
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Bengaluru, Mumbai, Delhi..."
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="Karnataka, Maharashtra..."
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Postal Code (PIN) *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="560001"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  disabled
                  value={formData.country}
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-subtle space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={18} className="text-[#14213D]" />
              <span>2. Payment Option</span>
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery (Functional default) */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'COD'
                    ? 'border-[#14213D] bg-slate-50/70 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-1 text-[#14213D] focus:ring-[#14213D]"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <Banknote size={18} className="text-emerald-600" />
                    <span className="font-bold text-sm text-gray-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      POPULAR
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Pay securely using cash, UPI QR code, or card upon doorstep delivery.
                  </p>
                </div>
              </label>

              {/* Online Payment (Razorpay Test Mode) */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  paymentMethod === 'Razorpay'
                    ? 'border-[#14213D] bg-slate-50/70 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-1 text-[#14213D] focus:ring-[#14213D]"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <CreditCard size={18} className="text-[#FCA311]" />
                    <span className="font-bold text-sm text-gray-900">
                      Online Payment (UPI, Cards, NetBanking)
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      TEST GATEWAY
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Instant sandbox payment simulation with zero card data stored on server.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Order Review & Placement (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-4 sticky top-28">
            <h3 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Order Items ({items.length})
            </h3>

            {/* Items summary list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-gray-100">
              {items.map((item) => (
                <div key={item._id || item.product?._id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
                      }
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</p>
                      <p className="text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ₹{((item.product?.price || item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold">
                  {shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `₹${shipping}`}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            {/* Final Total */}
            <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
              <span className="text-base font-extrabold text-gray-900">Final Order Total</span>
              <span className="text-2xl font-black text-[#14213D]">
                ₹{total.toLocaleString('en-IN')}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#14213D] hover:bg-[#233862] text-white py-3.5 rounded-xl font-bold text-sm transition-all shadow-subtle hover:shadow-card flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Place Order (₹{total.toLocaleString('en-IN')})</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              By clicking "Place Order", you agree to TechNova's Terms of Sale and Warranty Policy.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
