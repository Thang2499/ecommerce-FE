import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import axiosInstance from '../service/getRefreshToken';
import { toast } from 'react-toastify';
import { toastifyOptions } from '../service/toast';
import ProductListChild from './ProductListChild';

const BodyByCategory = () => {
    const { CategoryId } = useParams();
    const [productList, setProductList] = useState([]);
    const getProductByCategory = async () => {
      try {
        const response = await axiosInstance.get(`/system/productByCategory/${CategoryId}`);
        setProductList(response.data);
      } catch (error) {
        if (error.response) { 
          if (error.response.status === 404) {
            toast.info('Sản phẩm hiện chưa có', toastifyOptions(2000));
            return;
          }
        }
        console.log('Failed to fetch product list: ', error);
      }
    };
    useEffect(() => {
        getProductByCategory();
    }, [CategoryId])
  return (
    <div className='mt-12'>
        {productList ? (<div className='grid grid-cols-6 gap-1 '>{productList.map(item => (<ProductListChild key={item._id} items={item} />))}</div>) : <p>Loading</p>}
      </div>
  )
}

export default BodyByCategory;