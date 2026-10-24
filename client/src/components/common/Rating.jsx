import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value = 0, count, size = 'sm', showScore = true }) => {
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const ratingVal = Number(value) || 0;

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center text-[#FCA311]">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = ratingVal >= star;
          const half = !filled && ratingVal >= star - 0.5;

          return (
            <Star
              key={star}
              size={iconSize}
              className={`${
                filled
                  ? 'fill-[#FCA311] text-[#FCA311]'
                  : half
                  ? 'fill-[#FCA311]/50 text-[#FCA311]'
                  : 'text-gray-300'
              } transition-colors`}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-gray-700 ml-1">
          {ratingVal.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-xs text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
};

export default Rating;
