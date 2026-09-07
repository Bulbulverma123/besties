import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import Avtar from "../shared/Avtar"
import Card from "../shared/Card"
import { useContext, useEffect, useRef, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../../Context"
import HttpInterceptor from "../../lib/HttpInterceptor"
import axios from 'axios'
import { v4 as uuid } from 'uuid'
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/Fetcher"
import CatchError from "../../lib/CatchError"
import FriendsSuggestion from "./friend/FriendSuggestion"
import FriendsRequest from "./friend/FriendsRequest"
import { useMediaQuery } from 'react-responsive'
import Logo from "../shared/Logo"
import IconButton from "../shared/IconButton"
import FriendsOnline from "./friend/FriendsOnline"
import socket from "../../lib/socket"
import { AudioSrcType, OnOfferInterface } from "./Video"
import { notification, Modal, Button as AntButton } from "antd"

const EightMinuteInMs = 8 * 60 * 1000

const Layout = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
  const [leftAsideSize, setLeftAsideSize] = useState(0)
  const [collapsseSize, setCollapseSize] = useState(0)
  const [photoModalOpen, setPhotoModalOpen] = useState(false)
  const { liveActiveSession, setLiveActiveSession, setSdp } = useContext(Context)
  const { pathname } = useLocation()
  const params = useParams()
  const paramsArray = Object.keys(params)
  const audio = useRef<HTMLAudioElement | null>(null)
  const [notify, notifyUi] = notification.useNotification()

   const stopAudio = () => {
      if (!audio.current)
        return
  
      const player = audio.current
      player.pause()
      player.currentTime = 0
    }
  
    const playAudio = (src: AudioSrcType, loop: boolean = false) => {
      stopAudio()
  
      if (!audio.current)
        audio.current = new Audio()
  
      const player = audio.current
      player.src = src
      player.loop = loop
      player.load()
      player.play().catch((err) => console.log("Audio play prevented:", err))
    }

  const navigate = useNavigate()
  const {error} = useSWR('/auth/refresh-token', Fetcher, {
      refreshInterval: EightMinuteInMs,
      shouldRetryOnError: false
  })

  const onOffer = (payload: OnOfferInterface) => {
    setSdp(payload)
    setLiveActiveSession(payload.from)

    if(payload.type === "video")
     return navigate(`/app/video-chat/${payload.from.socketId}`)

     if(payload.type === "audio")
     return navigate(`/app/audio-chat/${payload.from.socketId}`)

  }

  const startChat =(payload: any)=>{
    notify.destroy()
    setLiveActiveSession(payload.from)
    navigate(`/app/chat/${payload.from?.id || payload.from?._id}`)
  }

  const onMessage =(payload: any)=>{
    if(location.href.includes("/app/chat"))
      return 

    playAudio("/sound/chat.mp3")
     notify.open({
      message: <h1 className="font-medium capitalize">{payload.from?.fullname || "Friend"}</h1> ,
      description: payload.message,
      placement: 'bottomRight',
      duration: 30,
      actions: [
        <button key="chat" className="bg-green-400 hover:bg-green-500 text-white rounded px-6 py-2" onClick={()=>startChat(payload)}>Start Chat</button>
      ]
     })
  }

   useEffect(()=>{
      if(error) 
      {
          logout()
      }
   }, [error])

  useEffect(() => {
    socket.on("offer", onOffer)
    socket.on("message", onMessage)

    return () => {
      socket.off("offer", onOffer)
      socket.off("message", onMessage)
    }

  }, [])


  useEffect(() => {
    setLeftAsideSize(isMobile ? 0 : 350)
    setCollapseSize(isMobile ? 0 : 140)
  }, [isMobile])

  const { session, setSession } = useContext(Context)



  const menus = [
    {
      icon: "ri-home-9-line",
      href: "/app/dashboard",
      label: "dashboard"
    },
    {
      icon: "ri-chat-smile-3-line",
      href: "/app/my-posts",
      label: " my post"
    },
    {
      icon: "ri-group-line",
      href: "/app/friends",
      label: "friends"
    },
  ]

  const logout = async () => {
    try {
      await HttpInterceptor.post("/auth/logout")
      localStorage.removeItem("accessToken")
      navigate("/login")
    }
    catch (err) {
      CatchError(err)
    }
  }

  const getPathname = (path: string) => {
    const firstPath = path.split("/").pop()
    const finalPath = firstPath?.split("-").join(" ")
    return finalPath
  }

  const uploadImage = () => {
    setPhotoModalOpen(false)
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.click()
    input.onchange = async () => {
      if (!input.files)
        return

      const file = input.files[0]
      const path = `profile-pictures/${uuid()}.png`

      const payload = {
        path,
        type: file.type,
        status: "public-read"
      }

      try {
        const options = {
          headers: {
            'Content-Type': file.type
          }
        }
        const { data } = await HttpInterceptor.post("/storage/upload", payload)
        await axios.put(data.url, file, options)
        const { data: user } = await HttpInterceptor.put("/auth/profile-picture", { path })
        setSession({ ...session, image: user.image })
        mutate('/auth/refresh-token')
      }
      catch (err) {
        console.log(err)
      }
    }
  }

  const removeImage = async () => {
    setPhotoModalOpen(false)
    try {
      const { data: user } = await HttpInterceptor.put("/auth/profile-picture", { path: null })
      setSession({ ...session, image: user.image })
      mutate('/auth/refresh-token')
    }
    catch (err) {
      console.log(err)
    }
  }

  const ActiveSessionUi = () => {
    if (!liveActiveSession) {
      navigate("/app")
      return
    }

    return (
      <div className="flex gap-3">
        <img
          src={liveActiveSession.image || "/images/avtar.jpg"}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h1 className="font-medium capitalize">{liveActiveSession.fullname}</h1>
          <label className="text-xs text-green-400">Online</label>
        </div>
      </div>
    )
  }

  return (
    <div className=" min-h-screen">
      <nav className="lg:hidden flex justify-between items-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 sticky top-0 left-0 z-[20000] w-full py-4 px-6">
        <Logo />
        <div className="flex gap-4">
          <IconButton onClick={logout} icon="logout-circle-line" type="success" />
          <Link to="/app/friends">
            <IconButton icon="chat-ai-line" type="danger" />
          </Link>
          <IconButton onClick={() => setLeftAsideSize(leftAsideSize > 0 ? 0 : 250)} icon="menu-3-line" type="warning" />
        </div>
      </nav >

      {isMobile && leftAsideSize > 0 && (
        <div
          className="fixed inset-0 bg-black/50 z-[19999] transition-opacity"
          onClick={() => setLeftAsideSize(0)}
        />
      )}

      <aside
        className="bg-white fixed top-0 left-0 h-full lg:p-8 overflow-auto z-[20000] "
        style={{
          width: leftAsideSize,
          transition: "0.2s"
        }}>
        <div className="space-y-8 h-full lg:rounded-2xl p-8  bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900" >
          {
            leftAsideSize === collapsseSize ?
              <i className="ri-user-fill text-xl text-white animate__animated animate__fadeIn"></i>
              :

              <div className="animate__animated animate__fadeIn">
                {
                  session &&
                  <Avtar
                    title={session.fullname}
                    subtitle={session.email}
                    image={session.image || "/images/avtar.jpg"}
                    titleColor="white"
                    subtitleColor="#ddd"
                    onClick={() => setPhotoModalOpen(true)}
                  />

                }

              </div>
          }
          <div>

            {
              menus.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={() => isMobile && setLeftAsideSize(0)}
                  className="flex items-center gap-4 text-gray-300 py-3 hover:text-white"
                >
                  <i className={`${item.icon} text-xl`} title={item.label}></i>
                  <label className={`capitalize ${leftAsideSize === collapsseSize ? 'hidden' : ''}`}>{item.label}</label>
                </Link>
              ))
            }




            <button onClick={logout} className="flex items-center gap-3 text-gray-300 py-3 hover:text-white" title="Logout">
              <i className="ri-logout-circle-r-line text-xl"></i>
              <label className={leftAsideSize === collapsseSize ? 'hidden' : ''}>Logout</label>
            </button>
          </div>

        </div>
      </aside>

      <section
        className="lg:py-8  lg:px-1  flex lg:flex-row flex-col gap-8 p-4 md:p-6"
        style={{
          width: isMobile ? '100%' : `calc(100% - ${leftAsideSize}px)`,
          marginLeft: isMobile ? 0 : leftAsideSize,
          transition: "0.2s"
        }}
      >

        <div className="flex-1 order-1">
          <Card
            title={
              <div className="flex gap-4 items-center">
                <button className="lg:block hidden bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={() => setLeftAsideSize(leftAsideSize === 350 ? collapsseSize : 350)}>
                  <i className="ri-arrow-left-line"></i>
                </button>
                <h1>{paramsArray.length === 0 ? getPathname(pathname) : <ActiveSessionUi />}</h1>
              </div>
            }
            divider
          >
            {
              pathname === "/app" ?
                <Dashboard />
                :
                <Outlet />
            }

          </Card>
        </div>

        <aside className="bg-white lg:w-[400px] lg:pr-6 order-2 flex flex-col gap-8">
          <FriendsRequest /> 
          <FriendsSuggestion />
          <FriendsOnline />
        </aside>
        {notifyUi}
      </section>

      <Modal
        open={photoModalOpen}
        onCancel={() => setPhotoModalOpen(false)}
        footer={null}
        centered
        title="Profile Photo Settings"
      >
        <div className="flex flex-col gap-3 pt-4">
          <AntButton type="primary" size="large" onClick={uploadImage} icon={<i className="ri-upload-cloud-line" />}>
            Upload New Photo
          </AntButton>
          {session?.image && (
            <AntButton danger size="large" onClick={removeImage} icon={<i className="ri-delete-bin-line" />}>
              Remove Profile Photo
            </AntButton>
          )}
          <AntButton size="large" onClick={() => setPhotoModalOpen(false)}>
            Cancel
          </AntButton>
        </div>
      </Modal>
    </div>
  )
}
export default Layout