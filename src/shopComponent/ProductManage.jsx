import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import Select from 'react-select';
import settings from '../public/settings.svg'
import { useSelector } from 'react-redux';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import LoadingSpinner from './LoadingSpinner';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const ProductManage = () => {
    // const [editorData, setEditorData] = useState('');
    const auth = useSelector((state) => state.auth);
    const [productLists, setProductLists] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addProduct, setAddProduct] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({
        productName: '',
        price: '',
        description: '',
        image: '',
    });
    const [config, setConfig] = useState(false)
    const [formAddProduct, setFormAddProduct] = useState({
        name: '',
        price: '',
        description: '',
        email: '',
        category: '',
        image: '',
        imageDetail: [],
        shopId: auth.user.shopId._id,
    });
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
    // const handleEditorChange = (event, editor) => {
    //     const data = editor.getData();
    //     setEditorData(data);
    //     setFormAddProduct((prevProduct) => ({
    //         ...prevProduct,
    //         description: data,
    //     }));
    // };

    const getProducts = async () => {
        const response = await axiosInstance.post('/shop/productList',
            { id: auth.user.shopId._id },
            { params: query });
        const { productList, totalPages, totalProducts } = response.data;
        setProductLists(productList);
        setPagination({
            ...pagination,
            totalPages,
            totalProducts
        });
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
    const formatPrice = (price) => {
        if (!price) return '';
        return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    useEffect(() => {
        getProducts();
        listCategory();
    }, [query])

    const openSetting = (product) => {
        setCurrentProduct(product);
        setConfig(!config);
    };
    const closePopup = () => {
        setAddProduct(false);
        setConfig(false);
        setCurrentProduct(null);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'price') {
            let formattedValue = value.replace(/[^0-9]/g, '');
            setFormAddProduct((prevProduct) => ({
                ...prevProduct,
                [name]: formattedValue ? formattedValue.replace(/\./g, '') : '',
            }));
        } else if (files) {
            if (name === 'imageDetail') {
                setFormAddProduct((prevState) => ({
                    ...prevState,
                    [name]: Array.from(files),
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
const handeChangeUpdate = (e) => {
    const { name, value } = e.target;
    if (name === 'price') {
        let formattedValue = value.replace(/[^0-9]/g, '');
        setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            [name]: formattedValue ? formattedValue.replace(/\./g, '') : '',
        }));
    }else{
    setCurrentProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
    }));
}
}
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            setLoading(false);
            if (response.status === 201) {
                toast.success('Thêm sản phẩm thành công');
                getProducts();
                setAddProduct(false);
            } else {
                toast.error('Thêm sản phẩm thất bại');
            }
        } catch (error) {
            console.error('Error creating product', error);
        }
    };
 const updateProduct = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', currentProduct.productName);
        formData.append('price', currentProduct.price);
        formData.append('description', currentProduct.description);
        formData.append('category', currentProduct.category);
        formData.append('image', currentProduct.image);
        formData.append('shopId', auth.user.shopId._id);
        try {
            const response = await axiosInstance.put(`/shop/updateProduct/${currentProduct._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setLoading(false);
            if (response.status === 201) {
                toast.success('Cập nhật sản phẩm thành công');
                getProducts();
                setConfig(false);
            } else {
                toast.error('Cập nhật sản phẩm thất bại');
            }
        } catch (error) {
            console.error('Error updating product', error);
        }
 }
 const deleteProduct = async () => {
    try {
        const response = await axiosInstance.delete(`/shop/deleteProduct/${currentProduct._id}?shopId=${auth.user.shopId._id}`);
        if (response.status === 200) {
            toast.success('Xóa sản phẩm thành công');
            getProducts();
        } else {
            toast.error('Xóa sản phẩm thất bại');
        }
    } catch (error) {
        console.error('Error deleting product', error);
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

    const handleLimitChange = (e) => {
        const newLimit = parseInt(e.target.value);
        setQuery({ ...query, limit: newLimit, page: 1 });
    };

    const handlePageChange = (page) => {
        setQuery({ ...query, page });
    };
    return (
        <>
            {loading && <LoadingSpinner />}
            <nav className="bg-blue-600 text-white py-4 px-6 shadow-md ">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
                </div>
            </nav>
            <div className='mt-4 overflow-x-auto rounded-lg relative'>
                <button onClick={() => setAddProduct(!addProduct)}>Thêm sản phẩm mới</button>
            </div>
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg w-full mt-6 relative">
                <div className="flex justify-between px-6 py-4 border-b bg-gray-200">
                    <p className="font-semibold w-1/5 text-center text-sm text-gray-800">Hình ảnh</p>
                    <p className="font-semibold w-1/5 text-center text-sm text-gray-800">Tên sản phẩm</p>
                    <p className="font-semibold w-1/5 text-center text-sm text-gray-800">Giá</p>
                    <p className="font-semibold w-1/5 text-center text-sm text-gray-800">Tình trạng</p>
                    <p className="font-semibold w-1/5 text-center text-sm text-gray-800">Hành động</p>
                </div>
                {productLists?.map((product) => (
                    <div key={product._id} className="flex justify-evenly items-center border-b text-sm hover:bg-gray-50 transition-all duration-300 ease-in-out">
                        <div className="w-1/4 flex justify-center">
                            {product.image && (
                                <img
                                    className="w-28 p-3 h-20 "
                                    src={product.image}
                                    alt="product"
                                />
                            )}
                        </div>
                        <p className="w-1/4 text-gray-800">{product.productName}</p>
                        <p className="w-1/5 pl-2  text-gray-800">{formatPrice(product.price.toString())} VND</p>
                        <p className="w-1/5 pl-11 text-gray-800">{product.status || 'Còn hàng'}</p>
                        <div className="w-1/5 pl-16">
                            <img
                                onClick={() => openSetting(product)}
                                className="w-8 cursor-pointer transition-transform duration-200 hover:scale-105"
                                src={settings}
                                alt="config icon"
                            />
                        </div>
                    </div>
                ))}
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

            {config && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white w-1/2 p-6 rounded-lg">
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Tên sản phẩm</label>
                            <input
                                type="text"
                                name='productName'
                                onChange={(e) => handeChangeUpdate(e)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={currentProduct.productName}
                                
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Giá</label>
                            <input
                                type="text"
                                name='price'
                                onChange={(e) => handeChangeUpdate(e)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={formatPrice((currentProduct.price).toString())}
                                
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Mô tả</label>
                            <textarea
                                type="text"
                                name='description'
                                onChange={(e) => handeChangeUpdate(e)}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                value={currentProduct.description}
                                
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Hình ảnh chính</label>
                            <img
                                type="email"
                                name='image'
                                onChange={(e) => handeChangeUpdate(e)}
                                className="w-1/6 cursor-pointer transition-transform duration-200 hover:scale-105"
                                src={currentProduct.image}
                               
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                            onClick={updateProduct}
                            className="bg-blue-500 text-white py-2 px-4 rounded-md">Cập nhật</button>

                            <button
                            onClick={deleteProduct}
                            className="bg-red-500 text-white py-2 px-4 rounded-md">Xóa</button>
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
            {addProduct && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white w-1/2 p-6 max-h-fit rounded-lg">
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
                                value={formatPrice(formAddProduct.price)}
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
                            {/* <CKEditor
                                editor={ClassicEditor}
                                data={editorData}
                                onChange={handleEditorChange}  // Được gọi khi người dùng thay đổi nội dung
                                config={{
                                    licenseKey: 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3Mzg1NDA3OTksImp0aSI6IjU2ODU5MjNlLTVmMDYtNDUyYS1iOWQ3LTQwNTNiNWExNGM1YyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6Ijc0MjIwMDVlIn0.TFjkQnf55ojpHWr9hzj_Se62kBIJFdjNgeVHmkCbi6AXNS4PQjiIoEHSVn80kGk9l2fnhyiAJ9KqObCSrsbKPg', // Thay YOUR_LICENSE_KEY bằng khóa giấy phép của bạn
                                    // extraPlugins: [MyCustomUploadAdapterPlugin],
                                    ckfinder: {
                                        uploadUrl: 'http://localhost:8080/shop/addProduct'  // Đường dẫn để upload hình ảnh
                                    }
                                }}
                            /> */}
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700">Thể loại</label>
                            <Select
                                name="category"
                                isClearable
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
        </>
    )
}

export default ProductManage;
