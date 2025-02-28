import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../service/getRefreshToken';
import trash from '../public/trash.svg'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { fetchWishList } from '../service/stateManage/authSlice';
import { toastifyOptions } from '../service/toast';
const Wishlist = () => {
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const [wishList, setWishList] = useState([]);
    const dispatch = useDispatch();
    const getCart = async () => {
        if (!user?._id) {
            // console.warn("Người dùng chưa đăng nhập hoặc không có ID");
            setWishList(0); 
            return;
        }
        try {
            const response = await axiosInstance.post('/system/wishList', { id: user._id });
            setWishList(response.data);
        } catch (error) {
            console.error('Lỗi khi lấy giỏ hàng:', error);
        }
    }

    const deleteFromWishList = async (id) => {
        try {
            const response = await axiosInstance.post('/system/deleteWishList',{
                id:id,
                userId:user._id
            })
            if(response.status === 200) {
                dispatch(fetchWishList(user._id));
                getCart();
                toast.success('Đã xóa sản phẩm khỏi danh sách yêu thích',toastifyOptions(1000));
            }else{
              toast.error('Lỗi xóa sản phẩm khỏi danh sách yêu thích',toastifyOptions(1000));
            }
          } catch (error) {
            console.log(error)
          }
        }

        const addToCart = async (productId,price) => {
            try {
                const respone = await axiosInstance.post('/system/addToCart', {
                    id:user._id,
                    productId:productId,
                    quantity:1,
                    unitPrice:price
                })
                if(respone.status === 200){
                   toast.success('Đã thêm vào giỏ hàng',toastifyOptions(1000));
                }           
            } catch (error) {
                console.log(error)
            }
        }

    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleProductDetail = (idProduct) =>{
        navigate(`/productDetail/${idProduct}`)
   }

    useEffect(() => {
        getCart();
    }, []);

    return (
        <>
        {wishList && wishList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 mt-8 ml-32 mb-8">
                {wishList.map((item, index) => (
                    <div
                        key={index}
                        className="relative group border border-gray-200 rounded-lg shadow-md hover:shadow-2xl p-4 bg-white flex flex-col justify-between transition-all duration-300"
                    >
                        <div className="flex justify-center mb-4">
                            <img className="w-36 h-28 rounded-md" src={item.productId.image} alt={item.productId.productName} />
                        </div>
    
                        <div className="text-center mb-2">
                            <p 
                            onClick={()=>handleProductDetail(item.productId._id)}
                            className="text-lg hover:underline cursor-pointer font-semibold">{item.productId.productName}</p>
                            <p className="text-xl font-semibold text-red-600">{formatPrice(item.productId.price.toString())}đ</p>
                        </div>
    
                        <div className="absolute top-2 right-2">
                            <img
                            onClick={()=>deleteFromWishList(item.productId._id)}
                            className="w-6 h-6 cursor-pointer opacity-80 group-hover:opacity-100 hover:scale-110 transition-opacity" src={trash} alt="Remove" />
                        </div>
    
                        <button
                            onClick={() => addToCart(item.productId._id,item.productId.price)}
                            className="bg-black text-white w-full py-1 mt-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:scale-110"
                        >
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            <div className="flex justify-center items-center text-2xl font-semibold h-96 text-gray-600">
                Bạn chưa có sản phẩm trong danh sách yêu thích
            </div>
        )}
    </>
    )
}

export default Wishlist