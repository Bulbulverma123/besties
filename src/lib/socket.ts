import { io } from 'socket.io-client'
import { SERVER_URL } from './HttpInterceptor'

const socket = io(SERVER_URL, {
    withCredentials: true,
    auth: (cb) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem("accessToken") || "" : ""
        cb({ token })
    }
})

export default socket