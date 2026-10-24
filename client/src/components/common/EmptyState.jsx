import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';

const EmptyState = ({
  icon: Icon = ShoppingBag,
  title = 'No items found',
  description = 'Looks like there is nothing here yet.',
  actionText = 'Explore Products',
  actionLink = '/products',
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-md mx-auto my-12 shadow-subtle">
      <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#14213D]">
        <Icon size={32} className="text-[#14213D]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 bg-[#14213D] hover:bg-[#233862] text-white px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-subtle hover:shadow-card"
        >
          <span>{actionText}</span>
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
