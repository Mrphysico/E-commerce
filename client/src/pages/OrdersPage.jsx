import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  RotateCcw,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/common/EmptyState';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        if (res.data.success) {
          setOrders(res.data.orders || []);
          if (res.data.orders?.length > 0) {
            setExpandedOrder(res.data.orders[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrackingSteps = (status) => {
    const steps = [
      { key: 'Pending', label: 'Order Placed' },
      { key: 'Processing', label: 'Processing' },
      { key: 'Shipped', label: 'Dispatched' },
      { key: 'Delivered', label: 'Delivered' },
    ];

    const statusHierarchy = {
      Pending: 0,
      Processing: 1,
      Shipped: 2,
      Delivered: 3,
      Cancelled: -1,
    };

    const currentLevel = statusHierarchy[status] ?? 0;

    return steps.map((step, idx) => ({
      ...step,
      isCompleted: currentLevel >= idx,
      isCurrent: currentLevel === idx,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-4 border-[#14213D] border-t-[#FCA311] rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Loading your order history...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={Package}
          title="No Orders Placed Yet"
          description="You haven't ordered any electronics gear yet. Start shopping and track your orders right here!"
          actionText="Explore Electronics"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Track dispatches, view invoices, and review order timelines
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="no-print hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
        >
          <Printer size={14} />
          <span>Print Receipts</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const trackingSteps = getTrackingSteps(order.orderStatus);

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden"
            >
              {/* Order Header Summary */}
              <div
                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                className="p-5 sm:p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-base font-black text-gray-900">
                      {order.orderNumber}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-gray-900 block">
                      ₹{order.totalPrice?.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {order.orderItems?.length || 1} item(s) &bull; {order.paymentMethod}
                    </span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {/* Order Tracking Progress Line */}
              {order.orderStatus !== 'Cancelled' && (
                <div className="px-6 py-5 bg-white border-b border-gray-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-4">
                    Tracking Status
                  </p>
                  <div className="grid grid-cols-4 gap-2 relative">
                    {trackingSteps.map((step, idx) => (
                      <div key={step.key} className="text-center relative">
                        <div
                          className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step.isCompleted
                              ? 'bg-[#14213D] text-[#FCA311] shadow-sm'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {step.isCompleted ? '✓' : idx + 1}
                        </div>
                        <p
                          className={`text-xs mt-1.5 font-medium ${
                            step.isCompleted ? 'text-gray-900 font-bold' : 'text-gray-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order Items & Breakdown (Visible when expanded) */}
              {isExpanded && (
                <div className="p-6 space-y-6">
                  {/* Items */}
                  <div className="divide-y divide-gray-100">
                    {order.orderItems?.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              item.image ||
                              'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'
                            }
                            alt=""
                            className="w-14 h-14 rounded-xl object-cover bg-slate-50 flex-shrink-0"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-gray-400 text-xs font-mono">
                              SKU: {item.sku} &bull; Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-extrabold text-gray-900">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Shipping Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-700">Delivery Address:</p>
                      <p className="text-gray-600">{order.shippingAddress?.name}</p>
                      <p className="text-gray-500">{order.shippingAddress?.street}</p>
                      <p className="text-gray-500">
                        {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                        {order.shippingAddress?.postalCode}
                      </p>
                      <p className="text-gray-500">Phone: {order.shippingAddress?.phone}</p>
                    </div>

                    <div className="space-y-1.5 sm:text-right">
                      <p className="font-bold text-gray-700">Payment Breakdown:</p>
                      <div className="flex justify-between sm:justify-end sm:space-x-4 text-gray-500">
                        <span>Items Subtotal:</span>
                        <span className="font-medium text-gray-900">
                          ₹{order.itemsPrice?.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between sm:justify-end sm:space-x-4 text-gray-500">
                        <span>Shipping Charge:</span>
                        <span className="font-medium">
                          {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                        </span>
                      </div>
                      {order.discountPrice > 0 && (
                        <div className="flex justify-between sm:justify-end sm:space-x-4 text-emerald-600 font-medium">
                          <span>Coupon Discount:</span>
                          <span>-₹{order.discountPrice?.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between sm:justify-end sm:space-x-4 text-sm font-black text-[#14213D] pt-1">
                        <span>Grand Total:</span>
                        <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersPage;
