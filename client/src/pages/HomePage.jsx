import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  Flame,
  Award,
  ChevronRight,
  Clock,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Deal of the day countdown simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featRes, bestRes, newRes, catRes] = await Promise.all([
          api.get('/products/featured'),
          api.get('/products/bestsellers'),
          api.get('/products/new-arrivals'),
          api.get('/categories'),
        ]);

        if (featRes.data.success) setFeaturedProducts(featRes.data.products);
        if (bestRes.data.success) setBestSellers(bestRes.data.products);
        if (newRes.data.success) setNewArrivals(newRes.data.products);
        if (catRes.data.success) setCategories(catRes.data.categories);
      } catch (err) {
        console.error('Failed to load home page products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#14213D] via-[#101b33] to-[#0c1527] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FCA311]">
                <Sparkles size={14} className="fill-[#FCA311]" />
                <span>Next-Gen Electronics Engineered for Excellence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-balance">
                Power Your Ambition With <span className="text-[#FCA311]">Premium Tech.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
                Discover ultrabooks with OLED brilliance, liquid-cooled gaming rigs, flagship camera phones, and studio-grade acoustics. Built for creators and gamers.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/products"
                  className="bg-[#FCA311] hover:bg-[#e5920b] text-slate-900 font-bold px-7 py-3.5 rounded-xl text-sm transition-all shadow-hover flex items-center space-x-2 group"
                >
                  <span>Explore All Products</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/category/laptops"
                  className="bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all"
                >
                  View Creator Laptops
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-slate-300">
                <div>
                  <p className="text-xl font-bold text-white">100%</p>
                  <p className="text-slate-400">Authentic Brand Tech</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#FCA311]">₹1,999+</p>
                  <p className="text-slate-400">Free Express Shipping</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-white">2 Years</p>
                  <p className="text-slate-400">Standard Warranty</p>
                </div>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-gradient-to-tr from-white/10 to-white/5 rounded-3xl p-6 backdrop-blur-xl border border-white/15 shadow-2xl">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-5 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
                    alt="Featured AeroBook Pro 16 Max"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#FCA311] text-slate-900 text-xs font-black px-2.5 py-1 rounded-md">
                    FLAGSHIP SPOTLIGHT
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#FCA311] font-bold tracking-wider uppercase">
                      NovaTech Systems
                    </span>
                    <span className="text-xs text-slate-300">16-Core Ultra 9</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    AeroBook Pro 16 Max (OLED 120Hz)
                  </h3>
                  <div className="flex items-baseline justify-between pt-2">
                    <div>
                      <span className="text-2xl font-black text-white">₹1,39,999</span>
                      <span className="text-xs text-slate-400 line-through ml-2">₹1,59,999</span>
                    </div>
                    <Link
                      to="/products/aerobook-pro-16-max"
                      className="text-xs font-bold text-[#FCA311] hover:underline flex items-center"
                    >
                      <span>Specifications</span>
                      <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#FCA311] tracking-widest uppercase">
              Curated Catalogs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-[#14213D] hover:text-[#233862] flex items-center space-x-1"
          >
            <span>All Categories</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-card hover:border-gray-200 flex flex-col items-center text-center"
            >
              <div className="w-full h-32 rounded-xl overflow-hidden mb-3.5 bg-slate-50 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#14213D] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {cat.productCount ? `${cat.productCount} Products` : 'Browse gear'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Deal of the Day Special Offer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14213D] text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-[#FCA311] text-slate-900 px-3 py-1 rounded-full text-xs font-black">
                <Flame size={14} className="fill-slate-900" />
                <span>DEAL OF THE DAY</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                CyberStrike Pro Wireless Keyboard — Save 25% Today
              </h2>

              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Gasket-mounted linear cream switches, CNC knob, and tri-mode 2.4GHz wireless connectivity. Hand-lubricated switches for typing perfection.
              </p>

              {/* Countdown Timer */}
              <div className="flex items-center space-x-3 pt-2">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={14} /> Ends in:
                </span>
                <div className="flex items-center space-x-2 text-center font-mono">
                  <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    <span className="text-lg font-bold text-[#FCA311]">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] text-slate-300 uppercase">Hours</span>
                  </div>
                  <span className="text-[#FCA311] font-bold">:</span>
                  <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    <span className="text-lg font-bold text-[#FCA311]">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] text-slate-300 uppercase">Mins</span>
                  </div>
                  <span className="text-[#FCA311] font-bold">:</span>
                  <div className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                    <span className="text-lg font-bold text-[#FCA311]">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="block text-[9px] text-slate-300 uppercase">Secs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline space-x-4 pt-2">
                <span className="text-3xl font-black text-white">₹8,999</span>
                <span className="text-base text-slate-400 line-through">₹11,999</span>
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                  Flat 25% Off
                </span>
              </div>

              <div className="pt-2">
                <Link
                  to="/products/cyberstrike-pro-wireless-mechanical-keyboard"
                  className="inline-flex items-center space-x-2 bg-[#FCA311] hover:bg-[#e5920b] text-slate-900 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-hover"
                >
                  <span>Claim Deal Now</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"
                  alt="CyberStrike Mechanical Keyboard"
                  className="w-full h-72 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Best Selling Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#FCA311] tracking-widest uppercase">
              Top Rated Hardware
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              <span>Best Selling Products</span>
              <Award size={24} className="text-[#FCA311]" />
            </h2>
          </div>
          <Link
            to="/products?sort=popularity"
            className="text-sm font-semibold text-[#14213D] hover:text-[#233862] flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Dual Promotional Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1: Gaming */}
          <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 bg-slate-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80"
              alt="Custom Gaming Rigs"
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="relative z-10 space-y-3 max-w-sm">
              <span className="text-xs font-bold text-[#FCA311] tracking-wider uppercase">
                Liquid Cooled Power
              </span>
              <h3 className="text-2xl font-black">Pre-built Gaming Rigs</h3>
              <p className="text-xs text-slate-300">
                Loaded with NVIDIA RTX 40-Series and Core i9 14th Gen. Tested under stress for pure 4K performance.
              </p>
              <Link
                to="/category/desktop-pcs"
                className="inline-flex items-center space-x-2 text-xs font-bold text-[#FCA311] hover:underline pt-2"
              >
                <span>Shop Gaming PCs</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Banner 2: Audio */}
          <div className="relative rounded-3xl overflow-hidden min-h-[260px] flex items-center p-8 bg-slate-900 text-white">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
              alt="Studio Audio"
              className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="relative z-10 space-y-3 max-w-sm">
              <span className="text-xs font-bold text-[#FCA311] tracking-wider uppercase">
                Audiophile Acoustics
              </span>
              <h3 className="text-2xl font-black">Studio-Grade ANC Sound</h3>
              <p className="text-xs text-slate-300">
                Beryllium acoustic drivers, 50-hour playback, and LDAC hi-res codecs for unmatched clarity.
              </p>
              <Link
                to="/category/headphones-and-speakers"
                className="inline-flex items-center space-x-2 text-xs font-bold text-[#FCA311] hover:underline pt-2"
              >
                <span>Discover Audio Gear</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#FCA311] tracking-widest uppercase">
              Fresh Drops
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 flex items-center gap-2">
              <span>New Arrivals</span>
              <Sparkles size={22} className="text-[#FCA311]" />
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="text-sm font-semibold text-[#14213D] hover:text-[#233862] flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 7. Verified Customer Testimonials */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#FCA311] tracking-widest uppercase">
              Customer Trust
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
              Loved by Engineers, Creators & Gamers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-subtle space-y-3">
              <div className="flex text-[#FCA311]">
                {'★★★★★'}
              </div>
              <p className="text-sm text-gray-600 italic">
                "Purchased the AeroBook Pro 16 Max. Delivery arrived in 48 hours to Mumbai with triple bubble packaging. Build quality and thermal efficiency are second to none."
              </p>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">Arjun Nair</p>
                <p className="text-xs text-gray-400">Software Architect, Bengaluru</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-subtle space-y-3">
              <div className="flex text-[#FCA311]">
                {'★★★★★'}
              </div>
              <p className="text-sm text-gray-600 italic">
                "The custom gaming PC arrived completely pre-configured and stress-tested. Cables were neat, BIOS was up to date, and frame rates in 4K are silky smooth."
              </p>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">Devika Sen</p>
                <p className="text-xs text-gray-400">3D Animator & Streamer</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-subtle space-y-3">
              <div className="flex text-[#FCA311]">
                {'★★★★★'}
              </div>
              <p className="text-sm text-gray-600 italic">
                "TechNova customer support assisted me in choosing the right Thunderbolt 4 dock for my dual-display setup. Truly professional service."
              </p>
              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-900">Karan Verma</p>
                <p className="text-xs text-gray-400">Creative Director, Delhi</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
