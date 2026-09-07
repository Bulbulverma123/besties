import { useContext, useEffect, useRef, useState } from "react"
import Button from "../shared/Button"
import Card from "../shared/Card"
import Context from "../../Context"
import { useNavigate, useParams } from "react-router-dom"
import CatchError from "../../lib/CatchError"
import HttpInterceptor from "../../lib/HttpInterceptor"
import { Modal, notification } from "antd"
import socket from "../../lib/socket"
import { CallType, OnAnswerInterface, OnCandidateInterface, OnOfferInterface } from "./Video"


const AudioChat = () => {
  const { id } = useParams()
  const [isMic, setIsMic] = useState(false)
  const navigate = useNavigate()
  const { session, liveActiveSession, sdp, setSdp } = useContext(Context)
  const localAudio = useRef<HTMLAudioElement | null>(null)
  const remoteAudio = useRef<HTMLAudioElement | null>(null)
  const localStream = useRef<MediaStream | null>(null)
  const rtc = useRef<RTCPeerConnection | null>(null)
  const [notify, notifyUi] = notification.useNotification();
  const audio = useRef<HTMLAudioElement | null>(null)
  const [status, setStatus] = useState<CallType>('pending')
  const [open, setOpen] = useState(false)

  const stopAudio = () => {
    if (!audio.current)
      return

    audio.current.pause()
    audio.current.currentTime = 0
  }

  const playAudio = (src: string, loop: boolean = false) => {
    stopAudio()

    if (!audio.current)
      audio.current = new Audio()

    const player = audio.current
    player.src = src
    player.loop = loop
    player.load()
    player.play().catch((err) => console.log("Audio autoplay prevented:", err))
  }

  const toggleMic = async () => {
  try {
    if (!localStream.current) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (localAudio.current) {
        localAudio.current.srcObject = stream
        localAudio.current.play().catch(e => console.log("Local audio play err:", e))
      }

      localStream.current = stream
      setIsMic(true)
    }
    else {
      const enabled = !isMic
      localStream.current.getTracks().forEach((track) => {
        track.enabled = enabled
      })
      setIsMic(enabled)
    }
  }
  catch (err) {
    CatchError(err)
  }
}

  const connection = async () => {
    let iceServers = [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" }
    ]
    try {
      const { data } = await HttpInterceptor.get("/twilio/turn-server")
      if (data && Array.isArray(data) && data.length > 0) {
        iceServers = data
      }
    } catch (err) {
      console.log("Using fallback ICE servers for audio call", err)
    }

    try {
      rtc.current = new RTCPeerConnection({ iceServers })
      const localStreaming = localStream.current

      if (localStreaming) {
        localStreaming.getTracks().forEach((track) => {
          rtc.current?.addTrack(track, localStreaming)
        })
      }

      rtc.current.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("candidate", { candidate: e.candidate, to: id })
        }
      }

      rtc.current.onconnectionstatechange = () => {
        console.log("Audio RTC state:", rtc.current?.connectionState)
      }

      rtc.current.ontrack = (e) => {
        if (e && remoteAudio.current) {
          const remoteStream = e.streams[0]
          remoteAudio.current.srcObject = remoteStream
          remoteAudio.current.play().catch(err => console.log("Remote audio play error:", err))
        }
      }
    }
    catch (err) {
      CatchError(err)
    }
  }

  const endStreaming = () => {
    localStream.current?.getTracks().forEach((track) => track.stop())

    if (localAudio.current)
      localAudio.current.srcObject = null

    if (remoteAudio.current)
      remoteAudio.current.srcObject = null
  }

  const startCall = async () => {
    try {
      await connection()

      if (!rtc.current)
        return

      const offer = await rtc.current.createOffer()
      await rtc.current.setLocalDescription(offer)

      notify.open({
        message: <h1 className='capitalize font-medium'>{liveActiveSession?.fullname || "Friend"}</h1>,
        description: 'Calling...',
        duration: 30,
        placement: 'bottomRight',
        onClose: stopAudio,
        actions: [
          <button key="end" className="bg-rose-500 px-6 py-2 rounded font-medium text-white hover:bg-rose-600">End call</button>
        ]
      })

      playAudio("/sound/ring.mp3", true)


      setStatus('calling')
      socket.emit("offer", { offer, to: id, from: session, type: 'audio' })
    }
    catch (err) {
      CatchError(err)
    }
  }

  const acceptCall = async (payload: OnOfferInterface) => {
    try {
      setSdp(null)
      await connection()

      if (!rtc.current)
        return

      const offer = new RTCSessionDescription(payload.offer)
      await rtc.current.setRemoteDescription(offer)

      const answer = await rtc.current.createAnswer()
      await rtc.current.setLocalDescription(answer)

      notify.destroy()
      setStatus('talking')
      stopAudio()
      socket.emit("answer", { answer, to: id })
    }
    catch (err) {
      CatchError(err)
    }
  }

  const endCallOnLocal = () => {
    setStatus('end')
    playAudio("/sound/reject.mp3")
    notify.destroy()
    socket.emit("end", { to: id })
    endStreaming()
    setOpen(true)
  }

  const redirectOnCallEnd = () => {
    setOpen(false)
    navigate("/app")
  }

  useEffect(() => {
    toggleMic()
  }, [])

  useEffect(() => {
    if (sdp) {
      notify.destroy()
      onOffer(sdp)
    }
  }, [sdp])

  //Event Listeners


  const onOffer = (payload: OnOfferInterface) => {
    try {
      notify.open({
        message: <h1 className='capitalize font-medium'>{payload.from?.fullname || "Friend"}</h1>,
        description: 'Incomming...',
        duration: 30,
        placement: 'bottomRight',
        onClose: stopAudio,
        actions: [
          <button key="accept" className="mr-3 bg-green-400 px-6 py-2 rounded font-medium text-white hover:bg-green-500" onClick={() => acceptCall(payload)}>Accept</button>,
          <button key="end" className="bg-rose-500 px-6 py-2 rounded font-medium text-white hover:bg-rose-600" onClick={endCallOnLocal}>Reject</button>

        ]
      })

      playAudio("/sound/ring.mp3", true)

      setStatus('incomming')
    }
    catch (err) {
      CatchError(err)
    }
  }


  const onAnswer = async (payload: OnAnswerInterface) => {
    try {
      if (!rtc.current)
        return
      const answer = new RTCSessionDescription(payload.answer)
      await rtc.current.setRemoteDescription(answer)

      setStatus('talking')
      stopAudio()
      notify.destroy()
    }
    catch (err) {
      CatchError(err)
    }
  }

  const onEndCallRemote = async () => {
    setStatus("end")
    notify.destroy()
    playAudio("/sound/reject.mp3")
    endStreaming()
    setOpen(true)
  }
  const onCandidate = async (payload: OnCandidateInterface) => {
    try {
      if (!rtc.current || !payload.candidate)
        return

      const candidate = new RTCIceCandidate(payload.candidate)
      await rtc.current.addIceCandidate(candidate)

    }
    catch (err) {
      console.warn("Audio candidate error:", err)
    }
  }
  useEffect(() => {
    socket.on('offer', onOffer)
    socket.on('candidate', onCandidate)
    socket.on('answer', onAnswer)
    socket.on("end", onEndCallRemote)

    return () => {
      socket.off('offer', onOffer)
      socket.off('candidate', onCandidate)
      socket.off('answer', onAnswer)
      socket.off("end", onEndCallRemote)
    }
  }, [])

  
  // if (!liveActiveSession)
  //   return navigate("/app")

  // Baad mein:
  useEffect(() => {
    if (!liveActiveSession) {
      navigate("/app")
    }
  }, [liveActiveSession])

  if (!liveActiveSession)
    return null

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title={session?.fullname}>
          <audio hidden ref={localAudio} muted playsInline />
          <audio hidden ref={remoteAudio} autoPlay playsInline />

          <div className="flex flex-col items-center">
            < img
              src={session?.image || "/images/avtar.jpg"}
              alt="avtar"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
            />
          </div>
        </Card>

        <Card title={liveActiveSession?.fullname || "Friend"}>
          <div className="flex flex-col items-center">
            < img
              src={liveActiveSession?.image || "/images/avtar.jpg"}
              alt="avtar"
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover"
            />
          </div>
        </Card>

      </div>

      <div className=" flex justify-between items-center">
        <div className='space-x-4'>
          <button onClick={toggleMic} className='bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white'>
            {
              isMic ?
                <i className="ri-mic-line"></i>
                :
                <i className="ri-mic-off-line"></i>
            }
          </button>
        </div>
        {
          (status === 'pending' || status === 'end') &&
          <Button icon="phone-line" type="success" onClick={startCall}>Start call</Button>
        }
        {
          (status === 'calling' || status === 'talking') &&
          <Button icon="phone-line" type="danger" onClick={endCallOnLocal} >End call</Button>
        }
      </div>
      {notifyUi}
      <Modal open={open} footer={null} centered maskClosable onCancel={redirectOnCallEnd}>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Call Ended</h1>
          <Button type="danger" onClick={redirectOnCallEnd}>Thank You</Button>
        </div>
      </Modal>
    </div>
  )
}

export default AudioChat