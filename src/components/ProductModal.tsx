import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { storage } from '../utils/storage';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onBuyNow: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose, onBuyNow }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      const sizes = product.size.split(',').map(s => s.trim());
      setSelectedSize(sizes[0]);
      setQuantity(1);
      
      const favorites = storage.getFavorites();
      setIsFavorite(favorites.includes(product.code));
    }
  }, [product, isOpen]);

  if (!product || !isOpen) return null;

  const sizes = product.size.split(',').map(s => s.trim());

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleFavorite = () => {
    const favorites = storage.getFavorites();
    const index = favorites.indexOf(product.code);
    
    if (index === -1) {
      favorites.push(product.code);
    } else {
      favorites.splice(index, 1);
    }
    
    storage.setFavorites(favorites);
    setIsFavorite(!isFavorite);
  };

  const addToCart = () => {
    if (!selectedSize) return;

    const cartItem: CartItem = {
      name: product.name,
      price: product.price,
      code: product.code,
      size: selectedSize,
      quantity,
      image: product.image,
      unisex: product.unisex,
      max: product.stock,
      originalIndex: product.originalIndex,
    };

    const cart = storage.getCart();
    const existingIndex = cart.findIndex(
      item => item.name === cartItem.name && item.size === cartItem.size
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    storage.setCart(cart);
    window.dispatchEvent(new Event('cartUpdated'));
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart();
    setTimeout(() => {
      onClose();
      onBuyNow();
    }, 100);
  };

  return (
    <>
      {/* Success notification */}
      {showSuccess && (
        <div className="fixed top-20 right-[32%] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl shadow-lg z-[10001] flex items-center gap-2 animate-fade-in">
          <i className="fas fa-check-circle text-2xl text-green-600"></i>
          <h1 className="text-sm font-semibold">Successful!</h1>
        </div>
      )}

      {/* Modal overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center fade-in"
        onClick={onClose}
      >
        {/* Modal content */}
        <div
          className="bg-white w-full h-full relative flex flex-col p-2.5 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top icons */}
          <div className="flex justify-between p-2.5">
            <button
              onClick={onClose}
              className="bg-black text-white border-none rounded px-2.5 py-1 text-lg cursor-pointer hover:bg-gray-800"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <button
              onClick={toggleFavorite}
              className="bg-black text-white border-none rounded px-2.5 py-1 text-lg cursor-pointer hover:bg-gray-800"
            >
              <i className={isFavorite ? 'fas fa-heart' : 'far fa-heart'}></i>
            </button>
          </div>

          {/* Product image */}
          <div className="flex justify-center my-5">
            <img
              src={product.image}
              alt={product.name}
              className="w-1/2 max-w-[150px] h-auto object-contain"
            />
          </div>

          {/* Product info */}
          <div className="px-2.5 text-left">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold m-0">{product.name}</h2>
              <p className="text-xl font-bold text-black m-0">
                ৳{product.price.toFixed(2)}
              </p>
            </div>
            <p className="my-1 text-sm text-gray-600">{product.unisex}</p>
          </div>

          {/* Description */}
          <div className="p-2.5 bg-white shadow-inner rounded-md text-sm leading-relaxed text-gray-800 flex-grow overflow-y-auto max-h-[25vh] my-2.5">
            <h2 className="text-base font-semibold mb-2.5 text-black">Description</h2>
            <p>{product.description}</p>
          </div>

          {/* Size and quantity */}
          <div className="flex justify-between items-center px-4 py-3">
            {/* Size selection */}
            <div className="flex gap-2.5">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-auto h-10 rounded border-2 text-sm font-semibold px-2 cursor-pointer transition-colors ${
                    selectedSize === size
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white text-black border-black hover:bg-gray-100'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Quantity selection */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 cursor-pointer flex justify-center items-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-minus text-sm"></i>
              </button>
              <span className="text-base font-semibold min-w-[32px] text-center">
                {quantity.toString().padStart(2, '0')}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
                className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 cursor-pointer flex justify-center items-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-plus text-sm"></i>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col items-center gap-2.5 m-4">
            <button
              onClick={handleBuyNow}
              className="bg-white text-black border-4 border-black rounded-3xl px-2.5 py-2.5 text-base font-semibold uppercase cursor-pointer max-w-[300px] w-full hover:bg-black hover:text-white transition-colors"
            >
              Buy Now
            </button>
            <button
              onClick={addToCart}
              className="bg-black text-white border-none rounded-3xl px-2.5 py-3.5 text-base font-semibold uppercase cursor-pointer max-w-[300px] w-full hover:bg-gray-700 transition-colors"
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
