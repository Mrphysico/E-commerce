import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';

const CategoriesPage = () => {
  const { slug } = useParams();
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await api.get('/categories');
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }

        if (slug) {
          const [catDetailRes, prodRes] = await Promise.all([
            api.get(`/categories/${slug}`),
            api.get(`/products?category=${slug}&limit=20`),
          ]);
          if (catDetailRes.data.success) setCurrentCategory(catDetailRes.data.category);
          if (prodRes.data.success) setCategoryProducts(prodRes.data.products);
        }
      } catch (err) {
        console.error('Failed to load categories data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // If specific category is viewed (`/category/:slug`)
  if (slug) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <nav className="text-xs text-gray-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-gray-900">Home</Link>
          <span>/</span>
          <Link to="/categories" className="hover:text-gray-900">Categories</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{currentCategory?.name || slug}</span>
        </nav>

        {/* Category Header Hero */}
        <div className="bg-[#14213D] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCA311] bg-white/10 px-3 py-1 rounded-full">
              Electronics Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {currentCategory?.name || slug}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {currentCategory?.description || 'Browse high-performance electronics and computer hardware.'}
            </p>
          </div>
        </div>

        {/* Products in this category */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Available Gear ({categoryProducts.length})
            </h2>
            <Link
              to={`/products?category=${slug}`}
              className="text-xs font-semibold text-[#14213D] hover:underline"
            >
              Advanced Filtering &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8">
              <p className="text-gray-500 text-sm">No products currently listed in this category.</p>
              <Link to="/products" className="inline-block mt-4 text-xs font-bold text-[#14213D] underline">
                Browse All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categoryProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // All Categories view (`/categories`)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FCA311]">
          Explore Every Category
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Hardware & Electronics Catalogs
        </h1>
        <p className="text-sm text-gray-500">
          From ultra-fast gaming laptops and ray tracing GPUs to studio acoustics and peripherals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 p-5 transition-all duration-300 hover:shadow-hover hover:border-gray-200 flex flex-col justify-between"
          >
            <div className="w-full h-44 rounded-xl overflow-hidden mb-4 bg-slate-50">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 group-hover:text-[#14213D] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-[#14213D] group-hover:text-[#FCA311] transition-colors">
                <span>{cat.productCount ? `${cat.productCount} Products` : 'Explore'}</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
