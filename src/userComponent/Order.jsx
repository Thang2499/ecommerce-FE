import React from 'react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../service/getRefreshToken';
import { toastifyOptions } from '../service/toast';

const Order = () => {
  const authStore = useSelector(state => state.auth);
  const [order, setOrder] = useState([]);
 
  const [formData, setFormData] = useState({
    firstName: authStore.user ? authStore.user.name : '',
    streetAddress: '',
    phoneNumber: '',
    email: authStore.user ? authStore.user.email : ''
  });
  const [errors, setErrors] = useState({});
  const [fee, setFee] = useState(null);
  const [error, setError] = useState(null);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  const [selectedProvinceName, setSelectedProvinceName] = useState('');
  const [selectedDistrictName, setSelectedDistrictName] = useState('');
  const [selectedWardName, setSelectedWardName] = useState('');

  const [provinceError, setProvinceError] = useState("");
  const [districtError, setDistrictError] = useState("");
  const [wardError, setWardError] = useState("");

  const address = [formData.streetAddress, selectedWardName, selectedDistrictName, selectedProvinceName].toString();

  const [selectedPayment, setSelectedPayment] = useState('');
  const handlePaymentChange = (event) => {
    setSelectedPayment(event.target.value);
  };
  const total = order.map(item => item.totalPrice);
  const totalPrice = total.reduce((acc, curr) => acc + curr, 0);
 const totalPriceOrder = parseFloat(fee) + parseFloat(totalPrice);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleViewCart = async () => {
    try {
      const res = await axiosInstance.get('/system/viewCart',)
      setOrder(res.data.itemsInCart)
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    handleViewCart();
  }, [])

  const handlePayment = async () => {
    try {
      const responsePayment = await axiosInstance.post('/API/payment', { amountPayment: totalPriceOrder },
      );

      if (responsePayment.data && responsePayment.data.payUrl) {
        window.location.href = responsePayment.data.payUrl;
      } else {
        toast.error('Error initiating payment',toastifyOptions(1000));
      }
    } catch (error) {
      console.error('Error occurred: ', error);
      toast.error('Payment failed',toastifyOptions(1000));
    }
  };
  //-------------------------------------------------
  useEffect(() => {
    axiosInstance.get('/API/provinces')
      .then((response) => setProvinces(response.data))
      .catch((error) => console.error(error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setWards([]);
    setProvinceError(""); 
    const selectedProvince = provinces.find(
      (province) => province.ProvinceID === Number(provinceId)
    );
    setSelectedProvinceName(selectedProvince ? selectedProvince.ProvinceName : '');
    axiosInstance.get(`/API/districts/${provinceId}`)
      .then((response) => setDistricts(response.data))
      .catch((error) => console.error(error));

  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setDistrictError("");
    const selectedDistrict = districts.find(
      (district) => district.DistrictID === Number(districtId)
    );
    setSelectedDistrictName(selectedDistrict ? selectedDistrict.DistrictName : '');
    axiosInstance.get(`/API/wards/${districtId}`)
      .then((response) => setWards(response.data))
      .catch((error) => console.error(error));
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
    setWardError("");
    const selectedWards = wards.find(
      (ward) => ward.WardCode === selectedWard
    );
    setSelectedWardName(selectedWards ? selectedWards.WardName : '');
  };
    const calculateShippingFee = async (data) => {
      try {
        const response = await axiosInstance.post(`/API/shippingFee`, data);
        return response;
      } catch (error) {
        console.error('Error calculating shipping fee:', error.response.data);
        alert(error.response.data)
        throw error;
      }
    };
  
    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

  const handleCalculate = async () => {
    const data = {
      to_district_id: selectedDistrict,
      to_ward_code: selectedWard,
      service_id: 53321,
    };
    try {
      const result = await calculateShippingFee(data);
      const totalFeeVND = result.data.data.total; 
      setFee(totalFeeVND);
    } catch (err) {
      setError('Không thể tính cước vận chuyển');
    }
  }
  useEffect(() => {
    if (selectedDistrict && selectedWard) {
      handleCalculate();
    }
  }, [selectedDistrict, selectedWard]);

  const handleSubmit = async (e) => {

    e.preventDefault();

    let formErrors = {};

    if (!formData.firstName) return toast.error('First Name is required',toastifyOptions(1000))
    if (!formData.streetAddress) return  toast.error('Street Address is required',toastifyOptions(1000));
    if (!formData.phoneNumber) return  toast.error('Phone Number is required',toastifyOptions(1000));
    if (!formData.email) return toast.error('Email Address is required',toastifyOptions(1000));
    if (!selectedProvince) {
      return setProvinceError("Vui lòng chọn Tỉnh/Thành phố");
    }
    if (!selectedDistrict) {
      return  setDistrictError("Vui lòng chọn Quận/Huyện");
    }
    if (!selectedWard) {
      return setWardError("Vui lòng chọn Phường/Xã");
    }
    if (order.length === 0) {
      console.log(order.length)
      toast.error('Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.',toastifyOptions(1000));
      return;
    }

    // if (Object.keys(formErrors).length === 0) {
    //   console.log('a')
    //   return setFormData({
    //     firstName: '',
    //     streetAddress: '',
    //     phoneNumber: '',
    //     email: ''
    //   });
    // } else {
    //   setErrors(formErrors);
    // }
    console.log('a')
    if(!selectedPayment){
      toast.error('Vui lòng chọn phương thức thanh toán',toastifyOptions(1000))
      return;
    }
    //-------------------------------------------
    try {
      const response = await axiosInstance.post(`/system/createOrder`,{
        address:address,
        selectedPayment:selectedPayment,
        fee:fee
      },
     
  );
  console.log(response)
    if (response.status !== 200) toast.error('Error in creating order');
    } catch (error) {
      console.error('Error create Order:', error);
      throw error;
    }
    // await axiosInstance.post('/API/send-email', {
    //   email: formData.email,
    //   orderDetails: order,
    // },
    // {credentials: 'include'});
    // toast.success('Đơn hàng của bạn đã được xử lý và email xác nhận đã được gửi!');
    //---------------------------------------------
    
    if(selectedPayment === 'Momo'){
      await handlePayment();
       return;
     }
     if(selectedPayment === 'Cash on Delivery'){
      handleViewCart();
      toast.success('Thanks for your order',toastifyOptions(1000))
       return;
     }
  };
  return (
    <>
      <div className='flex justify-between ml-32 mt-8 mb-12 scroll-smooth'>
        <div>
          <h1 className='text-3xl'>Billing Details</h1>
          <form onSubmit={handleSubmit} className="space-y-3  bg-white  rounded-lg  w-96">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full h-10 px-3 bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Tỉnh/Thành phố */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố:</label>
              <select
                value={selectedProvince}
                onChange={handleProvinceChange}
                className="block w-full h-10 px-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn Tỉnh/Thành phố</option>
                {provinces.map((province) => (
                  <option key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </option>
                ))}
              </select>
              {provinceError && <p className="text-red-500 text-sm">{provinceError}</p>}
            </div>

            {/* Quận/Huyện */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện:</label>
              <select
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
                className={`block w-full h-10 px-3 border ${!selectedProvince ? 'bg-gray-100' : 'bg-white'
                  } border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((district) => (
                  <option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </option>
                ))}
              </select>
              {districtError && <p className="text-red-500 text-sm">{districtError}</p>}
            </div>

            {/* Phường/Xã */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã:</label>
              <select
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedDistrict}
                className={`block w-full h-10 px-3 border ${!selectedDistrict ? 'bg-gray-100' : 'bg-white'
                  } border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((ward) => (
                  <option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </option>
                ))}
              </select>
              {wardError && <p className="text-red-500 text-sm">{wardError}</p>}
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full h-10 px-3 bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
              />
              {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full h-10 px-3 bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                className="w-full h-10 px-3 bg-slate-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                className="bg-red-600 text-white w-40 h-11 mt-4 rounded hover:bg-red-700 transition duration-200"
                type="submit"
                onClick={handleSubmit}
              >
               Đặt hàng
              </button>
            </div>
          </form>
          {/* {paymentSuccess && <p className='text-green-500 mt-4'>Payment successful! Thank you for your order.</p>} */}
        </div>
        <div className='ml-32 mr-28 mt-12 w-1/2'>
          {order.length > 0 ? (
            order.map((item) => (
              <div key={item._id} className='flex h-20 p-4'>
                {item.productId.image.map((image, index) => <img key={index} src={image} className='w-16' />)}
                <h2 className='text-sm mt-3 ml-4 w-44'>{item.productId.productName}</h2>
                <div className='ml-32'>
                  <p className='text-center text-lg pt-1 w-8'> x{item.quantity}</p>
                </div>
                <p className='pt-2 ml-8'>{formatPrice(item.unitPrice.toString())}đ</p>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <div className='w-4/5 p-5'>
            <div className='flex justify-between mt-4'>
              <p>Subtotal</p>
              <p>{formatPrice(totalPrice.toString())}đ</p>
            </div>
            <hr className='mt-1 mb-2' />
            <div className='flex justify-between'>
              <p>Shipping</p>
              <p>{fee}đ</p>
            </div>
            <hr className='mt-1 mb-2' />
            <div className='flex justify-between mb-2'>
              <p>Total</p>
              <p>{totalPriceOrder ? formatPrice(totalPriceOrder.toString()) : formatPrice(totalPrice.toString()) }đ</p>
            </div>
          </div>
          <div>
            <div className='flex mb-8 ml-6'>
              <span>Phương thức thanh toán: </span>
             <div className="flex items-center space-x-2 ml-3">
        <input
          type="radio"
          id="momo"
          name="payment"
          value="Momo"
          checked={selectedPayment === 'Momo'}
          onChange={handlePaymentChange}
          className="cursor-pointer"
        />
        <label htmlFor="momo" className="cursor-pointer">
          Momo
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id="cash"
          name="payment"
          value="Cash on Delivery"
          checked={selectedPayment === 'Cash on Delivery'}
          onChange={handlePaymentChange}
          className="cursor-pointer"
        />
        <label htmlFor="cash" className="cursor-pointer">
          Cash on Delivery
        </label>
      </div>
            </div>

          </div>
          <div className='ml-4'>
            <input className='border-2 py-2 px-4 rounded' placeholder='Coupon Code' type="text" />
            <button className='bg-red-600 text-white w-40 h-11 ml-3 rounded'>Apply Coupon</button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Order;