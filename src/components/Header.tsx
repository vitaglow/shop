import React from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '../utils/storage';

interface HeaderProps {
  showTrackingIcon?: boolean;
  showBackButton?: boolean;
  showCartIcon?: boolean;
  onBackClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  showTrackingIcon = false, 
  showBackButton = false,
  showCartIcon = true,
  onBackClick 
}) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = React.useState(0);
  const [isShaking, setIsShaking] = React.useState(false);

  React.useEffect(() => {
    updateCartCount();
    
    // Listen for cart updates
    const handleStorageChange = () => updateCartCount();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const updateCartCount = () => {
    const cart = storage.getCart();
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const handleCartClick = () => {
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      navigate('/cart');
    }, 200);
  };

  const handleTrackingClick = () => {
    navigate('/orderlist');
  };

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-between items-center px-5 py-4">
      <div className="flex items-center">
        {showBackButton ? (
          <button
            onClick={handleBack}
            className="text-3xl hover:opacity-70 transition-opacity"
          >
            <i className="fa-regular fa-arrow-left"></i>
          </button>
        ) : showTrackingIcon ? (
          <button
            onClick={handleTrackingClick}
            className="text-3xl hover:opacity-70 transition-opacity"
          >
            <i className="fa-duotone fa-regular fa-truck"></i>
          </button>
        ) : (
          <div className="w-8"></div>
        )}
      </div>

      <h2 className="text-2xl font-bold">VitaGlow</h2>

      {showCartIcon ? (
        <div className="relative cursor-pointer" onClick={handleCartClick}>
          <i className={`fa-duotone fa-regular fa-shopping-bag text-3xl ${isShaking ? 'cart-shaking' : ''}`}></i>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-sm font-semibold rounded-full px-2 py-0.5 min-w-[24px] text-center">
              {cartCount}
            </span>
          )}
        </div>
      ) : (
        <div className="w-8"></div>
      )}
    </header>
  );
};

export default Header;
