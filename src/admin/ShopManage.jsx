import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/getRefreshToken';
import settings from '../assets/settings.svg'
const ShopManage = () => {
    const [shopRequest, setShopRequest] = useState(false);
    const [shopActive, setShopActive] = useState(true);
    const [shopListReq, setShopListReq] = useState([]);
    const [shopListActive, setShopListActive] = useState([]);
    const [config, setConfig] = useState(false)
    const [currentUser, setCurrentUser] = useState(null);
    const getShopActive = async () => {
        try {
            const response = await axiosInstance.get('/admin/shop/list/active');
            setShopListActive(response.data.listShop);
        } catch (err) {
            console.error('Lỗi:', err);
        }
    }

    const getShopRequest = async () => {
        try {
            const response = await axiosInstance.get('/admin/shop/list/requesting');
            setShopListReq(response.data.listShop);
        } catch (err) {
            console.error('Lỗi:', err);
        }
    }

    useEffect(() => {
        getShopActive();
        getShopRequest();
    }, []);

    const handleAction = async (action, id) => {
        console.log(id)
        if (action === 'accept') {
            await axiosInstance.post(`/admin/shop/approve/${id}`)
        }
    }

    const openSetting = (shop) => {
        setCurrentUser(shop);
        setConfig(!config);
    };

    // Đóng popup
    const closePopup = () => {
        setConfig(false);
        setCurrentUser(null);
    };
    return (
        <>
            <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý cửa hàng</h1>
                </div>
            </nav>

            {/* Buttons */}
            <div className='overflow-x-auto bg-white shadow-md rounded-lg w-full mt-5 relative'>
                <div className="flex mb-4 gap-4">
                    <button
                        onClick={() => {
                            setShopRequest(false);
                            setShopActive(true); // Reset the other state when one is clicked
                        }}
                        className="text-lg cursor-pointer bg-slate-400 hover:bg-slate-500 px-4 py-2 rounded w-full"
                    >
                        Danh sách shop hoạt động
                    </button>
                    <button
                        onClick={() => {
                            setShopRequest(true);
                            setShopActive(false); // Reset the other state when one is clicked
                        }}
                        className="text-lg cursor-pointer bg-slate-400 hover:bg-slate-500 px-4 py-2 rounded w-full"
                    >
                        Danh sách shop request
                    </button>
                </div>

                {/* Active Shops Table */}
                {shopActive && (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full">
                        <div className="flex px-4 py-3 border-b bg-gray-100">
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Tên shop</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Số điện thoại</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Địa chỉ</p>
                            <p className="font-semibold w-2/6 text-sm text-gray-700">Mô tả</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700 pl-8">Trạng thái</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Hành động</p>
                        </div>

                        {shopListActive?.map((shop) => (
                            <div key={shop._id} className="flex py-3 px-4 border-b text-sm hover:bg-gray-50">
                                <p className="w-1/6 text-gray-800">{shop.name}</p>
                                <p className="w-1/6 text-gray-800">{shop.phone}</p>
                                <p className="w-1/6 text-gray-800">{shop.address}</p>
                                <p className="w-2/6 text-gray-800">{shop.description}</p>
                                <p className="w-1/6 text-gray-800 pl-8">{shop.isActive ? 'Hoạt động' : 'Chờ duyệt'}</p>

                                <div className="w-1/6 flex gap-2">
                                    <img
                                        onClick={() => openSetting(shop)}
                                        className="w-8 ml-4 cursor-pointer"
                                        src={settings}
                                        alt="config icon"
                                    />
                                </div>
                            </div>

                        ))}
                    </div>
                )}

                {/* Shop Requests Table */}
                {shopRequest && (
                    <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full">
                        <div className="flex px-4 py-3 border-b bg-gray-100">
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Tên shop</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Số điện thoại</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Địa chỉ</p>
                            <p className="font-semibold w-2/6 text-sm text-gray-700">Mô tả</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700 pl-8">Trạng thái</p>
                            <p className="font-semibold w-1/6 text-sm text-gray-700">Hành động</p>
                        </div>

                        {shopListReq?.map((shop) => (
                            <div key={shop._id} className="flex py-3 px-4 border-b text-sm hover:bg-gray-50">
                                <p className="w-1/6 text-gray-800">{shop.name}</p>
                                <p className="w-1/6 text-gray-800">{shop.phone}</p>
                                <p className="w-1/6 text-gray-800">{shop.address}</p>
                                <p className="w-2/6 text-gray-800">{shop.description}</p>
                                <p className="w-1/6 text-gray-800 pl-8">{shop.isActive ? 'Hoạt động' : 'Chờ duyệt'}</p>

                                <div className="w-1/6 flex gap-2 text-sm">
                                    <button
                                        onClick={() => handleAction('accept', shop.userId)}
                                        className="bg-green-500 hover:bg-green-600 text-white px-1 py-1 rounded-md transition duration-300 ease-in-out">
                                        Chấp nhận
                                    </button>
                                    <button
                                        onClick={() => handleAction('reject', shop.userId)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md transition duration-300 ease-in-out">
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Popup */}
                {config && currentUser && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white w-1/2 p-6 rounded-lg">
                            <h2 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h2>
                            <div className="mb-4">
                                <label className="block font-medium text-gray-700">Tên</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    value={currentUser.name}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium text-gray-700">Số điện thoại</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    value={currentUser.phone}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium text-gray-700">Địa chỉ</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    value={currentUser.address}
                                    readOnly
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    value={currentUser.email}
                                    readOnly
                                />
                            </div>

                            <div className="flex gap-4">
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Sửa</button>
                                <button className="bg-red-500 text-white py-2 px-4 rounded-md">Xóa</button>
                                <button
                                    onClick={closePopup}
                                    className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </>
    );
};


export default ShopManage;