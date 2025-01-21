import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/getRefreshToken';

const Category = () => {
  const [categories, setCategories] = useState([]); // Danh sách danh mục cha và con

  const fetchCategories = async () => {
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
      setCategories(categoriesWithChildren);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4 bg-slate-300">
      <ul>
        {categories.map((parentCategory) => (
          <li key={parentCategory._id} className="group cursor-pointer border-b border-slate-400 p-2">
            <span className='text-lg'>{parentCategory.name}</span>
            {/* Danh sách danh mục con */}
            <ul className=" hidden group-hover:block bg-slate-200 cursor-pointer rounded ">
              {parentCategory.children.map((childCategory) => (
                <li className='hover:text-orange-400 border-b border-slate-400 p-2' key={childCategory._id}>
                  {childCategory.name}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
