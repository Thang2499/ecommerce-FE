import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();
  const fromPath = location?.state?.from || 'Trang không xác định'; // Lấy đường dẫn từ state

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-5xl font-bold text-red-600">404 NOT FOUND</h1>
      <p className="text-lg text-gray-700 mt-2">
        Bạn không thể truy cập trang: <span className="text-red-500 font-bold">{fromPath}</span>
      </p>
      <Link to="/" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Quay về Trang chủ
      </Link>
    </div>
  );
};

export default ErrorPage;
