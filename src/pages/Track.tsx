import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { Product } from '../types';
import { API_ENDPOINTS, SPREADSHEET_IDS } from '../utils/api';
import { parseCSV } from '../utils/helpers';

const Track: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<Product[]>([]);

  const orderData = {
    orderid: searchParams.get('orderid') || 'N/A',
    date: searchParams.get('date') || '',
    phone: searchParams.get('phone') || '',
    status: searchParams.get('status') || 'Processing',
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    address: searchParams.get('address') || '',
    products: searchParams.get('products')?.split('#') || [],
    counts: searchParams.get('counts')?.split('#')?.map(Number) || [],
    prices: searchParams.get('prices')?.split('#')?.map(Number) || [],
    shipping: parseFloat(searchParams.get('shipping') || '0'),
    total: parseFloat(searchParams.get('total') || '0'),
    discount: Math.abs(parseFloat(searchParams.get('discount') || '0')),
    pstatus: searchParams.get('pstatus') || 'Pending',
    totalCount: parseInt(searchParams.get('totalCount') || '0'),
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const url = `${API_ENDPOINTS.dgistart}/${SPREADSHEET_IDS.products}/gviz/tq?tqx=out:csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      
      const rows = parseCSV(csvText);
      rows.shift();
      
      const products: Product[] = rows.map((row) => ({
        image: row[8] || 'https://via.placeholder.com/50',
        description: row[9] || '',
        name: row[2] || '',
        code: row[1] || '',
        size: row[3] || '',
        stock: parseInt(row[4]) || 0,
        price: parseFloat(row[6]) || 0,
        unisex: row[10] || 'Unisex',
        originalIndex: 0,
      }));
      
      setInventory(products);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string): number => {
    const statusMap: Record<string, number> = {
      processing: 1,
      confirmed: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 1,
      returned: 4,
    };
    return statusMap[status.toLowerCase()] || 1;
  };

  const currentStep = getStatusStep(orderData.status);
  const progressWidth = ((currentStep - 1) / 3) * 80;

  if (loading) {
    return <Loading />;
  }

  const subtotal = orderData.products.reduce((sum, code, index) => {
    const product = inventory.find(p => p.code.toLowerCase() === code.toLowerCase());
    const price = product ? product.price : orderData.prices[index] || 0;
    return sum + (price * (orderData.counts[index] || 0));
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-5">
      <Header showCartIcon />

      <div className="max-w-md mx-auto pt-20 px-5">
        {/* Invoice header */}
        <div className="flex justify-around items-center mb-5">
          <h2 className="text-lg font-semibold">
            INVOICE <span className="text-yellow-700">#{orderData.orderid}</span>
          </h2>
          <p className="text-base">Thank you!</p>
        </div>

        {/* Progress bar */}
        <div className="relative flex justify-between items-center my-5 py-2.5">
          {/* Background bar */}
          <div className="absolute h-1 bg-gray-300 top-1/2 -translate-y-1/2 left-[10%] w-[80%] z-0"></div>
          
          {/* Filled bar */}
          <div
            className="absolute h-1 bg-green-600 top-1/2 -translate-y-1/2 left-[10%] z-[1] transition-all duration-300"
            style={{ width: `${progressWidth}%` }}
          ></div>

          {/* Steps */}
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`relative w-6 h-6 rounded-full bg-white flex items-center justify-center z-[2] text-sm ${
                step <= currentStep ? 'border-2 border-white' : ''
              }`}
            >
              <i
                className={`fa-duotone fa-regular ${
                  step === 1
                    ? 'fa-seal-exclamation text-orange-500'
                    : step === 2
                    ? 'fa-badge-check'
                    : step === 3
                    ? 'fa-truck'
                    : 'fa-box'
                } ${step <= currentStep ? 'text-green-600' : 'text-gray-300'}`}
              ></i>
            </div>
          ))}
        </div>

        {/* Status labels */}
        <div className="flex justify-around text-center text-xs mb-5">
          <p className="w-1/4">Order Processing</p>
          <p className="w-1/4">Order Confirmed</p>
          <p className="w-1/4">Products Shipped</p>
          <p className="w-1/4">Products Delivered</p>
        </div>

        {/* Order details */}
        <h3 className="text-base text-gray-700 mt-5 mb-2">Order Details</h3>
        <div className="bg-white p-2.5 rounded shadow mb-5">
          <p className="my-1"><i className="fa fa-user mr-2"></i> {orderData.name}</p>
          <p className="my-1"><i className="fa fa-phone mr-2"></i> {orderData.phone}</p>
          <p className="my-1"><i className="fa fa-envelope mr-2"></i> {orderData.email}</p>
          <p className="my-1"><i className="fa fa-map-marker-alt mr-2"></i> {orderData.address}</p>
        </div>

        {/* Item details */}
        <h3 className="text-base text-gray-700 mt-5 mb-2">Item Details</h3>
        <div className="bg-white border border-gray-300 p-2.5 rounded">
          {orderData.products.map((code, index) => {
            const product = inventory.find(p => p.code.toLowerCase() === code.toLowerCase());
            const productName = product?.name || `Product ${code}`;
            const productImage = product?.image || 'https://via.placeholder.com/50';
            const price = product?.price || orderData.prices[index] || 0;
            const quantity = orderData.counts[index] || 0;

            return (
              <div
                key={index}
                className="flex justify-between items-center py-2.5 border-b border-gray-300 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-12 h-12 rounded"
                  />
                  <div>
                    <p className="font-medium">{productName}</p>
                    <p className="text-sm text-gray-600">{quantity} × ৳{price}</p>
                  </div>
                </div>
                <span className="font-bold">৳{price * quantity}</span>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-5 bg-white p-4 rounded shadow">
          <div className="flex justify-between py-1">
            <p>Order Items:</p>
            <span>{orderData.totalCount}</span>
          </div>
          <div className="flex justify-between py-1">
            <p>Order ID:</p>
            <span>{orderData.orderid}</span>
          </div>
          <div className="flex justify-between py-1">
            <p>Payment Status:</p>
            <span className="uppercase">{orderData.pstatus}</span>
          </div>
          <div className="flex justify-between py-1">
            <p>Sub Total:</p>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1">
            <p>Delivery Fee:</p>
            <span>৳{orderData.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-green-600">
            <p>Discount:</p>
            <span>- ৳{orderData.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-300 mt-2">
            <h3>Total:</h3>
            <span>৳{orderData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track;
