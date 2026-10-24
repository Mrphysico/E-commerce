import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Check,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Plus,
  Minus,
  AlertCircle,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import Rating from '../components/common/Rating';
import ProductCard from '../components/common/ProductCard';
import { ProductDetailSkeleton } from '../components/common/Skeleton';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gallery state
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'desc' | 'reviews'

  // Review form state
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${identifier}`);
        if (res.data.success) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
          setReviews(res.data.reviews || []);
          if (res.data.product.images?.length > 0) {
            setActiveImage(res.data.product.images[0]);
          }
          setQuantity(1);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [identifier]);

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-2xl border border-gray-100 shadow-subtle">
        <AlertCircle size={40} className="mx-auto text-rose-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The requested electronic item may have been discontinued or moved.
        </p>
        <Link
          to="/products"
          className="inline-block bg-[#14213D] text-white px-6 py-2.5 rounded-xl font-semibold text-sm"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    const ok = await addToCart(product, quantity);
    if (ok) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    if (isOutOfStock) return;
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      return navigate('/login');
    }
    setReviewSubmitting(true);
    setReviewError(null);

    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating: ratingInput,
        title: titleInput,
        comment: commentInput,
      });

      if (res.data.success) {
        setReviewSuccess(true);
        setReviews([res.data.review, ...reviews]);
        setTitleInput('');
        setCommentInput('');
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Convert specifications Map/Object into array for rendering
  const specEntries = product.specifications
    ? Object.entries(
        typeof product.specifications.toJSON === 'function'
          ? product.specifications.toJSON()
          : product.specifications
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Trail */}
      <nav className="text-xs text-gray-500 flex items-center space-x-2">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-gray-900">Products</Link>
        <span>/</span>
        <Link to={`/category/${product.categorySlug}`} className="hover:text-gray-900 capitalize">
          {product.categorySlug?.replace(/-/g, ' ')}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Gallery (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-subtle flex items-center justify-center p-4">
            <img
              src={activeImage || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-[#FCA311] text-slate-900 text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images?.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImage === img ? 'border-[#14213D] shadow-sm' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-16 h-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Actions (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FCA311] bg-amber-50 px-2.5 py-1 rounded-md">
                {product.brand}
              </span>
              <span className="text-xs text-gray-400 font-mono">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Stock Status */}
            <div className="flex flex-wrap items-center gap-4 mt-3 pt-2">
              <Rating
                value={product.ratings?.average || 4.5}
                count={product.ratings?.count || 12}
                size="md"
              />
              <span className="text-gray-300">•</span>
              {isOutOfStock ? (
                <span className="text-rose-600 bg-rose-50 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                  Out of Stock
                </span>
              ) : (
                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  In Stock ({product.stock} units available)
                </span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-baseline space-x-4">
            <span className="text-3xl sm:text-4xl font-black text-gray-900">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-base text-gray-400 line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
            {product.discount > 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100/60 px-2.5 py-1 rounded-md">
                Save ₹{(product.originalPrice - product.price).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Key Description Teaser */}
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-bold uppercase text-gray-500">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center text-sm font-bold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock || isOutOfStock}
                  className="p-2.5 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 min-w-[160px] py-3.5 px-6 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-subtle ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : addedNotice
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#14213D] hover:bg-[#233862] text-white active:scale-95'
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check size={18} />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 min-w-[160px] py-3.5 px-6 rounded-xl font-bold text-sm bg-[#FCA311] hover:bg-[#e5920b] text-slate-900 flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-subtle disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap size={18} className="fill-slate-900" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${
                  isWishlisted ? 'text-red-500 bg-red-50 border-red-200' : 'text-gray-600'
                }`}
                title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Truck size={18} className="text-[#14213D] flex-shrink-0" />
              <span>Free Delivery in 48-72h</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck size={18} className="text-[#14213D] flex-shrink-0" />
              <span>Official Warranty</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw size={18} className="text-[#14213D] flex-shrink-0" />
              <span>7-Day Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-subtle overflow-hidden">
        <div className="flex border-b border-gray-100 bg-gray-50/50">
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'specs'
                ? 'border-[#14213D] text-[#14213D] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Technical Specifications
          </button>
          <button
            onClick={() => setActiveTab('desc')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'desc'
                ? 'border-[#14213D] text-[#14213D] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-[#14213D] text-[#14213D] bg-white'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Customer Reviews ({reviews.length})
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Specifications Tab */}
          {activeTab === 'specs' && (
            <div className="max-w-3xl">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Hardware & Technical Specifications
              </h3>
              {specEntries.length > 0 ? (
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {specEntries.map(([key, value], idx) => (
                    <div
                      key={key}
                      className={`grid grid-cols-1 sm:grid-cols-3 p-3.5 text-xs sm:text-sm ${
                        idx % 2 === 0 ? 'bg-gray-50/60' : 'bg-white'
                      }`}
                    >
                      <span className="font-semibold text-gray-700">{key}</span>
                      <span className="sm:col-span-2 text-gray-600 mt-0.5 sm:mt-0">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Standard manufacturer specifications apply.</p>
              )}
            </div>
          )}

          {/* Description Tab */}
          {activeTab === 'desc' && (
            <div className="max-w-3xl space-y-4 text-sm text-gray-700 leading-relaxed">
              <h3 className="text-lg font-bold text-gray-900">About this Product</h3>
              <p>{product.description}</p>
              <p>
                Each TechNova hardware unit is thoroughly tested for performance benchmarks, thermal dissipation under sustained workloads, and component reliability before dispatch.
              </p>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Write Review Section */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 max-w-xl">
                <h4 className="font-bold text-gray-900 text-sm mb-3">
                  Write a Verified Customer Review
                </h4>

                {user ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Your Rating
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setRatingInput(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              size={22}
                              className={
                                s <= ratingInput
                                  ? 'fill-[#FCA311] text-[#FCA311]'
                                  : 'text-gray-300'
                              }
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Blown away by the performance!"
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#14213D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">
                        Detailed Review
                      </label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Share your experience regarding build quality, display, speed, or battery..."
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#14213D]"
                      />
                    </div>

                    {reviewError && (
                      <p className="text-xs text-rose-600 font-medium">{reviewError}</p>
                    )}
                    {reviewSuccess && (
                      <p className="text-xs text-emerald-600 font-medium">
                        Thank you! Your review has been recorded.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="bg-[#14213D] hover:bg-[#233862] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                ) : (
                  <p className="text-xs text-gray-500">
                    Please{' '}
                    <Link to="/login" className="text-[#14213D] font-bold underline">
                      sign in
                    </Link>{' '}
                    to leave a product review.
                  </p>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-4 max-w-2xl">
                <h4 className="font-bold text-gray-900 text-sm">Customer Feedback</h4>
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev._id}
                      className="p-4 rounded-xl border border-gray-100 bg-white space-y-2 shadow-subtle"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">
                          {rev.userName || 'Verified Buyer'}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Rating value={rev.rating} size="sm" showScore={false} />
                      {rev.title && (
                        <p className="font-semibold text-xs text-gray-900">{rev.title}</p>
                      )}
                      <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {related.length > 0 && (
        <section className="space-y-6 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold text-[#FCA311] uppercase tracking-wider">
                Similar Category
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/category/${product.categorySlug}`}
              className="text-xs font-semibold text-[#14213D] hover:underline"
            >
              View More &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;
