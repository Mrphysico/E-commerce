import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-gray-100 p-8 sm:p-12 shadow-card space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center mx-auto text-[#14213D]">
          <Cpu size={40} className="text-[#14213D]" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-[#14213D] block">
            404
          </span>
          <h1 className="text-xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-xs text-gray-500 leading-relaxed">
            The hardware resource, category, or document you were looking for doesn't exist or has been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#14213D] hover:bg-[#233862] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-subtle"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-xs transition-colors"
          >
            <span>Browse Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
