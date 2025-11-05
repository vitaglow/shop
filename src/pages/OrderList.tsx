import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Loading from '../components/Loading';
import { OrderData } from '../types';
import { API_ENDPOINTS, SPREADSHEET_IDS } from '../utils/api';
import { parseCSVReverse, formatDateTo12Hour } from '../utils/helpers';

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    fetchOrders();
    const phone = searchParams.get('phone');
    if (phone) {
      setPhoneNumber(phone);
      setTimeout(() => searchOrders(phone), 1000);
    }
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      const url = `${API_ENDPOINTS.dgistart}/${SPREADSHEET_IDS.orders}/gviz/tq?tqx=out:csv`;
      const response = await fetch(url);
      const csvText = await response.text();
      
      const rows = parseCSVReverse(csvText);
      rows.shift(); // Remove header
      
      const orderList: OrderData[] = rows.reverse().map((row, index) => ({
        orderDate: row[0] ? formatDateTo12Hour(row[0]) : '',
        name: row[1] || `Unnamed_${index}`,
        phone: row[2] || '',
        status: row[3] || 'pending',
        email: row[4] || '',
        address: row[5] || '',
        productCodes: row[6] || '',
        productCount: row[7] || '',
        totalCount: parseInt(row[8]) || 0,
        eachPrice: row[9] || '',
        shipping: parseFloat(row[10]) || 0,
        totalPrice: parseFloat(row[11]) || 0,
        discount: parseFloat(row[12]) || 0,
        pstatus: row[13] || '',
        orderid: row[14] || `ORDER_${index}`,
      }));
      
      setOrders(orderList);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to load order data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const searchOrders = (phone?: string) => {
    const searchPhone = phone || phoneNumber.trim();
    
    if (!searchPhone) {
      setFilteredOrders([]);
      return;
    }

    setSearching(true);
    const results = orders.filter(order => order.phone === searchPhone);
    setFilteredOrders(results);
    setSearching(false);
  };

  const handleSearch = () => {
    searchOrders();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchOrders();
    }
  };

  const handleTrackOrder = (order: OrderData) => {
    const params = new URLSearchParams({
      orderid: order.orderid,
      date: order.orderDate,
      phone: order.phone,
      status: order.status,
      name: order.name,
      email: order.email,
      address: order.address,
      products: order.productCodes,
      counts: order.productCount,
      prices: order.eachPrice,
      shipping: order.shipping.toString(),
      total: order.totalPrice.toString(),
      discount: order.discount.toString(),
      pstatus: order.pstatus,
      totalCount: order.totalCount.toString(),
    });
    
    navigate(`/track?${params.toString()}`);
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === 'delivered' || lowerStatus === 'paid') return 'text-green-600';
    if (lowerStatus === 'processing') return 'text-orange-500';
    if (lowerStatus === 'shipped') return 'text-blue-600';
    if (lowerStatus === 'cancelled' || lowerStatus === 'returned' || lowerStatus === 'unpaid') return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return <Loading message="Loading orders..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header showBackButton onBackClick={() => navigate('/')} />

      <div className="pt-20 px-5 pb-5">
        {/* Search bar */}
        <div className="flex items-center border-2 border-black rounded-md overflow-hidden max-w-md mx-auto my-5">
          <input
            type="tel"
            maxLength={11}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type Phone Number (ex. 01888..)"
            className="flex-1 p-2.5 border-none outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-gray-700 text-white border-none p-2.5 cursor-pointer hover:bg-gray-800"
          >
            <i className="fa-duotone fa-regular fa-magnifying-glass-location"></i>
          </button>
        </div>

        {/* Results */}
        <div className="max-w-md mx-auto">
          {!phoneNumber && filteredOrders.length === 0 && (
            <p className="text-center text-gray-600 mt-5">
              Please type your phone number on the search bar to find orders!
            </p>
          )}

          {phoneNumber && !searching && filteredOrders.length === 0 && (
            <p className="text-center text-gray-600 mt-5">
              No orders found for this phone number.
            </p>
          )}

          {filteredOrders.map((order) => {
            const isCancelled = order.status.toLowerCase() === 'cancelled';
            
            return (
              <div
                key={order.orderid}
                className="text-left mb-5 pb-4 border-b border-gray-300"
              >
                <h3 className="font-semibold mb-1">Order #{order.orderid}</h3>
                <p className="mb-1">
                  <strong>Status:</strong>{' '}
                  <span className={`font-semibold ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Payment:</strong>{' '}
                  <span className={`font-semibold ${getStatusColor(order.pstatus)}`}>
                    {order.pstatus.toUpperCase()}
                  </span>
                </p>
                <p className="mb-1">
                  <strong>Date:</strong> {order.orderDate}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {order.phone}
                </p>
                <p className="mb-1">
                  <strong>Name:</strong> {order.name}
                </p>
                <p className="mb-1">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="mb-3">
                  <strong>Total:</strong> ৳{order.totalPrice.toFixed(2)}
                </p>
                
                <button
                  onClick={() => handleTrackOrder(order)}
                  disabled={isCancelled}
                  className={`w-full py-3 rounded-full text-sm font-bold ${
                    isCancelled
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-colors'
                  }`}
                >
                  View tracking info
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
