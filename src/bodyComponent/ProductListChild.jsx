import React, { useEffect } from 'react'
import { toast } from 'react-toastify';
import axiosInstance from '../service/getRefreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { fetchCart, fetchWishList } from '../service/stateManage/authSlice';
import { toastifyOptions } from '../service/toast';
const ProductListChild = ({ items }) => {
  const { productName, image, price, _id } = items;
  const auth = useSelector((state) => state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const addToWishList = async (idProduct) => {
      const wishList = [{ productId: idProduct.toString() }];
      try {
        const response = await axiosInstance.post(`/system/addWishList/${auth.user._id}`,{wishList:wishList});
        if(response.status === 200  && response.data.message === 'Sản phẩm đã có trong wishlist') {

          toast.info('Sản phẩm đã có trong danh sách yêu thích',toastifyOptions(1000));
        }else{
          
          dispatch(fetchWishList(auth.user._id));
          toast.success('Đã thêm sản phẩm vào danh sách yêu thích', toastifyOptions(1000));
        }
      } catch (error) {
        toast.info('Vui lòng đăng nhập để thêm vào wishlist',toastifyOptions(1000));
        navigate('/login');
        console.log(error)
      }
    }
  const addToCart = async (productId,price) => {
    try {
        const respone = await axiosInstance.post('/system/addToCart', {
            id:auth.user._id,
            productId:productId,
            quantity:1,
            unitPrice:price
        })
        if(respone.status === 200){
          dispatch(fetchCart(auth.user._id));
           toast.success('Đã thêm vào giỏ hàng',toastifyOptions(1000));
        }           
    } catch (error) {
      toast.info('Vui lòng đăng nhập để mua hàng')
      navigate('/login');
        console.log(error)
    }
};
const handleProductDetail = (idProduct) =>{
  navigate(`/productDetail/${idProduct}`)
}
  return (
    <div className="relative w-11/12 group border border-gray-200 rounded-lg shadow-md  hover:shadow-2xl p-4 bg-white flex flex-col justify-between">
    {image ? (
      <img
        className="w-full  object-cover rounded-t-lg transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110"
        src={image}
        alt=""
      />
    ) : (
      <p className="w-full h-40 flex items-center justify-center bg-gray-100 text-gray-500 rounded-t-lg">
        img...
      </p>
    )}
    <div className="text-center mt-4">
     <p 
     onClick={() => handleProductDetail(_id)}
      className="font-semibold cursor-pointer hover:text-blue-600">{productName}</p>
      <p className="text-gray-600 mt-1">Giá: {formatPrice(price.toString())}đ</p>
    </div>
    <button
      onClick={() => addToWishList(_id)}
      className="bg-black text-white w-full py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out hover:scale-110"
    >
      Add to wishlist
    </button>
    <button
      onClick={() => addToCart(_id,price)}
      className="bg-black text-white w-full py-1 mt-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out hover:scale-110"
    >
      Add to cart
    </button>
    
  {/* <ToastContainer
  position="top-right"
  autoClose={1000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  transition:Bounce
/>  */}
  </div>
  )
}

export default ProductListChild