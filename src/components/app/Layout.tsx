import { Link, Outlet , useLocation, useNavigate} from "react-router-dom"
import Avtar from "../shared/Avtar"
import Card from "../shared/Card"
import { useContext, useEffect, useState } from "react"
import Dashboard from "./Dashboard"
import Context from "../../Context"
import HttpInterceptor from "../../lib/HttpInterceptor"
import {v4 as uuid} from  'uuid'
import useSWR, { mutate } from "swr"
import Fetcher from "../../lib/Fetcher"
import CatchError from "../../lib/CatchError"
import FriendSuggestion from "./FriendSuggestion"
import FriendRequest from "./FriendRequest"
const EightMinuteInMs = 8*60*1000

const Layout = () =>{
    const [leftAsideSize, setLeftAsideSize] = useState(350)
    const rightAsideSize = 450
    const collapsseSize = 140
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const {error} = useSWR('/auth/refresh-token', Fetcher, {
        refreshInterval: EightMinuteInMs,
        shouldRetryOnError: false
    })

     useEffect(()=>{
        if(error) 
        {
            logout()
        }
     }, [error])

    const {session, setSession} = useContext(Context)

    

    const menus =[
        {
            icon: "ri-home-9-line",
            href: "/app/dashboard",
            label:"dashboard"
        },
        {
            icon: "ri-chat-smile-3-line",
            href: "/app/my-posts",
            label:" my post"
        },
        {
            icon: "ri-group-line",
            href: "/app/friends",
            label:"friends"
        },
    ]

    const logout = async() =>{
        try{
          await HttpInterceptor.post("/auth/logout")
          navigate("/login")
        }
        catch(err)
        {
            CatchError(err)
        }
    }

const getPathname =(path: string) =>{
    const firstPath = path.split("/").pop()
   const finalPath =  firstPath?.split("-").join(" ")
    return finalPath
}

  const uploadImage = ()=>{
    const input = document.createElement("input")
    input.type ="file"
    input.accept ="image/*"
    input.click()
    input.onchange =async() =>{
      if(!input.files)
        return 

       const file= input.files[0]
       const path = `profile-pictures/${uuid()}.png`
       
       const payload = {
          path ,
          type: file.type,
          status: "public-read"
       }

       try{
         const options = {
            headers: {
              'Content-Type' : file.type
            }
        }
         const {data} = await HttpInterceptor.post("/storage/upload", payload)
         await HttpInterceptor.put(data.url, file, options)
         const {data: user} = await HttpInterceptor.put("/auth/profile-picture",{path})
         setSession({...session, image: user.image})
         mutate('/auth/refresh-token')
        }
       catch(err)
       {
        console.log(err)
       }
    }
  }

 
    return (
        <div className=" min-h-screen">
            <aside 
             className="bg-white fixed top-0 left-0 h-full  p-8 overflow-auto " 
             style={{
                width:  leftAsideSize ,
                transition: "0.2s"
            }}>
            <div className="space-y-8 h-full rounded-2xl p-8  bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900" >
                  {
                    leftAsideSize === collapsseSize ?
                     <i className="ri-user-fill text-xl text-white animate__animated animate__fadeIn"></i>
                     :
                    
                    <div className="animate__animated animate__fadeIn">
                        {
                            session  &&
                             <Avtar 
                                title ={session.fullname}
                                subtitle={session.email}
                                image= {session.image || "/images/avtar.jpg"}
                                titleColor="white"
                                subtitleColor="#ddd"
                                onClick={uploadImage}
                            />
                        
                        }
                      
                    </div>
                  }
              <div>
                   
                    {
                        menus.map((item, index) =>(
                         <Link key={index} to={item.href} className="flex items-center gap-4 text-gray-300 py-3 hover:text-white">
                          <i className={`${item.icon} text-xl`} title={item.label}></i>
                           <label className={`capitalize ${leftAsideSize === collapsseSize ?'hidden':''}`}>{item.label}</label>
                         </Link>
                  ))
                    }
                      

                    

                    <button onClick={logout} className="flex items-center gap-3 text-gray-300 py-3 hover:text-white" title="Logout">
                        <i className="ri-logout-circle-r-line text-xl"></i>
                        <label className={leftAsideSize === collapsseSize ?'hidden':''}>Logout</label>
                    </button>
                  </div>
                   
             </div>
            </aside>

            <section className="  py-8  px-1 " 
            style={{
                 width:  `calc(100% - ${leftAsideSize+rightAsideSize}px)` ,
                 marginLeft: leftAsideSize,
                 transition: "0.2s"
              }}
           >
               
                <Card  title={
                    <div className="flex gap-4 items-center">
                         <button className="bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={()=> setLeftAsideSize(leftAsideSize === 350 ?collapsseSize : 350)}>
                            <i className="ri-arrow-left-line"></i>
                         </button>
                         <h1>{getPathname(pathname)}</h1>
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
            </section>

            <aside
            className= "bg-white  fixed top-0 right-0 h-full  p-8 overflow-auto space-y-8"
            style={{
                width: rightAsideSize,
                transition: "0.2s"
            }}>

        
            <FriendSuggestion />
             <FriendRequest />
                    <Card title=" Friends" divider >
                    <div className="space-y-5 " >
                        {
                            Array(20).fill(0).map((item, index)=>(
                              <div key={index} className=" bg-gray-50 p-3 rounded-lg flex justify-between">
                                 <Avtar
                                size="md"
                                image="/images/avtar.jpg"
                                title="Saurav Kumar"
                                subtitle={
                                  <small className={ `${index %2 ===0 ? 'text-zinc-500' : 'text-green-600'} font-medium`}>
                                    {index %2 ===0 ? 'Offline' : 'Online'}
                                  </small>
                                }
                             />
                             <div className="space-x-3">
                                
                                <Link to="/app/chat">
                                    <button className="hover:text-blue-600 text-blue-500" title="chat">
                                        <i className="ri-chat-ai-line"></i>
                                    </button>
                                </Link>
                                
                                
                                <Link to="/app/audio-chat">
                                     <button className="hover:text-green-600 text-green-400" title="call">
                                       <i className="ri-phone-line"></i>
                                     </button>
                                </Link>
                                

                                <Link to="/app/video-chat" >
                                <button className="hover:text-amber-600 text-amber-500" title="video call">
                                    <i className="ri-video-on-ai-line"></i>
                                </button>
                                </Link>
                                
                            </div>
                         </div>
            ))
                        }
                    </div>
                  </Card>
            </aside>
            
            
        </div>
    )
}
export default Layout