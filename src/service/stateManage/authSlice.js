import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    isAuth: JSON.parse(localStorage.getItem('isAuth')) || false,
    isLoading: false,
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || ''
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
            // Xóa thông tin khỏi localStorage
            localStorage.removeItem('isAuth');
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        }
    }
});


export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer;