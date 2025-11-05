import React from 'react';
import logoImage from '../assets/vitaglow.jpg';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-700 text-white text-center py-5">
      <div className="flex flex-col items-center justify-center">
        <img 
          src={logoImage} 
          alt="VitaGlow" 
          className="w-12 h-12 rounded-md mb-3"
        />
        
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold mb-2">Follow us on</span>
          <div className="flex gap-5 mb-3">
            <a 
              href="https://facebook.com/Vitaglowbd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <i className="fab fa-facebook-f text-2xl text-blue-300"></i>
            </a>
            <a 
              href="https://threads.net/@vitaglowbd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <i className="fab fa-threads text-2xl text-red-300"></i>
            </a>
            <a 
              href="https://x.com/Vitaglowbd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <i className="fab fa-twitter text-2xl text-sky-300"></i>
            </a>
            <a 
              href="https://www.instagram.com/vitaglowbd" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity"
            >
              <i className="fab fa-instagram text-2xl text-pink-300"></i>
            </a>
          </div>
        </div>
        
        <p className="text-xs mt-2">
          Copyright © 2024-2025 | VitaGlow Bangladesh
        </p>
      </div>
    </footer>
  );
};

export default Footer;
