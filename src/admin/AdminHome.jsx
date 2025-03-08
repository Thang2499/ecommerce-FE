import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Outlet, useNavigate } from 'react-router'
import { logout } from '../service/stateManage/authSlice';

const AdminHome = () => {
  const { user } = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin-login');
    location.reload();
  };
  return (
    <>
      <header className='flex items-center justify-between bg-blue-500 h-12 text-white'>
        <div className='w-2/12 text-center pt-1 bg-blue-600 h-12'>
          <h1 className='text-2xl font-bold'>Admin</h1>
        </div>

        <div className='flex justify-around w-2/12 relative'>
          <Link to='/'><p className='cursor-pointer hover:text-orange-400 text-lg '>Xem website</p></Link>
          <p onClick={toggleMenu} className='cursor-pointer text-lg'>{user?.name}</p>
          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute top-full right-3 mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
              <ul className="py-2">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Tài khoản
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </li>
              </ul>
            </div>
          )}
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
                <Link to=''>Trang chủ</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to='userManage'>Quản lý user</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to='shopManage'>Quản lý shop</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to='adminManage'>Quản lý Admin</Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <Link to='category' className=" hover:bg-gray-700">
                  Danh mục
                </Link>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <a href="#">Slogan</a>
              </li>
              <li className="py-2 px-4 hover:bg-gray-700">
                <a href="#">Đơn hàng</a>
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

export default AdminHome