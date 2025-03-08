import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '../service/getRefreshToken';
import { toast } from 'react-toastify';
import { toastifyOptions } from '../service/toast';
import { fetchUserInfo } from '../service/stateManage/authSlice';


const UserProfile = () => {
  const authStore = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [form,setForm] = useState({
    name:authStore.user?.name?authStore.user.name:'',
    email:authStore.user?.email?authStore.user.email:'',
    phone:authStore.user?.phone?authStore.user.phone : '' ,
    address:authStore.user?.address? authStore.user.address:''
  })
  const inputChange = (e) =>{
    const {name,value} = e.target;
    setForm((prev => ({
      ...prev,
      [name]:value
    })))
  }
  const handleUpdate = async (e) =>{
    e.preventDefault();
    try{
        const response = await axiosInstance.post('/user/editProfile/',
          form,
      );
        if(response.status === 200){
          toast.success('Cập nhật thành công', toastifyOptions(1000));
          dispatch(fetchUserInfo(authStore.user._id));
        }
        const data = await response.data;
        setForm(data);
      }catch(err){
        console.error(err);
      }
  }
  return (
   <>
     <form onSubmit={handleUpdate} className='  mt-4'>
     <h1 className='h-12 ml-5 text-red-500 font-semibold'>Thông tin tài khoản</h1>
     <div  className='flex justify-around w-full h-24'>
      <div>
      <p className='w-12'>Tên</p>
      <input className='bg-gray-200 p-3 w-96 text-sm' name='name'  type="text" placeholder="Tên" 
      value={form.name} onChange={inputChange}
       />
      </div>
      <div>
      <p className=''>Email</p>
      <input className='bg-gray-200 p-3 w-96 text-sm' name='email' type="email" placeholder="Email" 
      value={form.email} onChange={inputChange}
       /><br />
      </div>
     </div> 
     <div className='flex justify-around w-full'>
      <div>
      <p className=''>Địa chỉ</p>
      <input className='bg-gray-200 p-3 w-96 text-sm' name='address' type="text" placeholder="Địa chỉ"
       value={form.address} onChange={inputChange}
       />
      </div>
      <div>
      <p className='w-32'>Số điện thoại</p>
      <input className='bg-gray-200 p-3 w-96 text-sm' name='phone' type="number" placeholder="Số điện thoại" 
      value={form.phone} onChange={inputChange}
      />
      </div>
     </div>
     <div className='ml-96 w-1/2 leading-10'>
      <h1>Thay đổi mật khẩu</h1>
      <input className='bg-gray-200 p-3 w-full text-sm' placeholder="Mật khẩu hiện tại" type="password" /><br />
      <input className='bg-gray-200 p-3 w-full text-sm mt-3' placeholder="Mật khẩu mới " type="password" /><br />
      <input className='bg-gray-200 p-3 w-full text-sm mt-3' placeholder="Nhập lại mật khẩu mới" type="password" />
     </div>
     <div className='flex justify-center'>
      <button type='submit' className=' w-44 pt-2 pb-2 rounded bg-red-500 hover:bg-red-700 mr-8 mt-4 cursor-pointer' >Lưu thông tin</button>
     </div>
    </form>
   </>
  )
}

export default UserProfile