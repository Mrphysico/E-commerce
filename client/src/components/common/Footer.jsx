import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Send, CheckCircle2, ShieldCheck, Truck, Headphones, RotateCcw } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#14213D] text-slate-300 mt-20 border-t border-slate-800">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Express Delivery</h4>
              <p className="text-xs text-slate-400">On all orders above ₹1,999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Genuine Tech</h4>
              <p className="text-xs text-slate-400">Official manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <RotateCcw size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">7-Day Easy Returns</h4>
              <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
            </div>
          </div>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-[#FCA311] flex-shrink-0">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">24/7 Tech Assistance</h4>
              <p className="text-xs text-slate-400">Live support by real engineers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-[#FCA311]">
                <Sparkles size={20} className="fill-[#FCA311]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Tech<span className="text-[#FCA311]">Nova</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              TechNova is India's premier destination for high-performance laptops, custom gaming PCs, flagship smartphones, studio acoustics, and PC components. Technology. Simplified.
            </p>

            <div className="pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Tech Support & Inquiries
              </p>
              <p className="text-sm font-bold text-white">support@technova.com</p>
              <p className="text-xs text-slate-400">+91 (800) 425-NOVA (Mon - Sat, 9 AM - 8 PM IST)</p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/category/laptops" className="hover:text-white transition-colors">
                  Laptops & Ultrabooks
                </Link>
              </li>
              <li>
                <Link to="/category/desktop-pcs" className="hover:text-white transition-colors">
                  Custom Gaming PCs
                </Link>
              </li>
              <li>
                <Link to="/category/smartphones" className="hover:text-white transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/category/monitors" className="hover:text-white transition-colors">
                  Monitors & Displays
                </Link>
              </li>
              <li>
                <Link to="/category/graphics-cards" className="hover:text-white transition-colors">
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link to="/category/headphones-and-speakers" className="hover:text-white transition-colors">
                  Audio & Headphones
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Hub
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About TechNova
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help & Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Stay in the Loop
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get secret discount drops, hardware release alerts, and weekly tech reviews.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FCA311]"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FCA311] hover:bg-[#e5920b] text-slate-900 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>Subscribe Now</span>
                <Send size={14} />
              </button>
            </form>

            {subscribed && (
              <div className="mt-2.5 flex items-center space-x-1.5 text-xs text-emerald-400">
                <CheckCircle2 size={14} />
                <span>You are subscribed to TechNova insider drops!</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Icons */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            &copy; {new Date().getFullYear()} TechNova Technologies Pvt. Ltd. All rights reserved. Technology. Simplified.
          </div>

          <div className="flex items-center space-x-3 text-slate-300">
            <span className="font-semibold text-[11px] text-slate-400">SECURE CHECKOUT:</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-300">UPI</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-300">RuPay</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-300">Visa</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-300">Mastercard</span>
            <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold text-slate-300">COD Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
