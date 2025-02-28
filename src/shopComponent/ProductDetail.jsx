import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { HfInference } from "@huggingface/inference";
import axiosInstance from '../service/getRefreshToken';
import { toastifyOptions } from '../service/toast';
const ProductDetail = () => {
  const [data, setData] = useState({});
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(data?.image?.[0] || "");
  const authStore = useSelector(state => state.auth);
  const { id } = useParams();
  const getProductDetail = async () => {
    try {
      const response = await axiosInstance.post('/system/productDetail', { id: id })
      if (response.status !== 200) throw new Error('Error')
        setData(response.data)
      setSelectedImage(response.data.image[0])
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getProductDetail()
  }, [id])
  const addToCart = async (id, price, quantity) => {
    if (authStore.isAuth === false) {
      toast.info('Đang nhập để mua hàng',toastifyOptions(2000))
      return;
    }
    try {
      const res = await axiosInstance.post('/system/addToCart', {
        id: authStore.user._id,
        productId: id,
        quantity: quantity,
        unitPrice: price,
      })
      if (res.status !== 200) {
        toast.error('Lỗi thêm vào giỏ hàng',toastifyOptions(2000));
        throw new Error('đăng nhập thất bại',toastifyOptions(2000));
      }
      toast.success('Thêm vào giỏ hàng thành công',toastifyOptions(2000))
    } catch (err) {
      console.log(err);
    }
  }
  const [inputText, setInputText] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const hf = new HfInference("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");

  const analyzeSentiment = async (text) => {
    try {
      setLoading(true);
      const result = await hf.textClassification({
        model: "mr4/phobert-base-vi-sentiment-analysis",
        inputs: text,
      });
      return result;
    } catch (error) {
      console.error("Error analyzing sentiment:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (inputText.trim() === "") {
      toast.info("Vui lòng nhập đánh giá!",toastifyOptions(2000));
      return;
    }

    const result = await analyzeSentiment(inputText);
    console.log(result)
    if (result) {
      const positiveOrNeutral = result.some(
        (item) =>
          (item.label === "Tích cực" || item.label === "Trung tính" || item.label === "Tiêu cực") &&
          item.score > 0.3
      );

      if (positiveOrNeutral) {
        setComments((prevComments) => [
          ...prevComments,
          { id: Date.now(), text: inputText,timestamp: Date.now() },
        ]);
        toast.success("Đánh giá của bạn đã được đăng thành công!",toastifyOptions(2000));
        setInputText("");
      } else {
        toast.warning("Đánh giá của bạn không được chấp nhận do ngôn từ làm ảnh hưởng đến trải nghiệm người dùng!");
      }
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!",toastifyOptions(2000));
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
  return (
    <>
      {data ? (
        <div className="bg-gra100 h-vh flex flex-wrap p-8">
          {/* Vùng ảnh */}
          <div className="w-1/2">
          <div className="ml-6 md:ml-24">
          {/* Ảnh chính */}
          {selectedImage && (
            <img
              className="bg-custom-gray w-full h-96 p-2 mx-auto object-cover"
              src={selectedImage}
            />
          )}
        </div>
        <div className="ml-8 md:ml-36 flex flex-wrap justify-start mt-4 gap-2">
          {data.imageDetail ? (
            data.imageDetail.map((imgDetail, idx) => (
              <img
                key={idx}
                className="w-20 md:w-1/5 cursor-pointer border border-gray-300 rounded-lg"
                src={imgDetail}
                onClick={() => setSelectedImage(imgDetail)} // Cập nhật ảnh chính khi click
              />
            ))
          ) : (
            <p>Image loading...</p>
          )}
        </div>
          </div>
          {/* Vùng thông tin sản phẩm */}
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            <p className="text-xl font-bold">{data.productName}</p>
            <p className="text-lg text-green-600">{formatPrice(data?.price?.toString())}đ</p>
            <div className="flex items-center mt-6">
              <span className="font-medium text-gray-700">Số lượng</span>
              <div className="ml-4 flex items-center space-x-4">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(quantity - 1)}
                  className="w-8 h-8 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 rounded">
                  -
                </button>
                <span className="font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 rounded">
                  +
                </button>
              </div>
            </div>
            <button
              className="bg-black  transition ease-in-out delay-50  hover:-translate-y-1 hover:scale-110 hover:bg-black duration-300 text-white w-1/4 py-2 mt-4 rounded-md "
              onClick={() => addToCart(data._id, data.price, quantity)}
            >Add to cart</button>
          </div>
          <div className="text-gray-600 mt-4 w-3/4 ml-36" dangerouslySetInnerHTML={{ __html: data.description }}></div>
          <div className='ml-24 pl-2 w-3/4 p-6 '>
            <h1 className='text-xl font-bold mb-4'>Comments</h1>
            {loading && <p className='text-gray-500 italic'>Posting comments...</p>}
            <form className='flex' onSubmit={handleSubmit}>
              <input
                className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4'
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Nhập đánh giá của bạn..."
              />
              <button
                className='w-1/6 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md'
                type="submit"
              >
                Gửi đánh giá
              </button>
            </form>
            <hr />
            <div className='flex mt-3'>
              <ul className='space-y-4'>
                {comments.map((comment) => (
                  <li key={comment.id} className='flex items-start gap-2 p-3 bg-gray-100 rounded-md'>
                    <span>{authStore.user.name}:</span>  {comment.text}
                    <small className='text-gray-600 pt-1'>
              {new Date(comment.timestamp).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">Loading...</p>
      )}
    </>

  )
}

export default ProductDetail