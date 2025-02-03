import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axiosInstance from '../service/getRefreshToken';

const ManageOrder = () => {
    const [data, setData] = useState([])
    const [activeTab, setActiveTab] = useState('Pending');
    const [updatedStatus, setUpdatedStatus] = useState({});
    const getManageOrder = async () => {
        try {
            const response = await axiosInstance.get('/shop/manageOrder', {});
            if (response.status !== 200) {
                console.error('Error details:', response);
                throw new Error('đăng nhập thất bại');
            }
            setData(response.data);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getManageOrder();
    }, [])
    const filteredOrders = data.filter((item) => {
        const status = item.status.toLowerCase();
        if (activeTab === 'pending') return status === 'pending';
        if (activeTab === 'delivering') return status === 'delivering';
        if (activeTab === 'completed') return status === 'completed';
        return true;
    });
    // console.log(filteredOrders)

    const handleStatusChange = (orderId, value) => {
        setUpdatedStatus((prev) => ({
            ...prev,
            [orderId]: value,
        }));
    };

    const handleUpdate = async (orderId) => {
        const newStatus = updatedStatus[orderId]
        try {
            const response = await axiosInstance.put(`/shop/approveOrder/${orderId}`,
                { newStatus: newStatus },
            )
            if (response.ok !== 200) throw new Error('Update fail');
            console.error('Error details:', response.message);
            getManageOrder()

        } catch (error) {
            console.error(error);
        }
    }
    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };
    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Quản lý đơn hàng</h2>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-300 mb-6">
                <button
                    className={`py-2 px-4 ${activeTab === 'pending'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('pending')}
                >
                    New Orders
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'delivering'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('delivering')}
                >
                    Shipping
                </button>
                <button
                    className={`py-2 px-4 ${activeTab === 'completed'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500'
                        }`}
                    onClick={() => setActiveTab('completed')}
                >
                    Completed
                </button>
            </div>

            {/* Nội dung đơn hàng */}
            <div>
                <div
                    className='p-4 mb-4 bg-gray-200 shadow rounded-md flex items-center '
                >
                    <span className='w-1/6 '>Product</span>
                    <span className='w-1/6 ml-8'>Quantity</span>
                    <span className='w-1/6 pl-10'>Total</span>
                    <span className=' w-1/5 pl-11'>Address</span>
                    <span className='w-1/6 pl-24'>Payment Method</span>
                    <span className='w-1/6 text-center pl-12'>Status</span>
                </div>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((item) => (
                        <div
                            key={item._id}
                            className="p-4 mb-4 bg-white shadow rounded-md flex items-center "
                        >
                            <div className="w-1/6">
                                {item.items.map((product, index) => (
                                    <div className='flex' key={index}>
                                        {product.itemId.productId.image.map((image, idx) => (
                                            <img
                                                key={idx}
                                                className="w-20 mt-3"
                                                src={image}
                                                alt={product.itemId.productId.productName}
                                            />
                                        ))}
                                        <p className="text-sm pt-3">{product.itemId.productId.productName}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex-col w-1/6'>
                                {item.items.map((quantityProduct, idx) => (
                                    <p key={idx} className="text-sm h-24 pl-10 pt-7">
                                        {quantityProduct.itemId.quantity}
                                    </p>
                                ))}
                            </div>

                            <p className="text-sm pl-11 w-1/6">{formatPrice(item.totalAmount.toString())}đ</p>
                            <div className="w-1/5 pl-8">
                                <p className="text-sm">{item.userId.name}</p>
                                <p className="text-sm">{item.userId.phone}</p>
                                <p className="text-sm">{item.shippingAddress}</p>
                            </div>
                            <p className="text-sm w-1/6 pl-12">{item.paymentMethod}</p>
                            <div className='w-1/12'>
                                <select
                                    value={updatedStatus[item._id] || item.status}
                                    onChange={(e) => handleStatusChange(item._id, e.target.value)}
                                    className={`py-1 px-3 rounded-full text-sm ml-7 ${item.status === 'Pending'
                                        ? 'bg-yellow-100 '
                                        : item.status === 'Delivering'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                        }`}
                                >
                                    <option value="Pending">Chờ xác nhận</option>
                                    <option value="Delivering">Đang giao</option>
                                    <option value="Completed">Hoàn thành</option>
                                    <option value="Cancel">Hủy</option>
                                </select><br />
                                {updatedStatus[item._id] && updatedStatus[item._id] !== item.status && (
                                    <button
                                        className="ml-12 w-full mt-3 py-2 px-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                        onClick={() => handleUpdate(item._id)}
                                    >
                                        Cập nhật
                                    </button>)}
                            </div>
                        </div>
                    ))

                ) : (
                    <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
                )}
            </div>
        </div>
    );
}

export default ManageOrder