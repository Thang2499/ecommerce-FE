import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../service/getRefreshToken';


const ShopProfileEdit = () => {
  const { id } = useParams();
  const [shopProfile, setShopProfile] = useState({
    address: '',
    description: '',
    email: '',
    name: '',
  });

  const profileShop = async () => {
    const response = await axiosInstance.post('/shop/shopProfile', { id });
    setShopProfile(response.data);
  };
  useEffect(() => {
    profileShop();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShopProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axiosInstance.post('/shop/updateProfile', shopProfile);
    if (response.data.success) {
      alert('Cập nhật thông tin thành công');
    } else {
      alert('Cập nhật thông tin thất bại');
    }
  };

  return (
    <div className=" p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Chỉnh sửa thông tin Shop</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Tên Shop
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={shopProfile.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Địa chỉ
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={shopProfile.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Mô tả
          </label>
          <textarea
            id="description"
            name="description"
            value={shopProfile.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={shopProfile.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Lưu thay đổi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ShopProfileEdit;
