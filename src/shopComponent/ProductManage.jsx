import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import Select from 'react-select';
import { useSelector } from 'react-redux';
const ProductManage = () => {
    const auth = useSelector((state) => state.auth);
    const [productLists, setProductLists] = useState([]);
    const [category, setCategory] = useState([]);
    const [addProduct, setAddProduct] = useState(false);
    const [formAddProduct, setFormAddProduct] = useState({
        name: '',
        price: '',
        description: '',
        email: '',
        category: '',
        image: '',
        imageDetail: [],
        shopId: auth.user.shopId._id,
    })
    const getProducts = async () => {
        const response = await axiosInstance.get('/shop/productList');
        setProductLists(response.data);
    }

    const listCategory = async () => {
        try {
            const response = await axiosInstance.get('/category/list');
            const categoriesWithChildren = await Promise.all(
                response.data.listCategory.map(async (category) => {
                    const childResponse = await axiosInstance.get(`/category/listChild/${category._id}`);
                    return {
                        ...category,
                        children: childResponse.data.listChildCategory || [],
                    };
                })
            );
            setCategory(categoriesWithChildren);
        } catch (error) {
            console.error('Lỗi khi lấy danh mục:', error);
        }
    }
    useEffect(() => {
        getProducts();
        listCategory();
    }, [])

    const closePopup = () => {
        setAddProduct(false);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'price') {
            // Loại bỏ các ký tự không phải số và định dạng số
            let formattedValue = value.replace(/[^0-9]/g, '');
            if (formattedValue) {
                formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            }

            // Cập nhật giá trị 'price' trong form
            setFormAddProduct((prevProduct) => ({
                ...prevProduct,
                [name]: Number(formattedValue),
            }));
        } else if (files) {
            if (name === 'imageDetail') {
                setFormAddProduct((prevState) => ({
                    ...prevState,
                    [name]: Array.from(files), // Lưu trữ tất cả các tệp đã chọn
                }));
            } else {
                setFormAddProduct((prevState) => ({
                    ...prevState,
                    [name]: files[0],
                }));
            }
        } else {
            setFormAddProduct((prevProduct) => ({
                ...prevProduct,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', formAddProduct.name);
        formData.append('price', formAddProduct.price);
        formData.append('description', formAddProduct.description);
        formData.append('category', formAddProduct.category);
        formData.append('image', formAddProduct.image);
        formData.append('shopId', formAddProduct.shopId);

        if (formAddProduct.imageDetail && formAddProduct.imageDetail.length > 0) {
            formAddProduct.imageDetail.forEach((file) => {
                formData.append('imageDetail', file);
            });
        }
        try {
            const response = await axiosInstance.post('/shop/addProduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            //   console.log('Product created successfully', response.data);
        } catch (error) {
            console.error('Error creating product', error);
        }
    };

    const categoryOptions = category.flatMap((cat) => [
        { value: cat._id, label: cat.name },
        ...cat.children.map((child) => ({
            value: child._id,
            label: `-- ${child.name}`,
        })),
    ]);

    const handleCategoryChange = (selectedOption) => {
        setFormAddProduct((prevProduct) => ({
            ...prevProduct,
            category: selectedOption ? selectedOption.value : '',
        }));
    };

    return (
        <>
            <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                </div>
            </nav>
            <div className='mt-4 overflow-x-auto rounded-lg relative'>
                <button
                    onClick={() => setAddProduct(!addProduct)}
                >Thêm sản phẩm mới</button>
            </div>
            {addProduct && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex  justify-center items-center z-50">
                    <div className="bg-white  w-1/2 p-6 max-h-fit rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">Thêm sản phẩm</h2>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Tên sản phẩm</label>
                            <input
                                type="text"
                                name='name'
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={formAddProduct.name}
                                onChange={(e) => handleChange(e)}

                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Giá</label>
                            <input
                                type="text"
                                name='price'
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={formAddProduct.price}
                                onChange={(e) => handleChange(e)}
                            />

                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Mô tả</label>
                            <textarea
                                type="text"
                                name='description'
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={formAddProduct.description}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Thể loại</label>
                            <Select
                                name="category"
                                isClearable // Cho phép xóa lựa chọn
                                // isMulti={true}  Chọn nhiều thể loại
                                options={categoryOptions}
                                value={categoryOptions.find(
                                    (option) => option.value === formAddProduct.category
                                )}
                                onChange={handleCategoryChange}
                                placeholder="Chọn thể loại"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Hình ảnh</label>
                            <input
                                type="file"
                                name='image'
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Hình ảnh chi tiết</label>
                            <input
                                type="file"
                                name='imageDetail'
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                multiple
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Thêm</button>
                            <button
                                onClick={closePopup}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ProductManage