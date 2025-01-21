import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import { useSelector } from 'react-redux';

export const ShoppingCart = () => {
    const {user} = useSelector(state => state.auth);
    console.log(user);
    const [cart, setCart] = useState([]);
    const getCart = async () => {
        try {
            const response = await axiosInstance.post('/system/cart',{id: user._id});
            setCart(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    }
    useEffect(() => {
        getCart();
    }, []);
  return (
    <>
    {cart ? <div className=' flex justify-center items-center text-2xl font-semibold h-96 '>Bạn chưa có sản phẩm nào trong giỏ hàng</div> : <div>{cart.map((item,index) => (
        <div key={index}>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>{item.quantity}</p>
        </div>
    ))}</div>}

    </>
  )
}
