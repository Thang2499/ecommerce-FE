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

  export const fetchCart = createAsyncThunk(
    "auth/fetchCart",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/system/cart", { id: userId });
        return response.data || [];
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi lấy giỏ hàng");
      }
    }
  );

  export const fetchUserInfo = createAsyncThunk(
    "auth/fetchUserInfo",
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/user/fetchUserInfo", { id: userId });
        return response.data || [];
      } catch (error) {
        return rejectWithValue(error.response?.data || "Lỗi khi lấy thông tin người dùng");
      }
    }
  );
  const initialState = {
    isAuth: JSON.parse(localStorage.getItem('isAuth')) ?? false,  
    isLoading: false,
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null, 
    accessToken: localStorage.getItem('accessToken') || '',
    wishList: [],
    userCart:[],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true;
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            localStorage.setItem('isAuth', true);
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('accessToken', action.payload.accessToken);
        },
        logout: (state) => {
            state.isAuth = false;
            state.user = null;
            state.accessToken = '';
            state.wishList = [];
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
      .addCase(fetchWishList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchWishList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishList = action.payload;
      })
      .addCase(fetchWishList.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Lỗi khi cập nhật wishlist:", action.payload);
      })

      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Lỗi khi cập nhật giỏ hàng:", action.payload);
      })

      .addCase(fetchUserInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload));
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.isLoading = false;
        console.error("Lỗi khi cập nhật thông tin người dùng:", action.payload);
      });    
      },
});


export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer;