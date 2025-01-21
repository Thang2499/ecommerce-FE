import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axiosInstance from '../service/getRefreshToken';

const Wishlist = () => {
    const {user} = useSelector(state => state.auth);
    const [wishList, setWishList] = useState([]);
    const getCart = async () => {
        try {
            const response = await axiosInstance.post('/system/wishList',{id: user._id});
            setWishList(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    }
    useEffect(() => {
        getCart();
    }, []);
  return (
    <>
    {wishList ? <div className=' flex justify-center items-center text-2xl font-semibold h-96 '>Bạn chưa có sản phẩm trong danh sách yêu thích</div> : <div>{cart.map((item,index) => (
        <div key={index}>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>{item.quantity}</p>
        </div>
    ))}</div>}

    </>
  )
}

export default Wishlist