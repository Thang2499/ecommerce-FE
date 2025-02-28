import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axiosInstance from '../service/getRefreshToken';

const ViewOrder = () => {
    const [data, setData] = useState([])
    const [activeTab, setActiveTab] = useState('Pending');

    const getManageOrder = async () => {
        try {
            const response = await axiosInstance.get('/user/viewOrder', 
        );
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
    }, []);
    const filteredOrders = data.filter((item) => {
        const status = item.status.toLowerCase();
        if (activeTab === 'pending') return status === 'pending';
        if (activeTab === 'delivering') return status === 'delivering';
        if (activeTab === 'completed') return status === 'completed';
        return true;
    });

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
                    Your Orders
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

            <div
                className='p-4 mb-4 bg-gray-200 shadow rounded-md flex items-center '
            >
                <span className='w-1/6 '>Sản phẩm</span>
                <span className='w-1/6 ml-8'>Số lượng</span>
                <span className='w-1/6 pl-10'>Tổng tiền</span>
                <span className=' w-1/5 pl-11'>Địa chỉ</span>
                <span className='w-1/6 pl-24'>Phương thức thanh toán</span>
                <span className='w-1/6 text-center pl-24'>Trạng thái</span>
            </div>

            {/* Nội dung đơn hàng */}
            <div>
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
                                        <p className="text-sm pt-3 ">{product.itemId.productId.productName}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex-col w-1/6'>
                                {item.items.map((quantityProduct, idx) => (
                                    <div key={idx} className="text-sm h-24 pl-10 pt-7">
                                        {quantityProduct.itemId.quantity}
                                    </div>
                                ))}
                            </div>

                            <p className="text-sm pl-11 w-1/6">{formatPrice(item.totalAmount.toString())}đ</p>
                            <div className="w-1/5 pl-8 ">
                                <p className="text-sm">{item.userId.name}</p>
                                <p className="text-sm">{item.userId.phone}</p>
                                <p className="text-sm">{item.shippingAddress}</p>
                            </div>
                            <p className="text-sm w-1/6 pl-20">{item.paymentMethod}</p>
                            <div>
                                <span
                                    className={`py-1 px-3 rounded-full text-sm ml-20 ${item.status === 'Pending'
                                        ? 'bg-yellow-100 '
                                        : item.status === 'Delivering'
                                            ? 'bg-blue-100 text-blue-600'
                                            : 'bg-green-100 text-green-600'
                                        }`}
                                >
                                    {item.status === 'Pending'
                                        ? 'Chờ xác nhận'
                                        : item.status === 'Delivering'
                                            ? 'Đang giao'
                                            : 'Hoàn thành'}
                                </span>
                            </div>
                        </div>
                    ))

                ) : (
                    <p className="text-gray-500 text-center">Không có đơn hàng nào.</p>
                )}
            </div>
        </div>
    )
}

export default ViewOrder