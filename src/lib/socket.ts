const env = import.meta.env

import {io} from 'socket.io-client'
const socket = io(env.VITE_SERVER, {
    withCredentials: true,
    auth: {
        token: typeof window !== 'undefined' ? localStorage.getItem("accessToken") || "" : ""
    }
})
export default socket