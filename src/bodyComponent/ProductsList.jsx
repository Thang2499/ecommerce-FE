import React, { useEffect, useState } from 'react'
import axiosInstance from '../service/getRefreshToken';
import ProductListChild from './ProductListChild';

const ProductsList = () => {
  const [productList, setProductList] = useState([]);
  const getProductList = async () => {
    try {
      const response = await axiosInstance.get('/system/systemProduct',
        { params: query }
      );
      if (response.status !== 200) {
        console.log('Failed to fetch product list: ', response);
        return;
      }
      const { getProductsList, totalPages, totalProducts } = response.data;
      setProductList(getProductsList);
      setPagination({
        ...pagination,
        totalPages,
        totalProducts
      });
    } catch (error) {
      console.log('Failed to fetch product list: ', error);
    }
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
  const handlePageChange = (page) => {
    setQuery({ ...query, page });
  };
  useEffect(() => {
    getProductList();
  }, [])

  return (
    <>
      <div className='mt-12'>
        {productList ? (<div className='grid grid-cols-6 gap-1 ml-5 '>{productList.map(item => (<ProductListChild key={item._id} items={item} />))}</div>) : <p>Loading</p>}
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

      </div>
    </>
  )
}

export default ProductsList