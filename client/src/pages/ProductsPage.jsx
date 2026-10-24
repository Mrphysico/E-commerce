import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, SlidersHorizontal, RotateCcw, Search } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filters state from URL query
  const categoryParam = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || 'all';
  const sortParam = searchParams.get('sort') || 'newest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const searchKeyword = searchParams.get('search') || '';

  // Local filter inputs
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [selectedSort, setSelectedSort] = useState(sortParam);
  const [minPrice, setMinPrice] = useState(minPriceParam);
  const [maxPrice, setMaxPrice] = useState(maxPriceParam);
  const [inStockOnly, setInStockOnly] = useState(inStockParam);
  const [searchInput, setSearchInput] = useState(searchKeyword);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch filter options (categories, brands) on mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/brands'),
        ]);
        if (catRes.data.success) setCategories(catRes.data.categories);
        if (brandRes.data.success) setBrands(brandRes.data.brands);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    fetchOptions();
  }, []);

  // Fetch products whenever search params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        if (!params.get('limit')) params.set('limit', '12');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products);
          setTotalPages(res.data.pages || 1);
          setTotalProducts(res.data.total || 0);
          setPage(res.data.page || 1);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  // Sync state with URL
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSelectedBrand(searchParams.get('brand') || 'all');
    setSelectedSort(searchParams.get('sort') || 'newest');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setInStockOnly(searchParams.get('inStock') === 'true');
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const applyFilters = (customParams = {}) => {
    const params = new URLSearchParams(searchParams);

    const newCategory = customParams.category !== undefined ? customParams.category : selectedCategory;
    const newBrand = customParams.brand !== undefined ? customParams.brand : selectedBrand;
    const newSort = customParams.sort !== undefined ? customParams.sort : selectedSort;
    const newMin = customParams.minPrice !== undefined ? customParams.minPrice : minPrice;
    const newMax = customParams.maxPrice !== undefined ? customParams.maxPrice : maxPrice;
    const newInStock = customParams.inStock !== undefined ? customParams.inStock : inStockOnly;
    const newSearch = customParams.search !== undefined ? customParams.search : searchInput;

    if (newCategory && newCategory !== 'all') params.set('category', newCategory);
    else params.delete('category');

    if (newBrand && newBrand !== 'all') params.set('brand', newBrand);
    else params.delete('brand');

    if (newSort) params.set('sort', newSort);

    if (newMin) params.set('minPrice', newMin);
    else params.delete('minPrice');

    if (newMax) params.set('maxPrice', newMax);
    else params.delete('maxPrice');

    if (newInStock) params.set('inStock', 'true');
    else params.delete('inStock');

    if (newSearch) params.set('search', newSearch);
    else params.delete('search');

    params.set('page', '1'); // Reset to page 1 on filter
    setSearchParams(params);
    setMobileFilterOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedSort('newest');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters =
    categoryParam !== 'all' ||
    brandParam !== 'all' ||
    minPriceParam ||
    maxPriceParam ||
    inStockParam ||
    searchKeyword;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header and Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {categoryParam !== 'all'
              ? categories.find((c) => c.slug === categoryParam)?.name || 'Electronics'
              : 'All Electronics'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Showing <strong className="text-gray-900">{totalProducts}</strong> verified products
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50"
          >
            <SlidersHorizontal size={16} />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500 hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                applyFilters({ sort: e.target.value });
              }}
              className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:border-[#14213D]"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="popularity">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 py-4">
          <span className="text-xs font-semibold text-gray-400">Active Filters:</span>
          {categoryParam !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 bg-[#14213D] text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <span>{categoryParam.replace(/-/g, ' ')}</span>
              <button onClick={() => applyFilters({ category: 'all' })}>
                <X size={12} />
              </button>
            </span>
          )}
          {brandParam !== 'all' && (
            <span className="inline-flex items-center space-x-1.5 bg-[#14213D] text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <span>{brandParam}</span>
              <button onClick={() => applyFilters({ brand: 'all' })}>
                <X size={12} />
              </button>
            </span>
          )}
          {searchKeyword && (
            <span className="inline-flex items-center space-x-1.5 bg-[#14213D] text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <span>"{searchKeyword}"</span>
              <button onClick={() => applyFilters({ search: '' })}>
                <X size={12} />
              </button>
            </span>
          )}
          {inStockParam && (
            <span className="inline-flex items-center space-x-1.5 bg-emerald-700 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              <span>In Stock Only</span>
              <button onClick={() => applyFilters({ inStock: false })}>
                <X size={12} />
              </button>
            </span>
          )}
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1 ml-2"
          >
            <RotateCcw size={12} />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
              <Filter size={18} />
              <span>Filter Products</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Reset
              </button>
            )}
          </div>

          {/* Search within page */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Keywords
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. OLED, RTX, 32GB..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#14213D]"
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Category List */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Category
            </label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => applyFilters({ category: 'all' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryParam === 'all'
                    ? 'bg-[#14213D] text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => applyFilters({ category: c.slug })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                    categoryParam === c.slug
                      ? 'bg-[#14213D] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.productCount !== undefined && (
                    <span className="text-[10px] opacity-75">({c.productCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Brand
            </label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => applyFilters({ brand: 'all' })}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                  brandParam === 'all'
                    ? 'bg-[#14213D] text-white font-bold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Brands
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  onClick={() => applyFilters({ brand: b })}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium ${
                    brandParam.toLowerCase() === b.toLowerCase()
                      ? 'bg-[#14213D] text-white font-bold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Price Range (₹)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2 p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2 p-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="pt-2 border-t border-gray-100">
            <label className="flex items-center space-x-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  applyFilters({ inStock: e.target.checked });
                }}
                className="rounded text-[#14213D] focus:ring-[#14213D] w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          <button
            onClick={() => applyFilters()}
            className="w-full bg-[#14213D] hover:bg-[#233862] text-white py-2.5 rounded-xl font-bold text-xs transition-colors shadow-subtle"
          >
            Apply Filters
          </button>
        </aside>

        {/* Product Cards Grid & Empty/Loading States */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No electronics found"
              description="No products match your selected filters. Try broadening your search or resetting filters."
              actionText="Reset All Filters"
              actionLink="#"
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-12">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    &larr; Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                    <button
                      key={pNum}
                      onClick={() => handlePageChange(pNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                        page === pNum
                          ? 'bg-[#14213D] text-white shadow-subtle'
                          : 'border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next &rarr;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 lg:hidden backdrop-blur-sm">
          <div className="w-4/5 max-w-sm bg-white h-full ml-auto p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 text-base">Filter Products</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={handleClearFilters}
                className="w-1/2 py-2.5 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
              >
                Reset
              </button>
              <button
                onClick={() => applyFilters()}
                className="w-1/2 py-2.5 bg-[#14213D] text-white rounded-xl text-xs font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
