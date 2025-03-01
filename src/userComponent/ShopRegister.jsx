import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../service/getRefreshToken';
import { toast } from 'react-toastify';
import { toastifyOptions } from '../service/toast';
const ShopRegister = () => {
    const authStore = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        shopName: '',
        description: '',
        phoneNumber: '',
        address: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/user/request-seller',
                formData,
                {
                    headers: {
                    "Content-Type":"multipart/form-data",
                }}
            );
            if (response.status !== 201) {
                console.error('Error details:', response.message);
                toast.error(response.data.message,toastifyOptions(2000));
            }
            toast.success(response.data.message,toastifyOptions(2000));
            setTimeout(() => {
                navigate('/');
            }, 3000);
            console.log('Thành công:', response.data);
        } catch (err) {
            console.error('Lỗi:', err);
        }
    };

    return (
        <>
            <form
                onSubmit={handleRegister}
                className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4"
            >
                <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Thông tin đăng ký Shop</h1>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tên shop:</label>
                        <input
                            type="text"
                            name="shopName"
                            value={formData.shopName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập tên shop"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập mô tả"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại:</label>
                        <input
                            type="number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập số điện thoại"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ:</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Nhập địa chỉ"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Đăng ký
                    </button>
                </div>
            </form>
        </>
    );
};

export default ShopRegister;
