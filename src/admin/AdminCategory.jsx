import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import { ToastContainer, toast, Bounce } from 'react-toastify';
const AdminCategory = () => {
  const [categories, setCategories] = useState(null); // Danh sách danh mục
  const [categoriesChild, setCategoriesChild] = useState(null);
  const [newCategory, setNewCategory] = useState(""); // Tên danh mục cha mới
  const [newCategoryChild, setNewCategoryChild] = useState("");
  const [openParentId, setOpenParentId] = useState(null); // Lưu trữ ID danh mục cha được mở
  const [addChildCategory, setAddChildCategory] = useState(false); // Trạng thái thêm danh mục con
  const [currentParentId, setCurrentParentId] = useState(null); // ID danh mục cha hiện tại
  const [config, setConfig] = useState(false)
  const [currentCate, setCurrentCate] = useState({
    name: "",
    description: "",
    image: "",
  });
  const handleToggleSubcategories = async (categoryId) => {
    // Nếu danh mục cha đang mở, đóng lại; nếu chưa mở, mở nó ra
    setOpenParentId((prev) => (prev === categoryId ? null : categoryId));
    setCurrentParentId(categoryId);
    try {
      const response = await axiosInstance.get(`/category/listChild/${categoryId}`);
      setCategoriesChild(response.data.listChildCategory);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggleChildcategories = (e) => {
    e.preventDefault();
    setAddChildCategory(!addChildCategory);
  };

  const addParentCategory = async () => {
    try {
      const response = await axiosInstance.post('/admin/category/create', {
        name: newCategory
      })
      if (response.status === 200) {
        toast.success('Thêm danh mục thành công');
        setNewCategory("");
      } else {
        toast.error('Thêm danh mục thất bại');
      }
    } catch (error) {
      console.log(error);
    }

  };

  const addCategoryChild = async () => {
    try {
      await axiosInstance.post('/admin/category/create', {
        name: newCategoryChild,
        parentId: currentParentId
      })
      toast.success('Thêm danh mục con thành công');
    } catch (error) {
      console.log(error);
    }
  };
  const getCategories = async () => {
    try {
      const response = await axiosInstance.get('/category/list');
      setCategories(response.data.listCategory);
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteChildCategory = async (categoryId) => {

    try {
      const response = await axiosInstance.delete(`/admin/category/delete/${categoryId}`);
      if (response.status === 200) {
        toast.success('Xóa danh mục con thành công');
      } else {
        toast.error('Xóa danh mục con thất bại');
      }
    } catch (error) {
      console.log(error);
    }
  }
  const openSetting = (categoryCurrent) => {
    setCurrentCate(categoryCurrent);
    console.log(categoryCurrent);
    setConfig(!config);
  };

  // Đóng popup
  const closePopup = () => {
    setConfig(false);
    setCurrentCate({
      name: "",
      description: "",
      image: "",
    });
  };

  const handeChangeUpdate = (e) => {
    const { name, value } = e.target;
    setCurrentCate((prevCate) => ({
      ...prevCate,
      [name]: value,
    }));

  }
  useEffect(() => {
    getCategories();
  }, [])

  return (
    <>
      <div className='relative'>
        <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
          </div>
        </nav>

        {/* Form nhập danh mục */}
        <div className="mb-4 mt-5">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nhập tên danh mục..."
            className="border p-2 mr-2"
          />
          <button
            onClick={addParentCategory}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
            Thêm danh mục cha
          </button>

        </div>

        {/* Form chỉnh sửa danh mục */}
        {/* {editCategory && (
          <div className="mb-4">
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Nhập tên mới..."
              className="border p-2 mr-2"
            />
            <button
              // onClick={handleEditCategory}
              className="bg-yellow-500 text-white px-4 py-2 rounded">
              Cập nhật
            </button>
            <button
              // onClick={() => setEditCategory(null)}
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Hủy
            </button>
          </div>
        )} */}

        {/* Danh sách danh mục */}
        <ul className="list-disc pl-8">
          {categories?.map((category) => (
            <li key={category._id} className="mb-2">
              <div className="p-2 flex justify-between items-center">
                <strong>{category.name}</strong>
                <div>
                  <button
                    onClick={() => openSetting(category)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Sửa
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                  <button
                    onClick={() => handleToggleSubcategories(category._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded ml-2">Xem danh mục con</button>
                </div>
              </div>
              {openParentId === category._id && (
                <div className="p-4 border border-gray-300 rounded mt-2 bg-gray-50">
                  <h3 className="text-lg font-bold mb-4">Danh mục con</h3>
                  <ul className="list-disc pl-8">
                    {categoriesChild?.map((child) => (
                      <li key={child._id} className="mb-2">
                        <div className="p-2 flex justify-between items-center">
                          <span>{child.name}</span>
                          <div>
                            <button
                              className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteChildCategory(child._id)}
                              className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                              Xóa
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={handleToggleChildcategories}
                    className={`${addChildCategory ? 'bg-red-500' : 'bg-blue-500'} text-white px-4 py-2 rounded mt-4`}
                  >
                    {addChildCategory ? "Đóng" : "Thêm danh mục con"}
                  </button>
                  {addChildCategory && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newCategoryChild}
                        onChange={(e) => setNewCategoryChild(e.target.value)}
                        placeholder="Nhập tên danh mục..."
                        className="border p-2 mr-2"
                      />
                      <button
                        onClick={addCategoryChild}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Thêm
                      </button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
        {config && currentCate && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white w-1/2 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Chỉnh sửa danh mục</h2>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Tên danh mục</label>
                <input
                  name="name"
                  type="text"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentCate.name}
                  onChange={(e) => handeChangeUpdate(e)}

                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Mô tả</label>
                <input
                  type="text"
                  name="description"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentCate.description}
                  onChange={(e) => handeChangeUpdate(e)}

                />
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-700">Hình ảnh</label>
                <img
                  // className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  src={currentCate.image ? currentCate.image : "no image"}

                />
              </div>
              {/* <div className="mb-4">
                <label className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  value={currentUser.email}
                  readOnly
                />
              </div> */}

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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="light"
          transition={Bounce}
        />
      </div>
    </>
  )
}

export default AdminCategory