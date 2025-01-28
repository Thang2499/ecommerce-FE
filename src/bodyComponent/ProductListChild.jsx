import React from 'react'
import { ToastContainer, toast, Bounce } from 'react-toastify';
import axiosInstance from '../service/getRefreshToken';
import { useSelector } from 'react-redux';
const ProductListChild = ({ items }) => {
  const auth = useSelector((state) => state.auth)
    const { productName, image, price, _id } = items;
    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const addToWishList = async (idProduct) => {
      const wishList = [{ productId: idProduct.toString() }];
      try {
        const response = await axiosInstance.post(`/system/addWishList/${auth.user._id}`,{wishList:wishList})
        if(response.status === 200) {
          toast.success('Đã thêm sản phẩm vào danh sách yêu thích')
        }else{
          toast.error('Lỗi thêm sản phẩm vào danh sách yêu thích')
        }
      } catch (error) {
        console.log(error)
      }
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
    //  onClick={() => handleProductDetail(_id)}
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
    //   onClick={addToCart}
      className="bg-black text-white w-full py-1 mt-1 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out hover:scale-110"
    >
      Add to cart
    </button>
    
  <ToastContainer
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
/> 
  </div>
  )
}

export default ProductListChild