import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'

const ShopHome = () => {
  const { user, accessToken } = useSelector(state => state.auth); // Lấy user và token từ Redux
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (!accessToken && !user?.name && !user.shopId) {
     return navigate('/error',{ state: { from: location.pathname } }); 
    }
  }, [accessToken, user, navigate]); 
  return (
    <>
      <header className='flex items-center justify-between bg-blue-500 h-12 text-white'>
        <div className='w-2/12 text-center pt-1 bg-blue-600 h-12'>
          <h1 className='text-2xl font-bold'>Shop</h1>
        </div>
        <div className='flex justify-around w-2/12'>
          <Link to='/'><p className='cursor-pointer hover:text-orange-400 text-lg '>Xem website</p></Link>
          <p className='cursor-pointer text-lg'>{user?.name}</p>
        </div>
      </header>
      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-2/12 bg-gray-800 text-white">
          <div className="flex flex-col items-center py-4 bg-gray-900">
            <p className="mt-2 font-bold cursor-pointer ">{user?.name}</p>
            <p className="text-green-400 text-sm">Online</p>
          </div>
          <nav className="mt-4">
            <ul>
              <li className="py-2 px-4 hover:bg-gray-700">
              <Link to='dashboard'>Trang chủ</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
              <Link to=''>Quản lý sản phẩm</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to={`shopProfile/${user?.shopId?._id}`}>Thông tin shop</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
              <Link to='adminManage'>Quản lý Admin</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to='category' className=" hover:bg-gray-700">Danh mục</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <a href="#">Slogan</a>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
              <Link to='manageOrder' className=" hover:bg-gray-700">Đơn hàng</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <a href="#">Nhận xét khách hàng</a>
              </li>
            </ul>
          </nav>
        </aside>
        <div className="p-4 w-4/5">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default ShopHome;