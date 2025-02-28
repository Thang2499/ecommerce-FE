import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './headerComponent/Header';
import Login from './login-signup/Login';
import Signup from './login-signup/Signup';
import HeaderForSignup from './headerComponent/HeaderForSignup';
import AdminLogin from './admin/AdminLogin';
import Footer from './footerComponent/Footer';
import AdminHome from './admin/AdminHome';
import AdminCategory from './admin/AdminCategory';
import Body from './bodyComponent/Body';
import ShopManage from './admin/ShopManage';
import UserManage from './admin/UserManage';
import AdminManage from './admin/AdminManage';
import AdminDashboard from './admin/AdminDashboard';
import ShopRegister from './userComponent/ShopRegister';
import ShopHome from './shopComponent/ShopHome';
import ShopProfile from './shopComponent/ShopProfile';
import ProductManage from './shopComponent/ProductManage';
import Wishlist from './userComponent/Wishlist';
import { ShoppingCart } from './userComponent/ShoppingCart';
import Order from './userComponent/Order';
import ManageOrder from './shopComponent/ManageOrder';
import ProductDetail from './shopComponent/ProductDetail';
import ErrorPage from './service/ErrorPage';
import { ToastContainer } from 'react-toastify';
import ProductsList from './bodyComponent/ProductsList';
import BodyByCategory from './bodyComponent/BodyByCategory';
import UserProfile from './userComponent/UserProfile';
import ViewOrder from './userComponent/ViewOrder';
function App() {
  const location = useLocation();
  return (
    <>
      {/* Hiển thị HeaderForSignup hoặc Header dựa trên đường dẫn */}
      {location.pathname === "/signup" || location.pathname === "/login" ? (
        <HeaderForSignup />
      ) : !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/shopPage") ? (<Header />) : null}


      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path='/error' element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />}>
          <Route path="category" element={<AdminCategory />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="shopManage" element={<ShopManage />} />
          <Route path="userManage" element={<UserManage />} />
          <Route path="adminManage" element={<AdminManage />} />
        </Route>
        {/* User Routes */}
        <Route path="/shopRegister" element={<ShopRegister />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/order" element={<Order />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/viewOrder" element={<ViewOrder />} />
        <Route path='/productDetail/:id' element={<ProductDetail />} />
        {/* Home Routes */}
        <Route path='' element={<Body />} >
          <Route path='' element={<ProductsList />} />
          <Route path='/:CategoryId' element={<BodyByCategory />} />
        </Route>
        {/* Shop Routes */}
        <Route path='/shopPage' element={<ShopHome />}>
          <Route path='shopProfile/:id' element={<ShopProfile />} />
          <Route path='' element={<ProductManage />} />
          <Route path='manageOrder' element={<ManageOrder />} />
        </Route>
      </Routes>

      {!location.pathname.startsWith("/admin") &&
        location.pathname !== "/signup" &&
        location.pathname !== "/login" &&
        !location.pathname.startsWith("/shop") &&
        <Footer />}

      <ToastContainer />
    </>
  )
}

export default App
