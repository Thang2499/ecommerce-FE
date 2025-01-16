import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import settings from '../public/settings.svg'
const UserManage = () => {
  const [listUser, setListUser] = useState([]);
  const [config,setConfig] = useState(false)
  const [currentUser, setCurrentUser] = useState(null);
  const getListUser = async () =>{
    try {
      const response = await axiosInstance.get('/admin/user/list');
      console.log(response)
      setListUser(response.data.listUser);
  } catch (err) {
      console.error('Lỗi:', err);
  }
  }
  useEffect(()=> {
    getListUser()
  },[])

  const openSetting = (user) => {
    setCurrentUser(user); 
    setConfig(!config);   
  };

  // Đóng popup
  const closePopup = () => {
    setConfig(false);
    setCurrentUser(null); 
  };
  return (
    <>
       <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
                </div>
            </nav>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full mt-5 relative">
        <div className="flex px-4 py-3 border-b bg-gray-100">
          <p className="font-semibold w-1/6 text-sm text-gray-700">Tên</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Số điện thoại</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Địa chỉ</p>
          <p className="font-semibold w-2/6 text-sm text-gray-700">Email</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Trạng thái</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Hành động</p>
        </div>

        {listUser?.map((user) => (
          <div key={user._id} className="flex py-3 px-4 border-b text-sm hover:bg-gray-50">
            <p className="w-1/6 text-gray-800">{user.name}</p>
            <p className="w-1/6 text-gray-800">{user.phone}</p>
            <p className="w-1/6 text-gray-800">{user.address}</p>
            <p className="w-2/6 text-gray-800">{user.email}</p>
            <p className="w-1/6 text-gray-800 pl-4">{user.isActived ? 'Active' : 'N/A'}</p>

            <div className="w-1/6 flex gap-2">
              <img
                onClick={() => openSetting(user)}
                className="w-8 ml-4 cursor-pointer"
                src={settings}
                alt="config icon"
              />
            </div>
          </div>
        ))}

       
        {config && currentUser && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white w-1/2 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Chỉnh sửa người dùng</h2>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentUser.name}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentUser.phone}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentUser.address}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentUser.email}
                  readOnly
                />
              </div>

              <div className="flex gap-4">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Sửa</button>
                <button className="bg-red-500 text-white py-2 px-4 rounded-md">Xóa</button>
                <button
                  onClick={closePopup}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default UserManage