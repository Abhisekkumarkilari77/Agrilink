import React, { useState } from 'react';

const ProductImage = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    console.error(`Failed to load product image: ${src}`);
    setError(true);
  };

  if (error || !src) {
    return (
      <div className={`flex items-center justify-center bg-stone-100 text-stone-500 text-xs font-bold text-center p-2 select-none ${className}`} {...props}>
        No Image Available
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default ProductImage;
