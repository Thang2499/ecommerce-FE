import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import settings from '../public/settings.svg'
import { toast } from 'react-toastify';
import LoadingSpinner from '../shopComponent/LoadingSpinner';
import { useSelector } from 'react-redux';
import { toastifyOptions } from '../service/toast';
const AdminManage = () => {
  const auth = useSelector(state => state.auth);
  const [listAdmin, setListAdmin] = useState([]);
  const [config, setConfig] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    address: ''
  });
  const [addAdmin, setAddAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formAddAdmin, setFormAddAdmin] = useState({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminRole: 'ADMIN',
    adminPhone: '',
    adminAddress: ''
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', formAddAdmin.adminName);
    formData.append('email', formAddAdmin.adminEmail);
    formData.append('password', formAddAdmin.adminPassword);
    formData.append('adminRole', formAddAdmin.adminRole);
    formData.append('phone', formAddAdmin.adminPhone);
    formData.append('address', formAddAdmin.adminAddress);
    if (formAddAdmin.adminRole === 'ADMIN') {
      formData.append('isActive', true)
      const response = await axiosInstance.post('/admin/create/admin', formData);
      console.log(response)
      if (response.status === 201) {
        toast.success('Tạo quản trị viên thành công',toastifyOptions(2000));
        setLoading(false);
        setAddAdmin(!addAdmin)
        setFormAddAdmin({
          name: '',
          email: '',
          password: '',
          role: '',
          phone: '',
          address: ''
        })
      } else {
        toast.error('Tạo quản trị viên thất bại',toastifyOptions(2000));
        setLoading(false);
      }
    } else if (formAddAdmin.adminRole === 'READ_ONLY') {
      const response = axiosInstance.post('/admin/create/read-only', formData);
      if (response.status === 201) {
        toast.success('Tạo quản trị viên thành công',toastifyOptions(2000));
        setLoading(false);
        setAddAdmin(!addAdmin)
        setFormAddAdmin({
          name: '',
          email: '',
          password: '',
          role: '',
          phone: '',
          address: ''
        })
      } else {
        toast.error('Tạo quản trị viên thất bại',toastifyOptions(2000));
        setLoading(false);
      }
    } else {
      setLoading(false);
      return toast.info('Chưa có chức năng tạo super admin',toastifyOptions(2000));
    }
  };
  const getAdminList = async () => {
    try {
      const response = await axiosInstance.get('/admin/listAdmin', { params: query });
      console.log(response)
      if (response.status === 200) {
        const { adminList, totalPages, totalAdmin } = response.data;
        setListAdmin(adminList)
        setPagination({
          ...pagination,
          totalPages,
          totalAdmin
        });
      } else {
        toast.error('Load dữ liệu thất bại',toastifyOptions(2000));
      }
    } catch (error) {
      toast.error('Load dữ liệu thất bại',toastifyOptions(2000));
    }
  };
  const openSetting = (admin) => {
    if (auth.user.role === 'READ_ONLY') {
      return toast.error('Bạn không có quyền truy cập',toastifyOptions(2000));
    }
    setCurrentAdmin(admin);
    setConfig(!config);
  };

  const handleChangeFormAddAdmin = (e) => {
    const { name, value } = e.target;
    setFormAddAdmin({
      ...formAddAdmin,
      [name]: value
    });
    setCurrentAdmin({
      ...currentAdmin,
      [name]: value
    });
  }

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalProducts: 0
  });

  const [query, setQuery] = useState({
    page: 1,
    limit: 20
  });
  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value);
    setQuery({ ...query, limit: newLimit, page: 1 });
  };

  const handlePageChange = (page) => {
    setQuery({ ...query, page });
  };
  const closePopup = () => {
    setAddAdmin(false);
    setConfig(false);
    setCurrentAdmin(null);
  };
  useEffect(() => {
    getAdminList();
  }, [])
  return (
    <div>
      {loading && <LoadingSpinner />}
      <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quản lý quản trị viên</h1>
        </div>
      </nav>
      <div className='mt-4 overflow-x-auto rounded-lg relative'>
        <button onClick={() => setAddAdmin(!addAdmin)}>Thêm Admin</button>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg w-full mt-5 relative">

        <div className="flex px-4 py-3 border-b bg-gray-100">
          <p className="font-semibold w-1/6 text-sm text-gray-700">Tên</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Số điện thoại</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Địa chỉ</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Email</p>
          <p className="font-semibold w-1/6 text-sm pl-5 text-gray-700">Quyền</p>
          <p className="font-semibold w-1/6 text-sm text-gray-700">Trạng thái</p>
          <p className="font-semibold w-1/12 text-sm text-gray-700">Hành động</p>
        </div>

        {listAdmin?.map((admin) => (
          <div key={admin._id} className="flex py-3 px-4 border-b text-sm hover:bg-gray-50">
            <p className="w-1/6 text-gray-800">{admin.name}</p>
            <p className="w-1/6 text-gray-800">{admin.phone}</p>
            <p className="w-1/6 text-gray-800">{admin.address}</p>
            <p className="w-1/6 text-gray-800">{admin.email}</p>
            <p className="w-1/6 text-gray-800 pl-5">{admin.role}</p>
            <p className="w-1/6 text-gray-800 pl-4">{admin.isActive ? 'Active' : 'N/A'}</p>

            <div className="w-1/12 flex gap-2">
              <img
                onClick={() => openSetting(admin)}
                className="w-8 ml-4 cursor-pointer transition-transform duration-200 hover:scale-105"
                src={settings}
                alt="config icon"
              />
            </div>
          </div>
        ))}


        {config && currentAdmin && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white w-1/2 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Chỉnh sửa quản trị viên</h2>
              {currentAdmin.avatar ? <div className="mb-4">
                <label className="block font-medium text-gray-700">Hình đại diện</label>
                <img
                  className="w-16 mt-1 p-2 border border-gray-300 rounded-md"
                  src={currentAdmin.avatar}
                />
              </div> : null}
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  name='name'
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  value={currentAdmin.name}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="number"
                  name='phone'
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  value={currentAdmin.phone}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name='address'
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  value={currentAdmin.address}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name='email'
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  value={currentAdmin.email}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Cập nhật Quyền</label>
                <select
                  name="role"
                  value={currentAdmin.role}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="READ_ONLY">Moderator</option>
                </select>
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
      <div className="flex justify-center mt-2 items-center">
        {/* Hiển thị pagination */}
        <div className="flex  space-x-2">
          {/* First Page Button */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${pagination.page === 1 ? 'cursor-not-allowed bg-gray-400' : ''}`}
          >
            First
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${pagination.page === 1 ? 'cursor-not-allowed bg-gray-400' : ''}`}
          >
            Prev
          </button>

          {/* Hiển thị các số trang */}
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={pagination.page === index + 1}
              className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${pagination.page === index + 1 ? 'bg-blue-700 cursor-not-allowed' : ''}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${pagination.page === pagination.totalPages ? 'cursor-not-allowed bg-gray-400' : ''}`}
          >
            Next
          </button>

          <button
            onClick={() => handlePageChange(pagination.totalPages)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition duration-300 ${pagination.page === pagination.totalPages ? 'cursor-not-allowed bg-gray-400' : ''}`}
          >
            Last
          </button>
        </div>
        {/* Dropdown để chọn số lượng sản phẩm mỗi trang */}
        <div className="flex items-center space-x-2 ml-5">
          <label className="text-lg">Hiển thị:</label>
          <select
            onChange={handleLimitChange}
            value={query.limit}
            className="border rounded-md py-2 px-4 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 30, 50].map(limit => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>
      {addAdmin && (
        <div className=" min-h-screen fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <button
              onClick={closePopup}
              className="bg-gray-300 hover:bg-gray-400 float-end  text-gray-700 py-2 px-4 rounded-md "
            >
              Đóng
            </button>
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Tạo Quản Trị Viên</h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Tên Quản Trị Viên</label>
                <input
                  type="text"
                  name="adminName"
                  value={formAddAdmin.adminName}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tên quản trị viên"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="adminEmail"
                  value={formAddAdmin.adminEmail}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                <input
                  type="password"
                  name="adminPassword"
                  value={formAddAdmin.adminPassword}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input
                  type="number"
                  name="adminPhone"
                  value={formAddAdmin.adminPhone}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input
                  type="text"
                  name="adminAddress"
                  value={formAddAdmin.adminAddress}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập địa chỉ"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Chọn Quyền</label>
                <select
                  name="adminRole"
                  value={formAddAdmin.adminRole}
                  onChange={(e) => handleChangeFormAddAdmin(e)}
                  className="mt-1 block w-full p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ADMIN">Quản trị viên</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="READ_ONLY">Moderator</option>
                </select>
              </div>


              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Tạo Quản Trị Viên
                </button>

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminManage