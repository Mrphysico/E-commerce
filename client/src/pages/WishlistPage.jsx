import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';
import Rating from '../components/common/Rating';

const WishlistPage = () => {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    await toggleWishlist(product);
    await addToCart(product, 1);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Explore our cutting-edge laptops, GPUs, monitors, and audio hardware and click the heart icon to save your favorite gear."
          actionText="Discover Products"
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
            My Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            You have <strong className="text-gray-900">{wishlist.length}</strong> saved items
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-semibold text-[#14213D] hover:underline"
        >
          Browse More &rarr;
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => {
          const isOutOfStock = product.stock <= 0;
          const image =
            product.images?.[0] ||
            'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

          return (
            <div
              key={product._id}
              className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-subtle hover:shadow-hover transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-50 mb-3">
                <Link to={`/products/${product.slug || product._id}`}>
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-rose-500 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} />
                </button>

                {isOutOfStock && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
                    <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-semibold px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    {product.brand}
                  </span>
                  <Link
                    to={`/products/${product.slug || product._id}`}
                    className="text-sm font-bold text-gray-900 hover:text-[#14213D] line-clamp-2 mt-0.5 leading-snug"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-1.5 mb-2">
                    <Rating value={product.ratings?.average || 4.5} size="sm" />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-base font-bold text-gray-900 block">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{product.originalPrice?.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={isOutOfStock}
                    className="bg-[#14213D] hover:bg-[#233862] text-white text-xs font-semibold px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-subtle"
                  >
                    <ShoppingCart size={14} />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
