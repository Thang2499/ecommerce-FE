import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import trash from '../assets/trash.svg'
import { toast } from 'react-toastify';
import { toastifyOptions } from '../service/toast';
import { fetchCart } from '../service/stateManage/authSlice';
export const ShoppingCart = () => {
    const { user } = useSelector(state => state.auth);
    const [cart, setCart] = useState([]);
    const dispatch = useDispatch();
    const getCart = async () => {
        try {
            const response = await axiosInstance.post('/system/cart', { id: user._id });
            setCart(response.data.itemsInCart);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    }

    const removeFromCart = async (id) => {
        try {
            const response = await axiosInstance.post('/system/removeFromCart', {
                itemId: id,
                userId: user._id
            })
            if (response.status === 200) {
                getCart();
                dispatch(fetchCart(user._id));
                toast.success('Đã xóa sản phẩm khỏi giỏ hàng', toastifyOptions(1000));
            } else {
                toast.error('Lỗi xóa sản phẩm khỏi giỏ hàng', toastifyOptions(1000));
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getCart();
    }, []);

    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <>
            <div className=' flex items-center bg-gradient-to-b from-orange-500 to-orange-400 text-white mr-28 ml-20 mt-12 h-20 shadow-md'>
                <p className='w-1/4 text-center text-lg'>Sản phẩm</p>
                <p className='w-1/4 text-center text-lg'>Số lượng</p>
                <p className='w-1/4 text-center text-lg'>Đơn giá</p>
                <p className='w-1/4 text-center text-lg'>Tổng giá</p>
            </div>
            {cart.length > 0 ? <div className='ml-20 mr-28 relative'>{cart.map((item, index) => (
                <div className='flex mt-8 w-full mb-8 border h-20 p-4 shadow-md' key={index}>
                    <div className='flex w-1/4'>

                        <img className='w-20' src={item.productId.image} alt="" />
                        <p>{item.productId.productName}</p>
                    </div>
                    <div className='flex justify-center w-1/4'>
                        <button className='px-2 h-8 mt-1 bg-gray-300'>-</button>
                        <p className=' text-center text-xl pt-1 w-8'>{item.quantity}</p>
                        <button className='px-2 h-8 mt-1 bg-gray-300'>+</button>
                    </div>
                    <p className='w-1/4 text-center'>{formatPrice(item.unitPrice.toString())}đ</p>
                    <p className='w-1/4 text-center'>{formatPrice(item.totalPrice.toString())}đ</p>
                    <div className="absolute right-2">
                        <img
                            onClick={() => removeFromCart(item._id)}
                            className="w-16 h-6 cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 transition-opacity" src={trash} alt="Remove" />
                    </div>
                </div>
            ))}
                <Link to="/order">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-6 py-3 rounded-lg transition-all active:scale-95 shadow-lg">
                        Tiến hành thanh toán
                    </button>
                </Link>


            </div>
                :
                <div className=' flex justify-center items-center text-2xl font-semibold h-96 '>Bạn chưa có sản phẩm nào trong giỏ hàng</div>}
        </>
    )
}
