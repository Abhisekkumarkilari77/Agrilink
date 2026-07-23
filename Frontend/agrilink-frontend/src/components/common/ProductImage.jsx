import React, { useState } from 'react';
import { getAccurateProductImage } from '../../utils/productImageHelper';

const ProductImage = ({ src, alt, name, category, className, ...props }) => {
  const [error, setError] = useState(false);

  const finalSrc = getAccurateProductImage(name || alt, category, src);

  const handleError = () => {
    console.error(`Failed to load product image: ${finalSrc}`);
    setError(true);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-stone-100 text-stone-500 text-xs font-bold text-center p-2 select-none ${className}`} {...props}>
        🌿 AgriLink Farm Fresh
      </div>
    );
  }

  return (
    <img
      src={finalSrc}
      alt={alt || name}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ProductImage;
