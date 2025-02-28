import React, { useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading } from '../service/stateManage/authSlice';
import { useNavigate } from 'react-router';
const AdminLogin = () => {
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
      const response = await axiosInstance.post('/admin/login', {
        email, password
      });
      console.log(response)
      if (response && response.status === 200) {
        console.log(response);
      } else {
        throw new Error('Unexpected response');
      }
      dispatch(login({
        user: response.data.admin,
        accessToken: response.data.accessToken,
      }))
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.admin));
        navigate('/admin');
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(setLoading(false))
    }
  }
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Admin Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                autoComplete="on"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </form>

          {/* Footer Links */}
          <div className="mt-4 text-center">
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminLogin