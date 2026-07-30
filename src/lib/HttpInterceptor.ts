const env = import.meta.env
import axios from 'axios'
const HttpInterceptor = axios.create({
    baseURL: env.VITE_SERVER,
    withCredentials: true
})

HttpInterceptor.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default HttpInterceptor