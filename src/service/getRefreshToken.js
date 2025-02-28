import axios from  'axios';
url = "https://ecommerce-83cjyllkn-thangs-projects-c4756ebe.vercel.app"
// 'http://localhost:8080'
const axiosInstance = axios.create({
    baseURL: url,
    headers:{
       "Content-Type":  "multipart/form-data"
    },
    withCredentials: 'true'
})

axiosInstance.interceptors.response.use(
    (response) => response ,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axiosInstance.post('/refresh-token', {}, { withCredentials: true });
                localStorage.setItem('accessToken', data.accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                console.error('Failed to refresh token', err);
                localStorage.clear();
                window.location.href = '/login';
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }

);

axiosInstance.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

export default axiosInstance;