import { useContext, useEffect, useRef, useState } from "react"
import CatchError from "../../lib/CatchError"
import Button from "../shared/Button"
import Context from "../../Context"
import { toast } from "react-toastify"
import socket from "../../lib/socket"
import { useNavigate, useParams } from "react-router-dom"
import { Modal, notification } from "antd"
import '@ant-design/v5-patch-for-react-19'
import HttpInterceptor from "../../lib/HttpInterceptor"

export interface OnOfferInterface {
  offer: RTCSessionDescriptionInit
  from: any
  type: 'video' | 'audio' | 'chat'
}

export interface OnAnswerInterface {
  answer: RTCSessionDescriptionInit
  from: string
}


export interface OnCandidateInterface {
  candidate: RTCIceCandidateInit
  from: string
}

export type CallType = "pending" | "calling" | "incomming" | "talking" | "end"
export type AudioSrcType = "/sound/ring.mp3" | "/sound/reject.mp3" | "/sound/busy.mp3" |"/sound/chat.mp3"

function getCallTiming(seconds: number): string {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hrs}:${mins}:${secs}`;
}

const Video = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { session, liveActiveSession , sdp, setSdp} = useContext(Context)
  const { id } = useParams()
  const [notify, notifyUi] = notification.useNotification()

  const localVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoContainerRef = useRef<HTMLDivElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const rtc = useRef<RTCPeerConnection | null>(null)
  const audio = useRef<HTMLAudioElement | null>(null)

  const [isVideoSharing, setIsVideoSharing] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isMic, setIsMic] = useState(false)
  const [status, setStatus] = useState<CallType>("pending")
  const [timer, setTimer] = useState(0)


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
    player.play()
  }

  const toggleScreen = async () => {
    try {
      const localVideo = localVideoRef.current

      if (!localVideo)
        return

      if (!isScreenSharing)
       {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        const screenShareTrack = stream.getVideoTracks()[0]
        const senderVideoTrack = rtc.current?.getSenders().find((s) => s.track?.kind === "video")

        if (screenShareTrack && senderVideoTrack) {
          await senderVideoTrack.replaceTrack(screenShareTrack)
        }
        localVideo.srcObject = stream
        localStreamRef.current = stream
        setIsScreenSharing(true)

        //Detect screen sharing off
        screenShareTrack.onended = async () => {
          setIsScreenSharing(false)
          const videoCamStream = await navigator.mediaDevices.getUserMedia({ video: true })
          const videoTrack = videoCamStream.getVideoTracks()[0]
          const senderTrack = rtc.current?.getSenders().find((s) => s.track?.kind === "video")
          if (videoTrack && senderTrack)
          {
            await senderTrack.replaceTrack(videoTrack)
          }

          localVideo.srcObject = videoCamStream
          localStreamRef.current = videoCamStream
          setIsVideoSharing(true)
        }

      }
      else {
        const localStream = localStreamRef.current
        if (!localStream)
          return

        localStream.getTracks().forEach((track) => {
          track.stop()
        })

        const videoCamStream = await navigator.mediaDevices.getUserMedia({ video: true })
        const videoTrack = videoCamStream.getVideoTracks()[0]
        const senderTrack = rtc.current?.getSenders().find((s) => s.track?.kind === "video")
        if (videoTrack && senderTrack)
        {
          await senderTrack.replaceTrack(videoTrack)
        }

        localVideo.srcObject = videoCamStream
        localStreamRef.current = videoCamStream
        setIsScreenSharing(false)
        setIsVideoSharing(true)
      }
    }

    catch (err) {
      CatchError(err)
    }
  }

  // const toggleScreen = async () => {
  //   try {
  //     const localVideo = localVideoRef.current

  //     if (!localVideo)
  //       return

  //     if (!isScreenSharing)
  //      {
  //       const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
  //       const screenShareTrack = stream.getVideoTracks()[0]
  //       const senderVideoTrack = rtc.current?.getSenders().find((s) => s.track?.kind === "video")

  //       if (screenShareTrack && senderVideoTrack) {
  //         await senderVideoTrack.replaceTrack(screenShareTrack)
  //       }
  //       localVideo.srcObject = stream
  //       localStreamRef.current = stream
  //       setIsScreenSharing(true)

  //       //Detect screen sharing off
  //       screenShareTrack.onended = async () => {
  //         setIsScreenSharing(false)
  //         const videoCamStream = await navigator.mediaDevices.getUserMedia({ video: true })
  //         const videoTrack = videoCamStream.getVideoTracks()[0]
  //         const senderTrack = rtc.current?.getSenders().find((s) => s.track?.kind === "video")
  //         if (videoTrack && senderTrack)
  //         {
  //           await senderTrack.replaceTrack(videoTrack)
  //         }

  //         localVideo.srcObject = videoCamStream
  //         localStreamRef.current = videoCamStream
  //         setIsVideoSharing(true)
  //       }

  //     }
  //     else {
  //       const localStream = localStreamRef.current
  //       if (!localStream)
  //         return

  //       localStream.getTracks().forEach((track) => {
  //         track.stop()
  //       })

  //       localVideo.srcObject = null
  //       localStreamRef.current = null
  //       setIsScreenSharing(false)
  //     }
  //   }

  //   catch (err) {
  //     CatchError(err)
  //   }
  // }

  // const toggleVideo = async () => {
  //   try {
  //     const localVideo = localVideoRef.current

  //     if (!localVideo)
  //       return

  //     if (!isVideoSharing) {
  //       const stream = await navigator.mediaDevices.getUserMedia({ video: true , audio: true})

  //       localVideo.srcObject = stream
  //       localStreamRef.current = stream
  //       setIsVideoSharing(true)
  //       setIsMic(true)
  //     }
  //     else {
  //       const localStream = localStreamRef.current
  //       if (!localStream)
  //         return

  //       localStream.getTracks().forEach((track) => {
  //         track.stop()
  //       })

  //       localVideo.srcObject = null
  //       localStreamRef.current = null
  //       setIsVideoSharing(false)
  //       setIsMic(false)
  //     }

  //   }
  //   catch (err)
  //   {
  //     CatchError(err)
  //   }
  // }

  const toggleVideo = async () => {
  try {
    const localVideo = localVideoRef.current
    if (!localVideo) return

    if (!localStreamRef.current) {
      // Pehli baar — camera start karo
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localVideo.srcObject = stream
      localStreamRef.current = stream
      setIsVideoSharing(true)
      setIsMic(true)
    }
    else {
      // Baad mein — sirf enabled toggle karo
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoSharing(videoTrack.enabled)
      }
    }
  }
  catch (err) {
    CatchError(err)
  }
}

  const toggleMic = () => {
    try {
      const localStream = localStreamRef.current
      if (!localStream)
        return

      const audioTrack = localStream.getTracks().find((tracks) => tracks.kind === "audio")
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMic(audioTrack.enabled)
      }

    }
    catch (err) {
      CatchError(err)
    }
  }

  const toggleFullScreen = (type: 'local' | 'remote') => {
    try {
      if (!isVideoSharing && !isScreenSharing)
        return toast.warn("Please start your video first", { position: "top-center" })

      const videoContainer = (type === 'local' ? localVideoContainerRef.current : remoteVideoContainerRef.current)
      if (!videoContainer)
        return

      if (!document.fullscreenElement) {
        videoContainer.requestFullscreen()
      }
      else {
        document.exitFullscreen()
      }
    }
    catch (err) {
      CatchError(err)
    }
  }

  const webRtcConnection = async () => {
    const { data } = await HttpInterceptor.get("/twilio/turn-server")
    rtc.current = new RTCPeerConnection({ iceServers: data })
    const localStream = localStreamRef.current

    if (!localStream)
      return

    localStream.getTracks().forEach((track) => {
      rtc.current?.addTrack(track, localStream)
    })

    rtc.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("candidate", { candidate: e.candidate, to: id })
      }
    }

    rtc.current.onconnectionstatechange = () => {
      console.log(rtc.current?.connectionState)
    }

    rtc.current.ontrack = (e) => {
      const remoteStream = e.streams[0]
      const remoteVideo = remoteVideoRef.current


      if (!remoteStream || !remoteVideo)
        return

      remoteVideo.srcObject = remoteStream

      const videoTracks = remoteStream.getVideoTracks()[0]
      if (videoTracks) {
        videoTracks.onmute = () => {
          console.log("video off")
          remoteVideo.style.display = "none"
        }

        videoTracks.onunmute = () => {
          remoteVideo.style.display = "block"
        }

        videoTracks.onended = () => {
          remoteVideo.srcObject = null
          remoteVideo.style.display = "none"
        }
      }

    }
  }

  const startCall = async () => {
    try {
      if (!isVideoSharing && !isScreenSharing)
        return toast("Start your video first", { position: 'top-center' })

      await webRtcConnection()

      if (!rtc.current)
        return

      const offer = await rtc.current.createOffer()
      await rtc.current.setLocalDescription(offer)
      setStatus("calling")
      playAudio("/sound/ring.mp3", true)
      notify.open({
        message: <h1 className="capitalize font-medium">{liveActiveSession.fullname}</h1>,
        description: "Calling...",
        duration: 30,
        placement: "bottomRight",
        onClose: stopAudio,
        actions: [
          <button key="end" className="bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500" onClick={endCallFromLocal}>End call</button>
        ]
      })

      socket.emit("offer", { offer, to: id, from: session, type: 'video' })
    }
    catch (err) {
      CatchError(err)
    }
  }

  const accept = async (payload: OnOfferInterface) => {
    try {
      setSdp(null)
      await webRtcConnection()

      if (!rtc.current)
        return

      const offer = new RTCSessionDescription(payload.offer)
      await rtc.current.setRemoteDescription(offer)

      const answer = await rtc.current.createAnswer()
      await rtc.current.setLocalDescription(answer)

      notify.destroy()
      setStatus("talking")
      stopAudio()
      socket.emit("answer", { answer, to: id })
    }
    catch (err) {
      CatchError(err)
    }
  }

  const redirectOnCallEnd = () => {
    setOpen(false)
    navigate("/app")
  }

  const endStreaming = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop())

    if (localVideoRef.current)
      localVideoRef.current.srcObject = null

    if (remoteVideoRef.current)
      remoteVideoRef.current.srcObject = null
  }

  // too end call on local computer
  const endCallFromLocal = () => {
    setStatus("end")
    playAudio("/sound/reject.mp3")
    notify.destroy()
    socket.emit("end", { to: id })
    endStreaming()
    setOpen(true)
  }

  // to end call on remote computer
  const onEndCallRemote = () => {
    setStatus("end")
    notify.destroy()
    playAudio("/sound/reject.mp3")
    endStreaming()
    setOpen(true)
  }

  //Event listeners
  const onOffer = (payload: OnOfferInterface) => {
    setStatus("incomming")
    notify.open({
      message: <h1 className='capitalize font-medium'>{payload.from.fullname}</h1>,
      description: "Incoming call...",
      duration: 30,
      placement: "bottomRight",
      actions: [
        <div key="calls" className="space-x-4">
          <button className="bg-green-400 px-3 py-1 rounded text-white hover:bg-green-500" onClick={() => accept(payload)}>Accept</button>
          <button className="bg-rose-400 px-3 py-1 rounded text-white hover:bg-rose-500" onClick={endCallFromLocal}>Reject</button>
        </div>
      ]
    })
  }

  //connect both uers via webrtc
  const onCandidate = async (payload: OnCandidateInterface) => {
    try {
      if (!rtc.current)
        return

      const candidate = new RTCIceCandidate(payload.candidate)
      await rtc.current.addIceCandidate(candidate)
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

      setStatus("talking")
      stopAudio()
      notify.destroy()
    }
    catch (err) {
      CatchError(err)
    }
  }

  const onBusy = ()=>{
        setStatus("pending")
        playAudio("/sound/busy.mp3")
        notify.destroy()
        notify.info({
            message: <h1 className='font-medium'>User busy !</h1>,
            duration: 1,
            onClose: stopAudio,
            placement: 'bottomRight'
        })
    }


  useEffect(() => {
    toggleVideo()
    socket.on("offer", onOffer)
    socket.on("candidate", onCandidate)
    socket.on("answer", onAnswer)
    socket.on("busy", onBusy)
    socket.on("end", onEndCallRemote)

    return () => {
      socket.off("offer", onOffer)
      socket.off("candidate", onCandidate)
      socket.off("answer", onAnswer)
      socket.off("busy", onBusy)
      socket.off("end", onEndCallRemote)
    }
  }, [])

  useEffect(() => {
    let interval: any

    if (status === "talking") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000);
    }

    return () => {
      clearInterval(interval)
    }
  }, [status])

  //Detect comming offer 

  useEffect(()=>{
    if(sdp)
    {
       notify.destroy()
       onOffer(sdp)
    }
  },[sdp])


  // if(!liveActiveSession)
  //   return navigate("/app")

  useEffect(() => {
    if (!liveActiveSession) {
      endCallFromLocal()
    }
  }, [liveActiveSession])

  return (
    <div className="space-y-8">
      <div ref={remoteVideoContainerRef} className=" bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
        <video ref={remoteVideoRef} className="w-full h-full absolute top-0 left-0" autoPlay playsInline> </video>
        <button className='absolute bottom-5 left-5 text-xs px-2.5 py-1 rounded-lg text-white' style={{
          background: 'rgba(0,0,0, 0.7)'
        }}>
          {liveActiveSession.fullname}
        </button>

        <button onClick={() => toggleFullScreen("remote")} className='absolute bottom-5 right-5 text-xs px-2.5 py-1 rounded-lg text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ' style={{
          background: 'rgba(0,0,0,0.7)'
        }}>
          <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div ref={localVideoContainerRef} className=" bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
          <video ref={localVideoRef} muted className="w-full h-full absolute top-0 left-0" autoPlay playsInline> </video>
          <button className='capitalize absolute bottom-2 left-2 text-xs px-2.5 py-1 rounded-lg text-white' style={{
            background: 'rgba(0,0,0,0.7)'
          }}>
            {session && session.fullname}
          </button>
          <button onClick={() => toggleFullScreen("local")} className='absolute bottom-2 right-2 text-xs px-2.5 py-1 rounded-lg text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ' style={{
            background: 'rgba(0,0,0,0.7)'
          }}>
            <i className="ri-fullscreen-exit-line"></i>
          </button>
        </div>
        <Button type="primary" icon="user-add-line" >Add</Button>

      </div>

      <div className=" flex justify-between items-center">
        <div className='space-x-4'>

          <button
            onClick={toggleVideo}
            className={`${isVideoSharing ? "bg-green-500" : "bg-green-300"} text-white w-12 h-12 rounded-full hover:bg-green-400 hover:text-white`}
          >
            {
              isVideoSharing ?
                <i className="ri-video-on-ai-line"></i>
                :
                <i className="ri-video-off-line"></i>
            }

          </button>

          <button onClick={toggleMic} className='bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white'>
            {
              isMic ?
                <i className="ri-mic-line"></i>
                :
                <i className="ri-mic-off-line"></i>
            }

          </button>

          <button onClick={toggleScreen}
            className={`${isScreenSharing ? "bg-blue-500" : "bg-blue-300"} text-white w-12 h-12 rounded-full hover:bg-blue-400 hover:text-white`}
          >
            {
              isScreenSharing ?
                <i className="ri-tv-2-line"></i>
                :
                <i className="ri-chat-off-line"></i>
            }
          </button>

        </div>
        <div className="space-x-4">
          {
            status === "talking" &&
            <label>{getCallTiming(timer)}</label>
          }
          {
            (status === "pending" || status === "end") &&
            <Button icon="phone-line" type="success" onClick={startCall}>Call</Button>
          }

          {
            status === "talking" &&
            <Button icon="close-circle-line" type="danger" onClick={endCallFromLocal}>End</Button>
          }
        </div>
      </div>
      <Modal open={open} footer={null} centered maskClosable onCancel={redirectOnCallEnd}>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">Call Ended</h1>
          <Button type="danger" onClick={redirectOnCallEnd}>Thank You</Button>
        </div>

      </Modal>
      {notifyUi}
    </div>
  )
}

export default Video



