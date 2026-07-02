import Avtar from "../shared/Avtar"
import Button from "../shared/Button"
import Input from "../shared/Input"


const Chat = () => {
  return (
    <div>
    <div className='h-[450px] overflow-auto space-y-12 pr-6 relative'>

     {
        Array(20).fill(0).map((item, index)=>(
           <div className="space-y-12" key={index}>
        <div className="flex gap-4 items-start">
          <Avtar  image='/images/avtar.jpg' size='md'/>
          <div className=" relative bg-rose-50 px-4 py-2 rounded-lg flex-1 text-pink-500 border border-rose-100">
              <h1 className="font-medium text-black">Er Sourav</h1>
            <label>
                 Lorem ipsum dolor sit amet consectetur adipisicing elit.
             </label>
          <i className="ri-arrow-left-s-fill absolute top-0 -left-5 text-4xl text-rose-50"></i> 
        </div>
      </div>

     <div className="flex gap-4 items-start">
        <div className=" relative bg-violet-50 px-4 py-2 rounded-lg flex-1 text-blue-500 border border-violet-100">
            <h1 className="font-medium text-black">Er Sourav</h1>
            <label>
                 Lorem ipsum dolor sit amet consectetur adipisicing elit.
             </label>
          <i className="ri-arrow-right-s-fill absolute top-0 -right-5 text-4xl text-violet-50"></i> 
        </div>
         <Avtar  image='/images/avtar.jpg' size='md'/>
        </div> 
           </div>
        ))    
    }
    </div>

    <div  className="p-3">
        <div className='flex items-center gap-4'>
            <form className="flex gap-4 flex-1">
                <Input name=" message" placeholder="type your message here"/>
                <Button  type="secondary" icon="send-plane-fill">Send</Button>
             </form>
             <button className='w-12 h-12 bg-rose-50 text-rose-500 rounded-full hover:bg-rose-400 hover:text-white'>
                <i className="ri-attachment-2"></i>
             </button>
        </div>
    </div>

     
    </div>
  )
}

export default Chat
