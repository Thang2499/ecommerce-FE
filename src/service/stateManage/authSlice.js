import {createSlice} from '@reduxjs/toolkit'
const initialState = {
    isAuth:false,
    isLoading:false,
    user:null,
    accessToken:''
}

export const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        login: (state,action) => {
            state.isAuth = true
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
        },
        logout: (state,action) => {
            state.isAuth = false
            state.isLoading = false
            state.accessToken = ''
        },
        setLoading: (state,action) => {
            state.isLoading = action.payload
        }
    }
});

export const {login, logout, setLoading} = authSlice.actions

export default authSlice.reducer;