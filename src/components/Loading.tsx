import React from 'react';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col justify-center items-center z-[1000]">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
      {message && <p className="text-gray-600 text-sm">{message}</p>}
    </div>
  );
};

export default Loading;
