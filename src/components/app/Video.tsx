import Button from "../shared/Button"


const Video = () => {
  return (
    <div className="space-y-8">
      <div className=" bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
        <video className="w-full h-full absolute top-0 left-0" > </video>
        <button className='absolute bottom-5 left-5 text-xs px-2.5 py-1 rounded-lg text-white' style={{
            background: 'rgba(255, 255, 255, 0.1)'
        }}>
                 Sourav kumar
        </button>

        <button className='absolute bottom-5 right-5 text-xs px-2.5 py-1 rounded-lg text-white transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 ' style={{
            background: 'rgba(255, 255, 255, 0.1)'
        }}>
                <i className="ri-fullscreen-exit-line"></i>
        </button>
      </div>

     <div className="grid grid-cols-3 gap-4">
          <div className=" bg-black w-full h-0 relative pb-[56.25%] rounded-xl">
              <video className="w-full h-full absolute top-0 left-0" > </video>
               <button className='absolute bottom-2 left-2 text-xs px-2.5 py-1 rounded-lg text-white' style={{
               background: 'rgba(255, 255, 255, 0.1)'
                }}>
                 Sourav kumar
               </button>
            </div>

           <Button type="primary" icon="user-add-line" >Add</Button>

         
     </div>

    


     <div  className=" flex justify-between items-center">
      <div className='space-x-4'>
         
          <button className='bg-green-500 text-white w-12 h-12 rounded-full hover:bg-green-400 hover:text-white'>
          <i className="ri-video-on-ai-line"></i>
          </button>
           <button className='bg-amber-500 text-white w-12 h-12 rounded-full hover:bg-amber-400 hover:text-white'>
          <i className="ri-mic-line"></i>
          </button>
          <button className='bg-blue-500 text-white w-12 h-12 rounded-full hover:bg-blue-400 hover:text-white'>
           <i className="ri-tv-2-line"></i>          
           </button>
          
         
       
       </div>
       <Button icon="close-circle-fill" type="danger">End</Button>
     </div>
    </div>
  )
}

export default Video