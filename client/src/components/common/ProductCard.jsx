import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Check, Zap } from 'lucide-react';
import Rating from './Rating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [added, setAdded] = useState(false);

  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const success = await addToCart(product, 1);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    }
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const displayImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 p-4 transition-all duration-300 hover:shadow-hover hover:border-gray-200 flex flex-col justify-between">
      {/* Image Container & Floating Badges */}
      <div className="relative w-full h-52 bg-slate-50 rounded-xl overflow-hidden mb-3">
        <Link to={`/products/${product.slug || product._id}`}>
          <img
            src={displayImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:bg-white hover:scale-110 active:scale-95"
        >
          <Heart
            size={18}
            className={`${
              isWishlisted
                ? 'fill-red-500 text-red-500'
                : 'text-gray-600 hover:text-red-500'
            } transition-colors`}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discount > 0 && (
            <span className="bg-[#FCA311] text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#14213D] text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
              <Zap size={10} className="fill-[#FCA311] text-[#FCA311]" />
              BESTSELLER
            </span>
          )}
        </div>

        {/* Stock Alert Badge */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2 left-2">
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium px-2 py-0.5 rounded-md">
              Only {product.stock} left
            </span>
          </div>
        ) : null}
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-semibold text-gray-700 tracking-wider uppercase text-[11px]">
            {product.brand}
          </span>
          <span className="text-gray-400 capitalize text-[11px]">
            {product.categorySlug?.replace(/-/g, ' ')}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/products/${product.slug || product._id}`}
          className="text-sm font-semibold text-gray-900 hover:text-[#14213D] transition-colors line-clamp-2 mb-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Ratings */}
        <div className="mb-3">
          <Rating
            value={product.ratings?.average || 4.5}
            count={product.ratings?.count || 12}
            size="sm"
          />
        </div>

        {/* Price & Add to Cart action */}
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.discount > 0 && (
              <span className="text-[10px] font-medium text-emerald-600 block">
                Save ₹{((product.originalPrice || product.price * 1.1) - product.price).toFixed(0)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 text-white'
                : 'bg-[#14213D] hover:bg-[#233862] text-white hover:scale-105 active:scale-95 shadow-subtle'
            }`}
            title={isOutOfStock ? 'Out of stock' : 'Add to cart'}
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
