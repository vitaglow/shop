import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import doneGif from '../assets/done.gif';

const Done: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('id') || '';
  const name = searchParams.get('name') || '';
  const phone = searchParams.get('phone') || '';
  const shipping = searchParams.get('ship') || '0';
  const price = searchParams.get('price') || '0';
  const discount = searchParams.get('dis') || '0';
  const total = searchParams.get('total') || '0';

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-5">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <img src={doneGif} alt="Success" className="w-32 h-32 mx-auto" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Successful!</h1>
        <p className="text-gray-600 mb-6">Thank you for your order</p>

        {/* Order Details */}
        <div className="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h2 className="font-bold text-lg mb-3 text-center">Order Details</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-semibold">{orderId}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold">{name}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-semibold">{phone}</span>
            </div>

            <div className="border-t border-gray-300 my-3"></div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>৳{price}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span>৳{shipping}</span>
            </div>
            
            <div className="flex justify-between text-green-600">
              <span className="font-semibold">Discount:</span>
              <span className="font-semibold">- ৳{discount}</span>
            </div>

            <div className="border-t border-gray-300 my-3"></div>
            
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600">৳{total}</span>
            </div>
          </div>
        </div>

        {/* Info Message */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-6">
          <p className="text-pink-800 text-sm">
            🛍 VitaGlow team will contact you within six hours!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(`/orderlist?phone=${phone}`)}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Track Your Order
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full bg-white text-black border-2 border-black py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Continue Shopping
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Redirecting to home page in 10 seconds...
        </p>
      </div>
    </div>
  );
};

export default Done;
