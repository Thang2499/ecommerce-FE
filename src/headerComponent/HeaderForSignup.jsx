import React from 'react'
import { useLocation } from 'react-router';

const HeaderForSignup = () => {
  const location = useLocation();
  return (
    <>
    <div className=' h-24 bg-gradient-to-b from-orange-700 to-orange-400 sticky top-0 z-50'>
      <div className=' flex pt-1'>
      </div>
      <div className='flex justify-around w-4/5 ml-28 mt-5'>
        <div className='flex w-2/5'>
          <h1 className='text-3xl text-white cursor-pointer'>Shopee</h1>
          <h1 className='text-3xl cursor-pointer ml-4'>{location.pathname === '/signup' ? 'Đăng ký' :'Đăng nhập'}</h1>
        </div>
        <span className='mt-2 text-zinc-300 cursor-pointer'>Bạn cần giúp đỡ ?</span>
      </div>
    </div>
  </>
  )
}

export default HeaderForSignup