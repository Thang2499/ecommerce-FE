import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from '../getRefreshToken';

export const fetchWishList = createAsyncThunk(
    "auth/fetchWishList",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/system/wishList", { id: userId });
        return response.data || [];
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi lấy danh sách yêu thích");
      }
    }
  );

  const initialState = {
    isAuth: JSON.parse(localStorage.getItem('isAuth')) ?? false,  
    isLoading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, 
    accessToken: localStorage.getItem('accessToken') || '',
    wishList: [],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            // Lưu thông tin vào localStorage
            localStorage.setItem('isAuth', true);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        logout: (state) => {
            state.isAuth = false;
            state.user = null;
            state.accessToken = '';
            state.wishList = [];
            // Xóa thông tin khỏi localStorage
            localStorage.removeItem('isAuth');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
          .addCase(fetchWishList.fulfilled, (state, action) => {
            state.wishList = action.payload;
          })
          .addCase(fetchWishList.rejected, (state, action) => {
            console.error("Lỗi khi cập nhật wishlist:", action.payload);
          });
      },
});


export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer;