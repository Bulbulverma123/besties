import Card from "../../shared/Card"
import socket from "../../../lib/socket"
import { useEffect, useState, useContext } from 'react'
import {useNavigate} from "react-router-dom"
import Context from "../../../Context"


const FriendsOnline = () => {
  const [onlineUsers, setOnlineUsers] = useState([])
  const { session, setLiveActiveSession } = useContext(Context)
  const navigate = useNavigate()


  const onlineHandler = (users: any) => {
    setOnlineUsers(users)
  }

  const generateActiveSession = (url: string, user: any) =>{
     setLiveActiveSession(user)
     navigate(url)
  }

  useEffect(() => {
    socket.on("online", onlineHandler)

    socket.emit("get-online")

    return () => {
      socket.off("online", onlineHandler)
    }
  }, [])

  return (
    <Card title="online friends" divider>
      <div className="space-y-6">
        {
          session && onlineUsers.filter((item: any) => String(item.id) !== String(session.id)).map((item: any, index) => (
            <div key={index} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100">
              <img src={item.image || "/images/avtar.jpg"} className="w-11 h-11 rounded-full object-cover border border-indigo-100 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h1 className="font-medium text-sm text-gray-800 truncate capitalize">{item.fullname}</h1>
                <div className="flex items-center justify-between mt-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online
                  </span>

                  <div className="flex items-center gap-2.5">
                    <button title="Chat" className="hover:scale-110 transition-transform hover:cursor-pointer p-1" onClick={() => generateActiveSession(`/app/chat/${item.id}`, item)}>
                      <i className="ri-chat-ai-line text-rose-500 text-lg"></i>
                    </button>

                    <button title="Audio Call" className="hover:scale-110 transition-transform hover:cursor-pointer p-1" onClick={() => generateActiveSession(`/app/audio-chat/${item.id}`, item)}>
                      <i className="ri-phone-line text-amber-500 text-lg"></i>
                    </button>

                    <button title="Video Call" className="hover:scale-110 transition-transform hover:cursor-pointer p-1" onClick={() => generateActiveSession(`/app/video-chat/${item.id}`, item)}>
                      <i className="ri-video-on-ai-line text-emerald-500 text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </Card>
  )
}

export default FriendsOnline