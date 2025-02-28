import React, { useEffect, useState } from 'react';
import axiosInstance from '../service/getRefreshToken';
import { Link } from 'react-router-dom';

const Category = ({ onPriceFilter }) => {
  const [categories, setCategories] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");

  const priceRanges = [
    { value: "", label: "Tất cả giá" },
    { value: "1000000-5000000", label: "1 triệu - 5 triệu" },
    { value: "5000000-10000000", label: "5 triệu - 10 triệu" },
    { value: "10000000-20000000", label: "10 triệu - 20 triệu" },
    { value: "20000000-999999999", label: "Trên 20 triệu" }
  ];

  useEffect(() => {
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
    
    fetchCategories();
  }, []);

  const handlePriceChange = (e) => {
    setSelectedPrice(e.target.value);
    onPriceFilter(e.target.value); // Gửi giá trị đã chọn lên component cha
  };

  return (
    <div className="p-4 bg-slate-300 w-60">
      {/* Dropdown chọn khoảng giá */}
      <div className="mb-4">
        <label className="text-gray-700 font-semibold">Lọc theo giá:</label>
        <select
          value={selectedPrice}
          onChange={handlePriceChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Danh sách danh mục */}
      <ul>
        {categories.map((parentCategory) => (
          <li key={parentCategory._id} className="relative group border-b border-slate-400 p-2 hover:bg-slate-400">
            <span className="text-lg font-semibold">{parentCategory.name}</span>

            {/* Danh mục con */}
            {parentCategory.children.length > 0 && (
              <ul className="absolute left-full top-0 hidden group-hover:block bg-slate-200 shadow-lg rounded w-48">
                {parentCategory.children.map((childCategory) => (
                  <li key={childCategory._id} className="border-b border-slate-400 p-2 hover:text-orange-400">
                    <Link to={`/${childCategory._id}`}>{childCategory.name}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Category;
