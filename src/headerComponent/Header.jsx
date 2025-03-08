import React, { useEffect, useRef, useState } from 'react'
import notification from '../assets/headerImg/notification-icon.svg'
import question from '../assets/headerImg/question-mark.svg'
import cart from '../assets/headerImg/cart.svg'
import wishlist from '../assets/headerImg/wishlist.svg'
import search from '../assets/headerImg/search.svg'
import { Link, useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCart, fetchWishList, logout } from '../service/stateManage/authSlice'
import axiosInstance from '../service/getRefreshToken'
const Header = () => {
  const authStore = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const { user, wishList, userCart } = useSelector((state) => state.auth);
console.log(userCart)
  useEffect(() => {
    if (user?._id) {
      dispatch(fetchWishList(user._id));
      dispatch(fetchCart(user._id));
    }
  }, [dispatch, user]);

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
    navigate('/');
    location.reload();
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 2000)
    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      fetchProducts(debouncedTerm)
    }
  }, [debouncedTerm]);
  const fetchProducts = async (term) => {
    try {
      const response = await axiosInstance.post(`/system/productSearch/${term}`)
      if (response.status !== 200) throw new Error('Error')
      setProducts(response.data)
      setIsDropdownVisible(true);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    const clickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => {
      document.removeEventListener("mousedown", clickOutside);
    };
  }, []);
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
              {authStore.isAuth && authStore.user ? (
                <div className="relative flex items-center space-x-4">
                  <button
                    onClick={toggleMenu}
                    className="font-medium hover:text-gray-300"
                  >
                    {authStore.user ? authStore.user.name : null}
                  </button>

                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute top-full mt-2 w-36 bg-white border rounded-md shadow-lg z-50">
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
                          <Link
                            to="/viewOrder"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setMenuOpen(false)}
                          >
                            View Order
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                  {authStore.user?.shopId ? (
                    authStore.user.shopId.isActive ? (
                      <Link to="/shopPage" className="hover:text-gray-300">
                        Go to Shop
                      </Link>
                    ) : (
                      <p className="cursor-not-allowed">Shop đang chờ duyệt</p>
                    )
                  ) : (
                    <Link to="/shopRegister" className="hover:text-gray-300">
                      Shop Register
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/signup" className="hover:text-gray-300">Đăng ký</Link>
                  <Link to="/login" className="hover:text-gray-300">Đăng nhập</Link>
                </div>
              )}
            </ul>
          </div>
        </div>
        <div className='flex justify-around w-4/5 ml-32 mt-5'>
          <div>
            <Link to='/'><h1 className='text-4xl text-white cursor-pointer'>Shopee</h1></Link>
          </div>
          <div className='w-7/12 relative'>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsDropdownVisible(true)}
              className='w-full h-10 pl-2 border border-gray-300 focus:outline-none rounded ' type="text" placeholder='Tìm kiếm...' />
            {isDropdownVisible && products.length > 0 && (
              <div
                ref={dropdownRef}
                className="absolute z-10 bg-white border border-slate-300 rounded-md shadow-md mt-1 w-full max-h-80 overflow-y-scroll"
              >
                <table className="table-auto w-full text-left">
                  <tbody>
                    {products.map((item, index) => (
                     <Link to={`/productDetail/${item._id}`}> <tr key={index} className="hover:bg-slate-50">
                        <td>
                          {item.image &&
                            Array.isArray(item.image) &&
                            item.image.map((image, i) => (
                              <img
                                key={i}
                                className="w-28"
                                src={image}
                                alt={`Product ${i}`}
                              />
                            ))}
                        </td>
                        <td className="text-xs px-1 py-1">{item.productName}</td>
                      </tr>
                      </Link>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <img
              src={search}
              alt="search icon"
              className="absolute bg-orange-500 hover:bg-orange-600 top-1/2 right-3 -translate-y-1/2 w-16 h-8 pt-1 pb-1 rounded"
            />
          </div>
          <div className='flex justify-around w-1/12 relative'>
            <span className='left-7 bg-white rounded-full px-1.5 text-sm cursor-pointer absolute z-10'>{wishList?.length}</span>
            <Link to='/wishlist'><img src={wishlist} className="w-8 cursor-pointer hover:scale-110 pt-1" alt="" /></Link>
            <span className='left-20 bg-white rounded-full px-1.5 text-sm cursor-pointer absolute z-10'>{userCart.itemsInCart?.length}</span>
            <Link to='/cart'><img src={cart} className="w-8 cursor-pointer hover:scale-110 pt-1" alt="" /></Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header