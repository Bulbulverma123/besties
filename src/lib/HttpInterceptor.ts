import axios from 'axios'

const rawServer = import.meta.env.VITE_SERVER || 'https://besties-api-unba.onrender.com'
export const SERVER_URL = rawServer.trim().replace(/\/$/, '')

const HttpInterceptor = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true
})

HttpInterceptor.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default HttpInterceptor