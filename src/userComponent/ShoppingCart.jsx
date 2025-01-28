import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import { useSelector } from 'react-redux';

export const ShoppingCart = () => {
    const {user} = useSelector(state => state.auth);
    const [cart, setCart] = useState([]);
    const getCart = async () => {
        try {
            const response = await axiosInstance.post('/system/cart',{id: user._id});
            console.log(response)
            setCart(response.data.itemsInCart);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    }
    useEffect(() => {
        getCart();
    }, []);
  return (
    <>
    <div className=' flex items-center  mr-28 ml-20 mt-12 h-20 shadow-md'>
          <p className='w-1/4 text-center'>Sản phẩm</p>
          <p className='w-1/4 text-center'>Số lượng</p>
          <p className='w-1/4 text-center'>Đơn giá</p>
          <p className='w-1/4 text-center'>Tổng giá</p>
        </div>
    {cart ? <div className='ml-20 mr-28'>{cart.map((item,index) => (
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
            <p className='w-1/4 text-center'>{item.unitPrice}đ</p>
            <p className='w-1/4 text-center'>{item.totalPrice}đ</p>
        </div>
    ))}</div>
    :
    <div className=' flex justify-center items-center text-2xl font-semibold h-96 '>Bạn chưa có sản phẩm nào trong giỏ hàng</div>}

    </>
  )
}
