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
          session && onlineUsers.filter((item: any) => item.id !== session.id).map((item: any, index) => (
            <div key={index} className="flex">
              <div>
                <img src="/images/avtar.jpg" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h1 className="font-medium mb-1 capitalize">{item.fullname}</h1>
                  <div className="flex items-center gap-3">
                    <label className={`capitalize-first text-[10px] font-medium text-green-400`}>Online</label>

                    <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/chat/${item.id}`, item)}>
                      <i className="ri-chat-ai-line text-rose-400"></i>
                    </button>

                    <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/audio-chat/${item.id}`, item)}>
                      <i className="ri-phone-line text-amber-400"></i>
                    </button>


                    <button className="hover:cursor-pointer" onClick={() => generateActiveSession(`/app/video-chat/${item.id}`,item)}>
                      <i className="ri-video-on-ai-line text-green-400"></i>
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