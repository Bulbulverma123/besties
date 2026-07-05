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
import FriendsSuggestion from "./friend/FriendSuggestion"
import FriendsRequest from "./friend/FriendsRequest"
import FriendsList from "./friend/FriendsList"
import { useMediaQuery } from 'react-responsive'
import Logo from "../shared/Logo"
import IconButton from "../shared/IconButton"
const EightMinuteInMs = 8*60*1000

const Layout = () =>{
    const isMobile = useMediaQuery({ query: '(max-width: 1224px)' })
    const [leftAsideSize, setLeftAsideSize] = useState(0)
    const rightAsideSize = 450
    const [collapsseSize, setCollapseSize ]= useState(0)
    const {pathname} = useLocation()
    const navigate = useNavigate()
    const {error} = useSWR('/auth/refresh-token', Fetcher, {
        refreshInterval: EightMinuteInMs,
        shouldRetryOnError: false
    })

     const friendsUiBlackList = [
         "/app/friends",
         "/app/chat",
         "/app/audio-chat",
          "/app/video-chat",
    ]

   const isBlackListed = friendsUiBlackList.some((path)=> path === pathname)

     useEffect(()=>{
        if(error) 
        {
            logout()
        }
     }, [error])

    
     useEffect(()=>{
        setLeftAsideSize(isMobile ? 0 : 350 )
        setCollapseSize(isMobile ? 0 : 140)
     }, [isMobile])

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
             <nav className="lg:hidden flex justify-between items-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 sticky top-0 left-0 z-[20000] w-full py-4 px-6">
                  <Logo />
                  <div className="flex gap-4">
                    <IconButton onClick={logout} icon="logout-circle-line" type="success" />
                    <Link to="/app/friends">
                      <IconButton icon="chat-ai-line" type="danger" />
                    </Link>
                    <IconButton onClick={()=> setLeftAsideSize(leftAsideSize === 250 ?collapsseSize : 250)} icon="menu-3-line" type="warning" />
                  </div>
            </nav > 
          <aside 
             className="bg-white fixed top-0 left-0 h-full lg:p-8 overflow-auto z-[20000] " 
             style={{
                width:  leftAsideSize ,
                transition: "0.2s"
            }}>
            <div className="space-y-8 h-full lg:rounded-2xl p-8  bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900" >
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

        <section 
             className="lg:py-8  lg:px-1 p-6 space-y-8" 
             style={{
                 width: isMobile ? '100%' :  `calc(100% - ${leftAsideSize+rightAsideSize}px)` ,
                 marginLeft: isMobile ? 0 : leftAsideSize,
                 transition: "0.2s"
              }}
              >
                

             {
                  !isBlackListed &&
                   <FriendsRequest />
              }
                <Card 
                  title={
                    <div className="flex gap-4 items-center">
                         <button className="lg:block hidden bg-gray-100 w-10 h-10 rounded-full hover:bg-slate-200" onClick={()=> setLeftAsideSize(leftAsideSize === 350 ?collapsseSize : 350)}>
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
                {
                  !isBlackListed &&
                       <FriendsSuggestion />
                 }
               
            </section>

            <aside
                 className= "lg:block hidden bg-white  fixed top-0 right-0 h-full  p-8 overflow-auto space-y-8"
                 style={{
                     width: rightAsideSize,
                     transition: "0.2s"
                 }}>
                    {
                      !isBlackListed &&
                         <Card title=" Friends" divider >
                            <FriendsList  gap={6} columns={2}/>
                         </Card>
                    }
                   <Card title="Recent posts" divider>

                   </Card>
           
            </aside>
         </div>
    )
}
export default Layout