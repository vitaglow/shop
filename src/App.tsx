import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Process from './pages/Process';
import Done from './pages/Done';
import OrderList from './pages/OrderList';
import Track from './pages/Track';
import './index.css';

const App: React.FC = () => {
  return (
    <Router basename="/shop">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/process" element={<Process />} />
        <Route path="/done" element={<Done />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/track" element={<Track />} />
      </Routes>
    </Router>
  );
};

export default App;
