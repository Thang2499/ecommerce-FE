import { useState } from 'react'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './headerComponent/Header';
import Login from './login-signup/Login';
import Signup from './login-signup/Signup';
import HeaderForSignup from './headerComponent/HeaderForSignup';
import AdminLogin from './admin/AdminLogin';
import Footer from './footerComponent/Footer';
function App() {
  const location = useLocation();
  return (
<>
  {location.pathname === "/signup" || location.pathname === "/login" ? (
    <HeaderForSignup />
  ) : location.pathname === "/admin-login" ? null : (
    <Header /> 
  )}

  <Routes>
    <Route path="/signup" element={<Signup />} />
    <Route path="/login" element={<Login />} />
    <Route path="/admin-login" element={<AdminLogin />} />
  </Routes>
  {!location.pathname.startsWith("/admin") &&
    location.pathname !== "/signup" &&
    location.pathname !== "/login" && <Footer />}
</>
  )
}

export default App
