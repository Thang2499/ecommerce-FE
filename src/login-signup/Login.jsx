import React, { useState } from 'react'
import loginn from '../public/login-signup.png'
import axiosInstance from '../service/getRefreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { login, setLoading } from '../service/stateManage/authSlice';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const  navigate  = useNavigate();
    const auth = useSelector(state => state.auth); // đây là cách lấy state từ redux, không cần truyền props
    // console.log('auth',auth);
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        dispatch(setLoading(true))
        const response = await axiosInstance.post('/user/login', {
          email, password
        });
        if (response && response.status === 200) {
          console.log(response);
        } else {
          throw new Error('Unexpected response');
        }
        dispatch(login({
          user: response.data.user,
          accessToken: response.data.accessToken,
        }))
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
          navigate('/');
      } catch (err) {
        console.log(err);
      } finally {
        dispatch(setLoading(false))
      }
    }
  return (
    <>
    <div className=' flex border-t-2 w-full'>
    <div className='h-lvh w-1/2'>
      <img className='h-5/6 mt-12 w-full ' src={loginn} alt="" />
    </div>
    <div onSubmit={handleLogin} className='mt-16 pl-48 w-2/4'>
      <form className='h-96 mt-20'>
        <h1 className='text-3xl font-medium '>Đăng nhập</h1>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}  className='focus:outline-none mt-3 border-b-2 pt-8 w-96 pb-2'  placeholder='Email' /><br />
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='focus:outline-none border-b-2 pt-8 w-96 pb-2' placeholder='Mật khẩu' />
        <div className='mt-8 w-96 flex justify-between '>
          <button type='submit' className='  h-12 text-center w-32 border rounded-md  shadow-sm bg-red-500 hover:bg-red-800 hover:text-white '>Đăng nhập</button>
          <span className=' li-hover pt-4 red-text cursor-pointer'>Quên mật khẩu ?</span>
        </div>
      </form>
    </div>

  </div>
  </>
  )
}

export default Login