import React, { useState } from 'react'
import signUp from '../assets/login-signup.png'
import axiosInstance from '../service/getRefreshToken';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { toastifyOptions } from '../service/toast';
const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPass, setconfirmPass] = useState('');
    const navigate = useNavigate();
    const handleSignUp = async (e) => {
        e.preventDefault();
        if(password !== confirmPass){
            console.log('mật khẩu không trùng khớp')
            return
          }
          const response = await axiosInstance.post('/user/register', {
            name, password, email
          })
          console.log(response.data)
         if(response.status === 201){
          setTimeout(() => {
            toast.success('Đăng ký thành công', toastifyOptions(1000));
         }, 2000);
           navigate('/login');
         }
    }
  return (
    <>
    <div className=' flex border-t-2 w-full'>
      <div className='h-lvh w-1/2'>
        <img className='h-5/6 mt-16 w-full ' src={signUp} alt="" />
      </div>
      <div onSubmit={handleSignUp} className='mt-16 pl-48 w-2/4'>
        <form className='h-96 mt-20'>
          <h1 className='text-3xl font-medium '>Đăng ký</h1>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  className='focus:outline-none border-b-2 mt-3 pt-8 w-96 pb-2'  placeholder='Email' /><br />
          <input type="text" value={name} onChange={(e)=>setName(e.target.value)}  className='focus:outline-none border-b-2 pt-8 w-96 pb-2'  placeholder='Tên' /><br />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='focus:outline-none border-b-2 pt-8 w-96 pb-2' placeholder='Mật khẩu' />
          <input type="password" value={confirmPass} onChange={(e)=>setconfirmPass(e.target.value)} className='focus:outline-none border-b-2 pt-8 w-96 pb-2' placeholder='Nhập lại mật khẩu' />
          <div className='mt-8 w-96 flex justify-between '>
            <button type='submit' className='  h-12 text-center w-32 border rounded-md  shadow-sm bg-red-500 hover:bg-red-800 hover:text-white '>Đăng ký</button>
          </div>
        </form>
      </div>
  
    </div>
   </>
  )
}

export default Signup