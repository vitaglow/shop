import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 2;

  const getStockLabel = () => {
    if (isOutOfStock) return 'Out of Stock';
    if (isLowStock) return 'Low Stock';
    return product.size;
  };

  const getStockColor = () => {
    if (isOutOfStock) return 'text-red-600';
    if (isLowStock) return 'text-orange-500';
    return 'text-green-600';
  };

  return (
    <div
      className={`fade-in rounded-3xl p-2.5 shadow-lg mb-7 ${
        isOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl transition-shadow'
      }`}
      onClick={!isOutOfStock ? onClick : undefined}
    >
      <div className="relative inline-block w-full">
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-[175px] h-[175px] object-cover rounded-lg mx-auto"
          loading="lazy"
        />
        <span className="absolute bottom-2.5 left-2.5 bg-gray-600 text-white px-2.5 py-1 text-xs font-semibold rounded">
          {product.unisex}
        </span>
      </div>
      
      <h2 className="text-lg font-semibold mt-2.5">{product.name}</h2>
      <p className={`text-base font-semibold ${getStockColor()}`}>
        {getStockLabel()}
      </p>
      <p className="text-xl font-bold mt-1">
        {product.price === 0 ? 'Free' : `৳${product.price.toFixed(2)}`}
      </p>
    </div>
  );
};

export default ProductCard;
