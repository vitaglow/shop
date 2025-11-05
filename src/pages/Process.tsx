import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';
import { OrderSummary } from '../types';
import { API_ENDPOINTS, API_KEYS } from '../utils/api';

const messages = [
  'Checking Information...',
  'Processing...',
  'Processing Complete...',
  'Submitting Information...',
  'Submission Successful...',
  'Redirecting...',
];

const Process: React.FC = () => {
  const navigate = useNavigate();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (currentMessage >= messages.length) return;

    const timer = setTimeout(() => {
      setIsActive(false);
      setTimeout(() => {
        setCurrentMessage(prev => prev + 1);
        setIsActive(true);
      }, 500);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentMessage]);

  useEffect(() => {
    submitOrder();
  }, []);

  const submitOrder = async () => {
    const orderData = storage.getOrder();
    
    if (!orderData) {
      navigate('/');
      return;
    }

    try {
      const formUrl = `${API_ENDPOINTS.dgif}/1FAIpQLSe1PW0PmhOwtjJ6oGxV8jGNA5su7d4q8UsGPqQHft1uTaw58w/${API_KEYS.dgfie}`;
      const formData = new FormData();

      formData.append('entry.1521911793', orderData.products);
      formData.append('entry.1315429576', orderData.sizes);
      formData.append('entry.1042377278', orderData.quantities);
      formData.append('entry.1929816597', orderData.prices);
      formData.append('entry.1633347911', orderData.fullName);
      formData.append('entry.1992915978', orderData.email || 'Not provided');
      formData.append('entry.601200116', orderData.phone);
      formData.append('entry.118035891', `${orderData.address.street}, ${orderData.address.city}, ${orderData.address.district}, ${orderData.address.country}`);
      formData.append('entry.640425847', orderData.shippingCost.toString());
      formData.append('entry.794775864', `-${orderData.discount}`);
      formData.append('entry.1146383026', orderData.totalSum.toString());
      formData.append('entry.903833330', orderData.totalQuantity.toString());
      formData.append('entry.1545449398', orderData.orderId);
      formData.append('entry.646887505', 'processing');
      formData.append('entry.1781678531', 'Unpaid');

      // Send email if email is provided
      if (orderData.email) {
        await sendOrderEmail(orderData);
      }

      // Submit form
      await fetch(formUrl, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      // Clear cart and order data
      storage.clearOrderData();

      // Redirect to done page
      setTimeout(() => {
        navigate(`/done?promo=${orderData.promo}&id=${orderData.orderId}&name=${orderData.fullName}&phone=${orderData.phone}&ship=${orderData.shippingCost}&price=${orderData.sump}&dis=${orderData.discount}&total=${orderData.totalSum}`);
      }, 2000);
    } catch (error) {
      console.error('Order processing failed:', error);
      alert('Failed to submit order data. Please try again.');
    }
  };

  const sendOrderEmail = async (orderData: OrderSummary) => {
    try {
      const emailBody = `
        <table style="width: 100%; font-family: Arial, sans-serif; text-align: center; border-collapse: collapse;">
          <tr>
            <td style="padding: 20px;">
              <div style="font-size: 40px;">✅️</div>
              <h2 style="margin: 10px 0;">Your Order is Successful</h2>
              <p style="color: #ff007f;">Order Id: ${orderData.orderId}</p>
            </td>
          </tr>
        </table>
        <table style="width: 100%; border: 1px solid #ddd; border-radius: 10px; margin-top: 10px;">
          <tr>
            <td style="padding: 15px;">
              <h3 style="margin: 0; text-align: left;">RECEIVER INFO</h3>
              <p style="margin: 5px 0; color: #666;">${orderData.fullName}</p>
              <p style="margin: 5px 0; color: #666;">${orderData.phone}</p>
            </td>
            <td style="text-align: right; padding: 15px;">
              <button style="background: black; color: white; padding: 5px 10px; border: none; border-radius: 5px;">
                <a href="https://vitaglow.github.io/shop/orderlist.html?phone=${orderData.phone}">Track Orders</a>
              </button>
            </td>
          </tr>
        </table>
        <table style="width: 100%; margin-top: 10px;">
          <tr>
            <td style="padding: 10px; text-align: center; background: #fff5f7; color: #ff007f; font-weight: bold;">
              🛍 VitaGlow team will contact you within six hours!
            </td>
          </tr>
        </table>
        <table style="width: 100%; border: 1px solid #ddd; border-radius: 10px; margin-top: 10px;">
          <tr>
            <td colspan="2" style="padding: 15px;">
              <h3 style="margin: 0; text-align: left;">PRICE SUMMARY</h3>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: left;">Total Price</td>
            <td style="padding: 10px; text-align: right;">৳${orderData.sump}</td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: left;">Shipping Charges</td>
            <td style="padding: 10px; text-align: right;">৳${orderData.shippingCost}</td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: left; font-weight: bold;">Discount</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">- ৳${orderData.discount}</td>
          </tr>
          <tr>
            <td style="padding: 10px; text-align: left; font-weight: bold;">Final Customer Price</td>
            <td style="padding: 10px; text-align: right; font-weight: bold;">৳${orderData.totalSum}</td>
          </tr>
        </table>
      `;

      await fetch(`${API_ENDPOINTS.strct}/${API_KEYS.sstt}/${API_KEYS.shaha}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          to_email: orderData.email,
          subject: 'Order Placed',
          body_html: emailBody,
        }),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      {/* Spinner */}
      <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin mb-2.5"></div>

      {/* Message */}
      <div className="h-8 text-center">
        <div
          className={`text-base text-gray-800 inline-block transition-all duration-500 ${
            isActive ? 'opacity-100 transform-none' : 'opacity-0 transform rotate-x-90'
          }`}
          style={{
            transformOrigin: 'center',
            transformStyle: 'preserve-3d',
          }}
        >
          {messages[currentMessage]}
        </div>
      </div>
    </div>
  );
};

export default Process;
