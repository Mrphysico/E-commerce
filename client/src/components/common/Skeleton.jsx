import React from 'react';

export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-subtle p-4 animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
    <div className="h-5 bg-gray-200 rounded w-4/5 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-1/3" />
      <div className="h-9 bg-gray-200 rounded-lg w-24" />
    </div>
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="w-full h-[450px] bg-gray-200 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded w-1/2" />
        <div className="h-24 bg-gray-200 rounded w-full" />
        <div className="h-12 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
