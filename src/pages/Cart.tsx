import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { CartItem, Coupon } from '../types';
import { storage } from '../utils/storage';
import { API_ENDPOINTS, SPREADSHEET_IDS } from '../utils/api';
import { parseCSV } from '../utils/helpers';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupons, setCoupons] = useState<Record<string, Coupon>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadCart();
    fetchCoupons();
  }, []);

  const loadCart = () => {
    const cart = storage.getCart();
    // Ensure quantities don't exceed max stock
    const validatedCart = cart.map(item => ({
      ...item,
      quantity: Math.min(item.quantity, item.max),
    }));
    setCartItems(validatedCart);
  };

  const fetchCoupons = async () => {
    try {
      const url = `${API_ENDPOINTS.dgistart}/${SPREADSHEET_IDS.coupons}/gviz/tq?tqx=out:csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      
      const rows = parseCSV(csvText);
      const couponData = rows.slice(3).reduce((acc, row) => {
        const code = row[0];
        const discountValue = parseFloat(row[1]);
        const discountType = row[2];
        
        if (code) {
          acc[code] = { discountValue, discountType };
        }
        
        return acc;
      }, {} as Record<string, Coupon>);
      
      setCoupons(couponData);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = [...cartItems];
    const item = newCart[index];
    const newQuantity = item.quantity + delta;

    if (newQuantity < 1) {
      removeItem(index);
      return;
    }

    if (newQuantity <= item.max) {
      item.quantity = newQuantity;
      setCartItems(newCart);
      storage.setCart(newCart);
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (index: number) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    storage.setCart(newCart);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    
    if (!code) {
      alert('Please enter a coupon code.');
      return;
    }

    const coupon = coupons[code];
    if (!coupon) {
      alert('Invalid coupon code.');
      return;
    }

    const subtotal = calculateSubtotal();
    let discountAmount = 0;

    if (coupon.discountType === 'BDT') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === '%') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    }

    setDiscount(discountAmount);
    setAppliedCoupon(code);
    storage.setCoupon(discountAmount.toString());
    storage.setPromo(code);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
        : item.price || 0;
      return sum + (price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header showBackButton onBackClick={() => navigate('/')} />

      <div className="flex-grow pt-20 pb-5">
        {/* Cart items */}
        <div className="px-5">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              Your cart is empty. <a href="/" className="text-blue-600 hover:underline">Continue shopping</a>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const price = typeof item.price === 'string'
                ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
                : item.price || 0;
              const itemTotal = price * item.quantity;

              return (
                <div
                  key={index}
                  className="flex items-center bg-white p-3 rounded-lg mb-3 border border-gray-200 shadow-sm relative gap-2"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[70px] h-[70px] object-cover rounded flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base truncate">{item.name}</div>
                    <div className="text-sm text-gray-600">{price}৳</div>
                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                    <div className="text-sm text-gray-600">Brand: {item.unisex}</div>
                  </div>

                  <div className="flex flex-col items-center gap-2 mr-10">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95"
                      >
                        <i className="fas fa-minus text-sm"></i>
                      </button>
                      <span className="min-w-[30px] text-center font-medium">
                        {item.quantity.toString().padStart(2, '0')}
                      </span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        disabled={item.quantity >= item.max}
                        className="w-8 h-8 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-plus text-sm"></i>
                      </button>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      Total: {itemTotal.toFixed(2)}৳
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(index)}
                    className="absolute top-3 right-3 bg-red-500 text-white w-7 h-7 rounded-sm flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Footer with coupon and checkout */}
      <footer className="sticky bottom-0 bg-white border-t border-gray-200 p-5 shadow-lg">
        {/* Coupon input */}
        {!appliedCoupon && (
          <div className="mb-2.5 relative">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Add coupon here.."
              className="w-[90%] p-2.5 border-2 border-black rounded-3xl outline-none"
            />
            <button
              onClick={applyCoupon}
              className="absolute right-0 h-full aspect-square bg-black text-white rounded-full border-none hover:bg-gray-800 active:bg-white active:text-black active:border-2 active:border-black transition-colors"
            >
              +
            </button>
          </div>
        )}

        {appliedCoupon && (
          <div className="mb-2.5">
            <input
              type="text"
              value={`Coupon applied - ${appliedCoupon} | discount ${
                coupons[appliedCoupon]?.discountValue
              } ${coupons[appliedCoupon]?.discountType}`}
              readOnly
              className="w-full p-2.5 border-2 border-white rounded-3xl outline-none font-bold text-green-600"
            />
          </div>
        )}

        {discount > 0 && (
          <p className="text-sm text-right mb-1 text-gray-600">
            Subtotal: <span>{subtotal.toFixed(2)}৳</span>
          </p>
        )}
        
        {discount > 0 && (
          <p className="text-sm text-right mb-1 text-green-600 font-semibold">
            Discount: <span>- {discount.toFixed(2)}৳</span>
          </p>
        )}

        <p className="text-lg font-medium text-right mb-4">
          {discount > 0 ? 'Total' : 'Subtotal'}: <span>{Math.max(0, subtotal - discount).toFixed(2)}৳</span>
        </p>
        
        <button
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
          className="w-full py-3 bg-black text-white rounded-3xl text-base font-semibold uppercase hover:bg-gray-800 active:scale-98 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          CHECKOUT
        </button>
      </footer>
    </div>
  );
};

export default Cart;
