import {BrowserRouter , Routes , Route} from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'
import 'animate.css';
import 'font-awesome/css/font-awesome.min.css'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Layout from './components/app/Layout'
import Dashboard from './components/app/Dashboard'
import Post from './components/app/Post'
import Video from './components/app/Video'
import Audio from './components/app/Audio'
import Chat from './components/app/Chat';
import NotFound from './components/NotFound';
import Context from './Context';
import { useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify';
import AuthGaurd from './guards/AuthGaurd';
import RedirectGard from './guards/RedirectGard';
import FriendsList from './components/app/friend/FriendsList';

const App = () => {

  const [session, setSession] = useState(null)
  const [liveActiveSession, setLiveActiveSession] = useState(null)
  const [sdp, setSdp] = useState(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  const playAudio = (src: string, loop: boolean = false) => {
    stopAudio()
    if (!audioRef.current) {
      audioRef.current = new (window as any).Audio()
    }
    const player = audioRef.current
    if (player) {
      player.src = src
      player.loop = loop
      player.load()
      player.play().catch((err: any) => console.log("Audio play error:", err))
    }
  }

  return (
    <Context.Provider value={{ session, setSession, liveActiveSession, setLiveActiveSession, sdp, setSdp, playAudio, stopAudio }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<RedirectGard />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route >
          <Route element={<AuthGaurd />}>
            <Route path="/app" element={<Layout />} >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="my-posts" element={<Post />} />
              <Route path="friends" element={<FriendsList />} />
              <Route path="video-chat/:id" element={<Video />} />
              <Route path="audio-chat/:id" element={<Audio />} />
              <Route path="chat/:id" element={<Chat />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </Context.Provider>

  )
}

export default App