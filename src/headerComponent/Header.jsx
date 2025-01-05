import React from 'react'
import notification from '../public/headerImg/notification-icon.svg'
import question from '../public/headerImg/question-mark.svg'
import cart from '../public/headerImg/cart.svg'
import search from '../public/headerImg/search.svg'
import { Link } from 'react-router'
const Header = () => {
  return (
    <>
      <div className=' h-28 bg-gradient-to-b from-orange-700 to-orange-400 sticky top-0 z-50'>
        <div className=' flex pt-1'>
          <div className='w-4/12 ml-40'>
            <ul className='flex justify-around cursor-pointer text-white'>
              <li className='hover:text-gray-300'>Kênh người bán</li>
              <li className='hover:text-gray-300'>Trở thành người bán</li>
              <li className='hover:text-gray-300'>Tải ứng dụng</li>
              <li className='hover:text-gray-300'>Kết nối</li>
            </ul>
          </div>
          <div className='w-4/12 ml-40'>
            <ul className='flex justify-around cursor-pointer text-white'>
              <li className='flex hover:text-gray-300'><img className='w-4' src={notification} alt="" />Thông báo</li>
              <li className='flex hover:text-gray-300'><img className='w-4' src={question} alt="" />Hỗ trợ</li>
              <Link to='/signup'><li>Đăng ký</li></Link>
              <Link to='/login'><li>Đăng nhập</li></Link>
            </ul>
          </div>
        </div>
        <div className='flex justify-around w-4/5 ml-28 mt-5'>
          <div>
            <h1 className='text-4xl text-white cursor-pointer'>Shopee</h1>
          </div>
          <div className='w-7/12 relative'>
            <input className='w-full h-10 pl-2 border border-gray-300 focus:outline-none rounded ' type="text" placeholder='Tìm kiếm...' />
            <img
              src={search}
              alt="search icon"
              className="absolute bg-orange-500 hover:bg-orange-600 top-1/2 right-3 -translate-y-1/2 w-16 h-8 pt-1 pb-1 rounded"
            />
          </div>
          <div>
            <img src={cart} className="w-8 cursor-pointer pt-1" alt="" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Header