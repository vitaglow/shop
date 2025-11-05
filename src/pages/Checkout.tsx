import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { CartItem, CheckoutFormData } from '../types';
import { storage } from '../utils/storage';

const divisions: Record<string, string[]> = {
  Barishal: ['Barguna', 'Barishal', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  Chattogram: ['Bandarban', 'Brahmanbaria', 'Chandpur', 'Chattogram', "Cox's Bazar", 'Cumilla', 'Feni', 'Khagrachari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  Dhaka: ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  Khulna: ['Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Khulna', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  Mymensingh: ['Jamalpur', 'Mymensingh', 'Netrokona', 'Sherpur'],
  Rajshahi: ['Bogra', 'Chapainawabganj', 'Joypurhat', 'Naogaon', 'Natore', 'Pabna', 'Rajshahi', 'Sirajganj'],
  Rangpur: ['Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Rangpur', 'Thakurgaon'],
  Sylhet: ['Habiganj', 'Moulvibazar', 'Sunamganj', 'Sylhet'],
};

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    division: '',
    district: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const cart = storage.getCart();
    setCartItems(cart);
  }, []);

  const handleDivisionChange = (division: string) => {
    setFormData({ ...formData, division, district: '' });
    setDistricts(divisions[division] || []);
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const calculateShipping = (totalQuantity: number): number => {
    if (totalQuantity === 1 || totalQuantity === 2) return 70;
    if (totalQuantity === 3) return 90;
    if (totalQuantity === 4) return 120;
    if (totalQuantity === 5) return 150;
    if (totalQuantity === 6) return 165;
    return 200;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Please enter your phone number';
    } else if (!/^\+?(88)?01[3-9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Please enter your street address';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Please enter your town/city';
    }

    if (!formData.division) {
      newErrors.division = 'Please select a division';
    }

    if (!formData.district) {
      newErrors.district = 'Please select a district';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Calculate totals
    const subtotal = cartItems.reduce((sum, item) => {
      const price = typeof item.price === 'string'
        ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
        : item.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingCost = calculateShipping(totalQuantity);
    const discount = parseFloat(storage.getCoupon()) || 0;
    const promo = storage.getPromo();
    const totalSum = Math.round(subtotal + shippingCost - discount);

    const orderData = {
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: {
        street: formData.street,
        city: formData.city,
        division: formData.division,
        district: formData.district,
        country: 'Bangladesh',
      },
      products: cartItems.map(item => item.code).join('#'),
      quantities: cartItems.map(item => item.quantity).join('#'),
      totalQuantity,
      prices: cartItems.map(item => {
        const price = typeof item.price === 'string'
          ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
          : item.price || 0;
        return price * item.quantity;
      }).join('#'),
      sump: subtotal,
      sizes: cartItems.map(item => item.size || 'N/A').join('#'),
      shippingCost,
      discount,
      promo,
      totalSum,
      orderId: `ORD${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
    };

    storage.setOrder(orderData);
    navigate('/process');
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const price = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
      : item.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = calculateShipping(totalQuantity);
  const discount = parseFloat(storage.getCoupon()) || 0;
  const total = Math.round(subtotal + shippingCost - discount);

  return (
    <div className="min-h-screen bg-white pb-5">
      <Header showBackButton onBackClick={() => navigate('/cart')} />

      <div className="max-w-md mx-auto pt-20 px-5">
        {/* Cart items preview */}
        <div className="bg-gray-100 rounded-lg p-4 mt-5 flex flex-col items-center">
          {cartItems.map((item, index) => {
            const price = typeof item.price === 'string'
              ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0
              : item.price || 0;
            
            return (
              <div key={index} className="flex items-center bg-white p-2 rounded mb-1 border border-gray-200 w-full gap-2">
                <img src={item.image} alt={item.name} className="w-11 h-11 object-cover rounded flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{item.name} (Size: {item.size})</div>
                  <div className="text-xs text-gray-600">{price}৳</div>
                </div>
                <div className="text-center">
                  <div className="text-sm">x{item.quantity.toString().padStart(2, '0')}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order summary */}
        <div className="bg-gray-100 rounded-lg p-4 mt-5">
          <h3 className="font-semibold text-lg mb-2.5">Your order</h3>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="text-left py-1">Subtotal</td>
                <td className="text-right py-1">{subtotal}৳</td>
              </tr>
              <tr>
                <td className="text-left py-1">Shipping</td>
                <td className="text-right py-1">{shippingCost}৳</td>
              </tr>
              <tr>
                <td className="text-left py-1 text-green-600 font-bold">Discount</td>
                <td className="text-right py-1 text-green-600 font-bold">- {discount}৳</td>
              </tr>
              <tr className="border-t border-gray-300">
                <td className="text-left py-2 font-bold">Total</td>
                <td className="text-right py-2 font-bold">{total}৳</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Billing form */}
        <h2 className="text-center text-lg font-semibold mt-5 mb-2.5">Billing details</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Full name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              placeholder="name (ex. Hasina)"
              className={`w-full p-2.5 border-2 rounded ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && <div className="text-red-600 text-xs mt-1">{errors.fullName}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">Email address (optional)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="yourmail@xyz.com"
              className={`w-full p-2.5 border-2 rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <div className="text-red-600 text-xs mt-1">{errors.email}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Phone <span className="text-red-600">*</span>
            </label>
            <input
              type="tel"
              maxLength={11}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="01XXXXXXXXX"
              className={`w-full p-2.5 border-2 rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <div className="text-red-600 text-xs mt-1">{errors.phone}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Street address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="House number and street name"
              className={`w-full p-2.5 border-2 rounded ${errors.street ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.street && <div className="text-red-600 text-xs mt-1">{errors.street}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Town / City <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="city (ex. vola)"
              className={`w-full p-2.5 border-2 rounded ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.city && <div className="text-red-600 text-xs mt-1">{errors.city}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Division <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.division}
              onChange={(e) => handleDivisionChange(e.target.value)}
              className={`w-full p-2.5 border-2 rounded ${errors.division ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Division(বিভাগ)</option>
              {Object.keys(divisions).map(div => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
            {errors.division && <div className="text-red-600 text-xs mt-1">{errors.division}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              District <span className="text-red-600">*</span>
            </label>
            <select
              value={formData.district}
              onChange={(e) => handleInputChange('district', e.target.value)}
              disabled={!formData.division}
              className={`w-full p-2.5 border-2 rounded ${errors.district ? 'border-red-500' : 'border-gray-300'} disabled:bg-gray-100`}
            >
              <option value="">Select District(জেলা)</option>
              {districts.map(dist => (
                <option key={dist} value={dist}>{dist}</option>
              ))}
            </select>
            {errors.district && <div className="text-red-600 text-xs mt-1">{errors.district}</div>}
          </div>

          <div className="mb-4">
            <label className="block font-bold mt-2.5 mb-1">
              Country / Region <span className="text-red-600">*</span>
            </label>
            <p className="font-bold">Bangladesh</p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white rounded-3xl py-3.5 text-base font-semibold uppercase hover:bg-gray-800 transition-colors mt-5"
          >
            PLACE ORDER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
